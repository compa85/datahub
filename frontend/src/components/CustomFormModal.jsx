import { useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addRecord } from "../redux/dataSlice";
import { dbInsert } from "../database";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
} from "@nextui-org/react";

function CustomFormModal({ isOpen, onOpenChange }) {
    const dispatch = useDispatch();

    // form data
    const [formData, dispatchFormState] = useReducer(formReducer, {
        Nome: "",
        Cognome: "",
        Nazionalita: "",
        AnnoNascita: "",
    });

    // form reducer
    function formReducer(state, action) {
        switch (action.type) {
            case "CHANGE_FIELD":
                return { ...state, [action.field]: action.value };
            case "RESET":
                return {
                    Nome: "",
                    Cognome: "",
                    Nazionalita: "",
                    AnnoNascita: "",
                };
            default:
                return state;
        }
    }

    // aggiornare il form
    function handleInputChange(e) {
        const { value, name } = e.target;
        dispatchFormState({ type: "CHANGE_FIELD", field: name, value: value });
    }

    // inserimento
    function handleInsert() {
        let object = {
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
            object = {
                ...object,
                attori: [
                    {
                        ...object.attori[0],
                        CodAttore: String(response.result[0]),
                    },
                ],
            };
            dispatch(addRecord(object.attori[0]));
            dispatchFormState({ type: "RESET" });
        });
    }

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
