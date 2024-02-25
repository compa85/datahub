import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addRow, sortRows } from "../redux/rowsSlice";
import { addField, resetFields, deleteAllFields } from "../redux/formSlice";
import { dbInsert, dbGetLastId } from "../database";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Spinner } from "@nextui-org/react";

function CustomFormModal({ isOpen, onOpenChange, showToast }) {
    // ======================================== REDUX =========================================
    const database = useSelector((state) => state.database);
    const table = database.table;
    const primaryKeys = database.primaryKeys;
    const numericType = database.numericTypes;
    const columns = useSelector((state) => state.columns.values);
    const rows = useSelector((state) => state.rows.values);
    const loading = useSelector((state) => state.loading.values);
    const form = useSelector((state) => state.form.values);
    const dispatch = useDispatch();

    // =================================== CARICAMENTO INPUT ==================================
    useEffect(() => {
        dispatch(deleteAllFields());
    }, [columns]);

    // ================================= CARICAMENTO ULTIMO ID ================================
    useEffect(() => {
        if (primaryKeys[0] !== "undefined" && primaryKeys.length > 0) {
            // inizializzo l'oggetto da passare a dbGetLastId()
            let object = {
                tables: [table],
            };

            // ottengo l'ultimo id dal db
            dbGetLastId(object).then((response) => {
                const lastId = parseInt(response.result[0][0][primaryKeys[0]]);
                // aggiungo il campo con l'id al form
                dispatch(addField({ fieldName: primaryKeys[0], fieldValue: lastId + 1 }));
            });
        }
    }, [rows, primaryKeys]);

    // ================================== AGGIORNAMENTO INPUT =================================
    function handleInputChange(e) {
        const { value, name } = e.target;
        dispatch(addField({ fieldName: name, fieldValue: value }));
    }

    // ====================================== INSERIMENTO =====================================
    function handleSubmit() {
        // inizializzo l'oggetto da passare a dbInsert()
        let object = {
            [table]: [{}],
        };

        for (const field in form) {
            if (form[field] !== "" && form[field] !== primaryKeys[0]) {
                object[table][0][field] = form[field];
            }
        }

        // inserisco la riga nel db
        dbInsert(object).then((response) => {
            if (response.status === "ok") {
                // ottengo l'ultimo id
                const lastId = response.result[0];

                // aggiungo l'id come attributo dell'oggetto da inserire nella tabella
                object = {
                    ...object[table][0],
                    [primaryKeys[0]]: lastId,
                };

                // inserisco la riga nella tabella
                dispatch(addRow(object));
                // resetto gli input
                dispatch(resetFields(primaryKeys));
                // riordino le righe della tabella con il criterio esistente
                dispatch(sortRows({ column: null }));
            }
            showToast(response);
        });
    }

    // ======================================== RESET =========================================
    function handleReset() {
        dispatch(resetFields(primaryKeys));
    }

    // ======================================== RETURN ========================================
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Aggiungi</ModalHeader>
                        <ModalBody>
                            {loading.header == true ? (
                                <Spinner label="Caricamento..." />
                            ) : (
                                columns.map((column) => (
                                    <Input
                                        key={column.Field}
                                        name={column.Field}
                                        label={column.Field}
                                        type={numericType.some((type) => column.Type.includes(type)) ? "number" : "text"}
                                        value={form[column.Field]}
                                        isRequired={column.Null === "YES" ? false : true}
                                        isReadOnly={primaryKeys[0] === column.Field ? true : false}
                                        onChange={handleInputChange}
                                        variant="bordered"
                                    />
                                ))
                            )}
                        </ModalBody>
                        <ModalFooter className="flex justify-center">
                            <Button color="primary" onPress={handleSubmit}>
                                Aggiungi
                            </Button>
                            <Button color="default" onPress={handleReset}>
                                Cancella
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}

export default CustomFormModal;
