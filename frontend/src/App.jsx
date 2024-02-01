import React from "react";
import { useDisclosure } from "@nextui-org/react";
import CustomTable from "./components/CustomTable";
import CustomFormModal from "./components/CustomFormModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    // stato del form (se aperto o chiuso)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
            <CustomTable showToast={showToast} onOpen={onOpen}></CustomTable>

            <CustomFormModal
                showToast={showToast}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            ></CustomFormModal>

            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                draggable
                pauseOnFocusLoss={false}
                toastClassName="bg-content1"
            />
        </>
    );
}

export default App;
