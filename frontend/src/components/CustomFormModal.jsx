import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addRow } from "../redux/rowsSlice";
import { addField, resetField, resetFields } from "../redux/formSlice";
import { dbInsert } from "../database";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Spinner } from "@nextui-org/react";

function CustomFormModal({ table, isOpen, onOpenChange, showToast, numericType }) {
    // ======================================== REDUX =========================================
    const columns = useSelector((state) => state.columns.values);
    const loading = useSelector((state) => state.loading.values);
    const form = useSelector((state) => state.form.values);
    const dispatch = useDispatch();

    // ====================================== VARIABILI =======================================
    // chiavi primarie della tabella
    const [primaryKeys, setPrimaryKeys] = useState([]);

    // =================================== CHIAVI PRIMARIE ====================================
    useEffect(() => {
        let array = [];
        columns.forEach((column) => {
            if (column.Key == "PRI") {
                array.push(column.Field);
            }
        });
        setPrimaryKeys(array);
    }, [columns]);

    // ================================== AGGIORNAMENTO INPUT =================================
    function handleInputChange(e) {
        const { value, name } = e.target;
        dispatch(addField({ fieldName: name, fieldValue: value }));
    }

    // =================================== CARICAMENTO INPUT ==================================
    useEffect(() => {
        columns.forEach((column) => {
            if (primaryKeys[0] === column.Field) {
                dispatch(addField({ fieldName: column.Field, fieldValue: "" }));
            } else {
                dispatch(addField({ fieldName: column.Field, fieldValue: "" }));
            }
        });
    }, [columns]);

    // ====================================== INSERIMENTO =====================================
    function handleSubmit() {
        let object = {};

        for (const field in form) {
            if (form[field] !== "") {
                object[field] = form[field];
            }
        }

        dbInsert({ [table]: [object] }).then((response) => {
            if (response.status === "ok") {
                object = {
                    ...object,
                    [primaryKeys[0]]: String(response.result[0]),
                };
                dispatch(addRow(object));
                dispatch(resetFields());
            }
            showToast(response);
        });
    }

    // ======================================== RESET =========================================
    function handleReset() {
        dispatch(resetFields());
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
                                        label={column.Field}
                                        name={column.Field}
                                        type={numericType.some((type) => column.Type.includes(type)) ? "number" : "text"}
                                        isRequired={column.Null === "YES" ? false : true}
                                        isReadOnly={primaryKeys[0] === column.Field ? true : false}
                                        {...(primaryKeys[0] === column.Field ? "isClearable" : "")}
                                        value={form[column.Field]}
                                        variant="bordered"
                                        onChange={handleInputChange}
                                        onClear={primaryKeys[0] === column.Field ? "" : () => dispatch(resetField(column.Field))}
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
