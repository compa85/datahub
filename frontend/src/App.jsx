import React from "react";
import { useState, useEffect } from "react";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell,
    getKeyValue,
    useDisclosure,
} from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { dbSelect, dbInsert, dbUpdate, dbDelete } from "./database";
import Toast from "./components/Toast";

function App() {
    // =========================================== STATI ===========================================
    // dati degli attori
    const [data, setData] = useState([]);
    // dati del form di inserimento
    const [formData, setFormData] = useState({
        Nome: "",
        Cognome: "",
        Nazionalita: "",
        AnnoNascita: "",
    });
    // stato del form (se aperto o chiuso)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
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

    const handleInputChange = (e) => {
        const { value, name } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // ========================================== EFFETTI ==========================================
    // caricare dati al caricamento della pagina
    useEffect(() => {
        const object = {
            attori: [],
        };
        dbSelect(object).then((response) => setData(response.result[0]));
    }, []);

    // ======================================== INSERIMENTO ========================================
    const handleInsert = () => {
        const object = {
            attori: [
                {
                    Nome: formData.Nome,
                    Cognome: formData.Cognome,
                    Nazionalita: formData.Nazionalita,
                    AnnoNascita: formData.AnnoNascita,
                },
            ],
        };
        dbInsert(object).then((response) =>
            setData([...data, object.attori[0]]),
        );
        setFormData({
            Nome: "",
            Cognome: "",
            Nazionalita: "",
            AnnoNascita: "",
        });
    };

    // ======================================== ELIMINAZIONE =======================================
    const handleDelete = (id) => {
        const object = {
            attori: [
                {
                    codAttore: id,
                },
            ],
        };

        dbDelete(object).then((response) =>
            setData(data.filter((item) => item.CodAttore !== id)),
        );
    };

    // =========================================== RETURN ==========================================
    return (
        <>
            <Table
                aria-label="Tabella attori"
                isHeaderSticky
                bottomContent={
                    <div className="flex w-full justify-center">
                        <Button onPress={onOpen}>Aggiungi</Button>
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
                                                onClick={() => {
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
                                        {getKeyValue(item, columnKey)}
                                    </TableCell>
                                )
                            }
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                Aggiungi attore
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    name="Nome"
                                    placeholder="Nome"
                                    variant="bordered"
                                    value={formData.Nome}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="Cognome"
                                    placeholder="Cognome"
                                    variant="bordered"
                                    value={formData.Cognome}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="Nazionalita"
                                    placeholder="Nazionalità"
                                    variant="bordered"
                                    value={formData.Nazionalita}
                                    onChange={handleInputChange}
                                />
                                <Input
                                    name="AnnoNascita"
                                    placeholder="Anno di nascita"
                                    type="number"
                                    variant="bordered"
                                    value={formData.AnnoNascita}
                                    onChange={handleInputChange}
                                />
                            </ModalBody>
                            <ModalFooter className="flex justify-center">
                                <Button color="primary" onPress={handleInsert}>
                                    Aggiungi
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default App;
