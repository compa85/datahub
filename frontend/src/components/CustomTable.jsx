import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addColumns } from "../redux/columnsSlice";
import { addRows, deleteRow, deleteAllRows } from "../redux/rowsSlice";
import { setHeaderLoading, setBodyLoading } from "../redux/loadingSlice";
import { dbSelect, dbDelete, dbGetColumns } from "../database";
import {
    Button,
    Chip,
    Input,
    Spinner,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    Tooltip,
    getKeyValue,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPenToSquare,
    faTrash,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

function CustomTable({ table, onOpen, showToast }) {
    // ======================================== REDUX =========================================
    const columns = useSelector((state) => state.columns.values);
    const rows = useSelector((state) => state.rows.values);
    const loading = useSelector((state) => state.loading.values);
    const dispatch = useDispatch();

    // ====================================== VARIABILI =======================================
    // chiavi primarie della tabella
    const [primaryKeys, setPrimaryKeys] = useState([]);

    // ================================== CARICAMENTO TABELLA =================================
    useEffect(() => {
        dispatch(setHeaderLoading(true));
        dispatch(setBodyLoading(true));
        dispatch(deleteAllRows());
        setPrimaryKeys([]);

        setTimeout(() => {
            // carico le colonne della tabella (campi)
            dbGetColumns({ tables: [table] }).then((response) => {
                dispatch(addColumns(response.result[0]));
                dispatch(setHeaderLoading(false));
            });
        }, 1000);

        setTimeout(() => {
            // carico le righe della tabella
            dbSelect({ [table]: [] }).then((response) => {
                dispatch(addRows(response.result[0]));
                dispatch(setBodyLoading(false));
            });
        }, 1000);
    }, [table]);

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

    // ===================================== AGGIORNAMENTO ====================================
    const handleUpdate = () => {
        console.log();
    };

    // ===================================== ELIMINAZIONE =====================================
    const handleDelete = (id) => {
        const object = {
            [table]: [
                {
                    [primaryKeys[0]]: id,
                },
            ],
        };
        dbDelete(object).then((response) => {
            showToast(response);
            dispatch(deleteRow({ fieldName: primaryKeys[0], fieldValue: id }));
        });
    };

    // ======================================== RETURN ========================================
    return (
        <>
            <div className="mb-4 flex justify-end gap-3">
                <Button
                    color="primary"
                    endContent={<FontAwesomeIcon icon={faPlus} />}
                    onPress={onOpen}
                >
                    Aggiungi
                </Button>
            </div>

            <Table
                aria-label="Tabella"
                isHeaderSticky
                classNames={{
                    base: "max-h-[80vh] overflow-scroll",
                    table: "min-h-[400px]",
                }}
            >
                <TableHeader>
                    {loading.header ? (
                        <TableColumn>Caricamento...</TableColumn>
                    ) : (
                        columns.map((column) => (
                            <TableColumn key={column.Field}>
                                <Tooltip content={column.Type} placement="top">
                                    <Chip className="cursor-pointer bg-transparent">
                                        {column.Field}
                                    </Chip>
                                </Tooltip>
                            </TableColumn>
                        ))
                    )}
                    <TableColumn key="Azioni">
                        <Chip className="cursor-pointer bg-transparent">
                            Azioni
                        </Chip>
                    </TableColumn>
                </TableHeader>
                <TableBody
                    isLoading={loading.body}
                    loadingContent={<Spinner label="Caricamento..." />}
                >
                    {rows.map((item, index) => (
                        <TableRow
                            key={
                                primaryKeys.length > 0
                                    ? item[primaryKeys][0]
                                    : index
                            }
                        >
                            {(columnKey) => (
                                <TableCell>
                                    {columnKey == "Azioni" ? (
                                        <div className="relative flex items-center">
                                            <Button
                                                isIconOnly
                                                className="bg-transparent"
                                                onPress={() => {
                                                    handleUpdate();
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPenToSquare}
                                                    className="text-default-400 text-md"
                                                />
                                            </Button>
                                            <Button
                                                isIconOnly
                                                text-danger
                                                className="bg-transparent"
                                                onPress={() => {
                                                    handleDelete(
                                                        item[primaryKeys[0]],
                                                    );
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="text-danger text-md"
                                                />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Input
                                            isReadOnly
                                            type="text"
                                            size="sm"
                                            value={
                                                getKeyValue(item, columnKey) !=
                                                null
                                                    ? getKeyValue(
                                                          item,
                                                          columnKey,
                                                      )
                                                    : ""
                                            }
                                            variant="bordered"
                                        />
                                    )}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default CustomTable;
