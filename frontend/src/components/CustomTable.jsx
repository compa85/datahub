import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addRecords, deleteRecord } from "../redux/dataSlice";
import { dbSelect, dbDelete } from "../database";
import {
    Button,
    Input,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    getKeyValue,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPenToSquare,
    faTrash,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

function CustomTable({ onOpen }) {
    const data = useSelector((state) => state.data.values);
    const dispatch = useDispatch();

    // colonne della tabella
    const columns = [
        {
            key: "CodAttore",
            label: "ID",
        },
        {
            key: "Nome",
            label: "NOME",
        },
        {
            key: "Cognome",
            label: "COGNOME",
        },
        {
            key: "Nazionalita",
            label: "NAZIONALITÀ",
        },
        {
            key: "AnnoNascita",
            label: "ANNO NASCITA",
        },
        {
            key: "Azioni",
            label: "AZIONI",
        },
    ];

    // caricare dati al caricamento della pagina
    useEffect(() => {
        const object = {
            attori: [],
        };
        dbSelect(object).then((response) => {
            dispatch(addRecords(response.result[0]));
        });
    }, []);

    // eliminazione
    const handleDelete = (id) => {
        const object = {
            attori: [
                {
                    CodAttore: id,
                },
            ],
        };
        dbDelete(object).then((response) => {
            console.log(response);
            dispatch(deleteRecord(id));
        });
    };

    return (
        <>
            <Table
                aria-label="Tabella attori"
                isHeaderSticky
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Button
                            onPress={onOpen}
                            startContent={<FontAwesomeIcon icon={faPlus} />}
                        >
                            Aggiungi
                        </Button>
                    </div>
                }
                classNames={{
                    base: "max-h-[85vh] overflow-scroll",
                    table: "min-h-[400px]",
                }}
            >
                <TableHeader>
                    {columns.map((column) => (
                        <TableColumn key={column.key}>
                            {column.label}
                        </TableColumn>
                    ))}
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item.CodAttore}>
                            {(columnKey) =>
                                columnKey == "Azioni" ? (
                                    <TableCell>
                                        <div className="relative flex items-center">
                                            <Button
                                                isIconOnly
                                                className="bg-transparent"
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
                                                        item.CodAttore,
                                                    );
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    className="text-danger text-md"
                                                />
                                            </Button>
                                        </div>
                                    </TableCell>
                                ) : (
                                    <TableCell>
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
                                    </TableCell>
                                )
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default CustomTable;
