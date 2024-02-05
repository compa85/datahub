import React from "react";
import { useState } from "react";
import { useDisclosure } from "@nextui-org/react";
import CustomTable from "./components/CustomTable";
import CustomFormModal from "./components/CustomFormModal";
import { ToastContainer, toast } from "react-toastify";
import { Button, Input } from "@nextui-org/react";
import "react-toastify/dist/ReactToastify.css";

function App() {
    // stato del form (se aperto o chiuso)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // nome della tabella
    const [table, setTable] = useState("attori");
    // tipologie numeriche di dato
    const numericType = ["int", "decimal", "numeric", "float", "double", "real", "bit", "serial"];

    // mostrare toast
    const showToast = (response) => {
        let message = response.message;
        let type = response.status == "ok" ? "success" : "error";

        switch (type) {
            case "info":
                toast.info(message);
            case "success":
                toast.success(message);
                break;
            case "warn":
                toast.warn(message);
                break;
            case "error":
                toast.error(message);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className="flex max-w-60 flex-col gap-4">
                <Input placeholder="Nome tabella" id="table-name" size="sm" />
                <Button onPress={() => setTable(document.querySelector("#table-name").value)}>Carica</Button>
            </div>

            <CustomTable table={table} showToast={showToast} onOpen={onOpen} numericType={numericType}></CustomTable>

            <CustomFormModal table={table} showToast={showToast} isOpen={isOpen} onOpenChange={onOpenChange} numericType={numericType}></CustomFormModal>

            <ToastContainer position="bottom-right" autoClose={3000} draggable pauseOnFocusLoss={false} toastClassName="bg-content1" />
        </>
    );
}

export default App;
