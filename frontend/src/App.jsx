import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTable } from "./redux/dbSlice";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import CustomTable from "./components/CustomTable";
import CustomFormModal from "./components/CustomFormModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    // ======================================== REDUX =========================================
    const table = useSelector((state) => state.database.table);
    const dispatch = useDispatch();

    // ====================================== VARIABILI =======================================
    // stato del form (aperto o chiuso)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // ======================================== TOAST =========================================
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

    // ======================================== RETURN ========================================
    return (
        <>
            <div className="flex max-w-60 flex-col gap-4">
                <Input label="Nome tabella" id="table-name" size="sm" />
                <Button onPress={() => dispatch(setTable(document.querySelector("#table-name").value))}>Carica</Button>
            </div>

            <CustomFormModal showToast={showToast} isOpen={isOpen} onOpenChange={onOpenChange}></CustomFormModal>

            <CustomTable showToast={showToast} onOpen={onOpen}></CustomTable>

            <ToastContainer position="bottom-right" autoClose={4000} pauseOnFocusLoss={false} hideProgressBar stacked theme="dark" />
        </>
    );
}

export default App;
