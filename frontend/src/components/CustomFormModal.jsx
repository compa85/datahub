import { useState, useReducer } from "react";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from "@nextui-org/react";
import { dbInsert } from "../database";

function CustomFormModal({ isOpen, onOpenChange, addRecord }) {
    // dati del form di inserimento
    const [formData, setFormData] = useState({
        Nome: "",
        Cognome: "",
        Nazionalita: "",
        AnnoNascita: "",
    });

    // aggiornare il form
    function handleInputChange(e) {
        const { value, name } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    // inserimento
    function handleInsert() {
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
        dbInsert(object).then((response) => {
            console.log(response);
            addRecord(object.attori[0]);
            setFormData({
                Nome: "",
                Cognome: "",
                Nazionalita: "",
                AnnoNascita: "",
            });
        });
    }

    // return
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
    );
}

export default CustomFormModal;
