import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadTable, setPrimaryKeys, deleteAllPrimaryKeys } from "../redux/dbSlice";
import { addColumns, deleteAllColumns } from "../redux/columnsSlice";
import { addRows, updateRow, deleteRow, deleteRows, deleteAllRows } from "../redux/rowsSlice";
import { setHeaderLoading, setBodyLoading } from "../redux/loadingSlice";
import { dbSelect, dbDelete, dbUpdate, dbGetColumns } from "../database";
import { Button, Chip, Input, Spinner, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Tooltip, getKeyValue } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faPlus, faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";

function CustomTable({ onOpen, showToast }) {
    // ======================================== REDUX =========================================
    const database = useSelector((state) => state.database);
    const table = database.table;
    const primaryKeys = database.primaryKeys;
    const numericType = database.numericTypes;
    const columns = useSelector((state) => state.columns.values);
    const rows = useSelector((state) => state.rows.values);
    const loading = useSelector((state) => state.loading.values);
    const dispatch = useDispatch();

    // ====================================== VARIABILI =======================================
    // riga da modificare
    const [updatingRow, setUpdatingRow] = useState(null);
    // righe selezionate
    const [selectedRows, setSelectedRows] = useState(new Set([]));

    // ================================== CARICAMENTO TABELLA =================================
    useEffect(() => {
        // imposto gli stati dei caricamenti a true
        dispatch(setHeaderLoading(true));
        dispatch(setBodyLoading(true));
        // elimino tutti i dati delle colonne, delle righe e delle chiavi primarie
        dispatch(deleteAllColumns());
        dispatch(deleteAllRows());
        dispatch(deleteAllPrimaryKeys());
        // reimposto updatingRow e selectedRows
        setUpdatingRow(null);
        setSelectedRows(new Set([]));
        // carico il valore di table salvato nel local storage
        dispatch(loadTable());

        // controllo che sia presente un nome della tabella
        if (table !== null && table !== "") {
            // carico le colonne della tabella
            dbGetColumns({ tables: [table] }).then((response) => {
                if (response.status === "ok") {
                    dispatch(addColumns(response.result[0]));
                } else {
                    showToast(response);
                }
                dispatch(setHeaderLoading(false));
            });

            // carico le righe della tabella
            dbSelect({ [table]: [] }).then((response) => {
                if (response.status === "ok") {
                    dispatch(addRows(response.result[0]));
                } else {
                    showToast(response);
                }
                dispatch(setBodyLoading(false));
            });
        } else {
            dispatch(setHeaderLoading(false));
            dispatch(setBodyLoading(false));
        }
    }, [table]);

    // =================================== CHIAVI PRIMARIE ====================================
    // cerco le chiavi primarie
    useEffect(() => {
        if (columns.length > 0) {
            let tmp = [];
            columns.forEach((column) => {
                if (column.Key == "PRI") {
                    tmp.push(column.Field);
                }
            });
            dispatch(setPrimaryKeys(tmp));
        }
    }, [columns]);

    // ===================================== AGGIORNAMENTO ====================================
    // gestire l'update
    const handleUpdate = (row) => {
        setUpdatingRow(row);
    };

    // gestire l'input change
    const handleInputChange = (e) => {
        const { value, name } = e.target;
        setUpdatingRow({ ...updatingRow, [name]: value });
    };

    // confermare la modifica
    const confirmUpdate = () => {
        let updatedRow = {};

        // aggiungo ad updatedRow solo i campi che non sono null e non sono delle chiavi primarie
        for (const field in updatingRow) {
            if (updatingRow[field] !== null && field !== primaryKeys[0]) {
                updatedRow[field] = updatingRow[field];
            }
        }

        // inizializzo l'oggetto da passare a dbUpdate()
        const object = {
            [table]: [
                [
                    {
                        [primaryKeys[0]]: updatingRow[primaryKeys[0]],
                    },
                    updatedRow,
                ],
            ],
        };

        // aggiorno le righe del db
        dbUpdate(object).then((response) => {
            if (response.status === "ok") {
                // aggiorno le righe della tabella
                dispatch(updateRow(object[table][0]));
                // rispristino lo stato della riga da modificare
                setUpdatingRow(null);
            }
            showToast(response);
        });
    };

    // scartare la modifica
    const discardUpdate = () => {
        setUpdatingRow(null);
    };

    // ===================================== ELIMINAZIONE =====================================
    const handleDelete = (id) => {
        // flag per resettare lo stato di selectedRows
        let resettable = true;

        const object = {
            [table]: [],
        };

        // controllo se sono selezionate tutte le righe
        if (selectedRows === "all") {
            dispatch(deleteAllRows());
        }
        // controllo se ci sono più righe selezionate
        else if (selectedRows.size > 0 && selectedRows.has(id)) {
            for (const key of selectedRows) {
                object[table].push({ [primaryKeys[0]]: key });
            }
        } else {
            object[table].push({ [primaryKeys[0]]: id });
            resettable = false;
        }

        // elimino le righe dal db
        dbDelete(object).then((response) => {
            if (response.status === "ok") {
                // elimino le righe dalla tabella
                dispatch(deleteRows(object[table]));
                if (resettable) {
                    // rispristino lo stato delle righe selezionate
                    setSelectedRows(new Set([]));
                }
            }
            showToast(response);
        });
    };

    // ======================================== RETURN ========================================
    return (
        <>
            <div className="mb-4 flex justify-end gap-3">
                <Button color="primary" endContent={<FontAwesomeIcon icon={faPlus} />} onPress={onOpen}>
                    Aggiungi
                </Button>
            </div>

            <Table
                aria-label="Tabella"
                isHeaderSticky
                selectionMode="multiple"
                selectedKeys={selectedRows}
                onSelectionChange={setSelectedRows}
                classNames={{
                    base: "max-h-[65vh] overflow-scroll",
                    table: "min-h-[400px]",
                }}
                onCellAction={() => {
                    /* evitare di selezionare la riga cliccando sugli input */
                }}
            >
                <TableHeader>
                    {loading.header ? (
                        <TableColumn>Caricamento...</TableColumn>
                    ) : (
                        [
                            columns.map((column) => (
                                <TableColumn key={column.Field}>
                                    <Tooltip content={column.Type} placement="top">
                                        <Chip className="cursor-pointer bg-transparent">{column.Field}</Chip>
                                    </Tooltip>
                                </TableColumn>
                            )),
                            <TableColumn key="Azioni">
                                <Chip className="cursor-pointer bg-transparent">Azioni</Chip>
                            </TableColumn>,
                        ]
                    )}
                </TableHeader>
                <TableBody isLoading={loading.body} loadingContent={<Spinner label="Caricamento..." />} emptyContent={loading.body === true ? "" : "Nessuna riga da visualizzare"}>
                    {rows.map((row, index) => (
                        <TableRow key={primaryKeys.length > 0 ? row[primaryKeys[0]] : index}>
                            {(columnKey) => (
                                <TableCell>
                                    {columnKey == "Azioni" ? (
                                        <div className="relative flex items-center">
                                            {updatingRow != null && updatingRow[primaryKeys[0]] === row[primaryKeys[0]] ? (
                                                <>
                                                    <Button isIconOnly className="bg-transparent" onPress={() => confirmUpdate()}>
                                                        <FontAwesomeIcon icon={faCheck} className="text-success text-lg" />
                                                    </Button>
                                                    <Button isIconOnly text-danger className="bg-transparent" onPress={() => discardUpdate()}>
                                                        <FontAwesomeIcon icon={faXmark} className="text-danger text-lg" />
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button isIconOnly className="bg-transparent" onPress={() => handleUpdate(row)}>
                                                        <FontAwesomeIcon icon={faPenToSquare} className="text-default-400" />
                                                    </Button>
                                                    <Button isIconOnly text-danger className="bg-transparent" onPress={() => handleDelete(row[primaryKeys[0]])}>
                                                        <FontAwesomeIcon icon={faTrash} className="text-danger" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <Input
                                            name={columnKey}
                                            type={numericType.some((type) => columns.some((c) => c.Field === columnKey && c.Type.includes(type))) ? "number" : "text"}
                                            isReadOnly={updatingRow != null && updatingRow[primaryKeys[0]] === row[primaryKeys[0]] && columnKey != primaryKeys[0] ? false : true}
                                            value={
                                                updatingRow !== null && updatingRow[primaryKeys[0]] === row[primaryKeys[0]]
                                                    ? updatingRow[columnKey]
                                                    : getKeyValue(row, columnKey) != null
                                                      ? getKeyValue(row, columnKey)
                                                      : ""
                                            }
                                            variant={updatingRow != null && updatingRow[primaryKeys[0]] === row[primaryKeys[0]] ? "faded" : "bordered"}
                                            size="sm"
                                            onChange={(e) => handleInputChange(e)}
                                            onClick={(e) => e.stopPropagation()}
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
