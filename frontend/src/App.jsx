import React, { useEffect, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setHost, setTable } from "./redux/dbSlice";
import { Button, Input, useDisclosure } from "@nextui-org/react";
import CustomTable from "./components/CustomTable";
import CustomFormModal from "./components/CustomFormModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
    // ===================================== LOCAL STORAGE ====================================
    useEffect(() => {
        // carico il valore di host e table
        dispatch(setHost(localStorage.getItem("host") !== null ? localStorage.getItem("host") : ""));
        dispatch(setTable(localStorage.getItem("table") !== null ? localStorage.getItem("table") : ""));
    }, []);

    // ======================================== REDUX =========================================
    const database = useSelector((state) => state.database);
    const host = database.host;
    const table = database.table;
    const dispatch = useDispatch();

    // ====================================== VARIABILI =======================================
    // stato del form di inserimento (aperto o chiuso)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // ========================================= FORM =========================================
    const formReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_HOST":
                return { ...state, host: action.value };
            case "CHANGE_TABLE":
                return { ...state, table: action.value };
            default:
                return state;
        }
    };

    const [form, dispatchForm] = useReducer(formReducer, { host: host, table: table });

    useEffect(() => {
        if (host != "") {
            dispatchForm({ type: "CHANGE_HOST", value: host });
        }
    }, [host]);

    useEffect(() => {
        if (table != "") {
            dispatchForm({ type: "CHANGE_TABLE", value: table });
        }
    }, [table]);

    // gestire la modifica
    const handleChange = (e) => {
        const field = e.target.id;
        const value = e.target.value;

        switch (field) {
            case "host-input":
                dispatchForm({ type: "CHANGE_HOST", value });
                break;
            case "table-input":
                dispatchForm({ type: "CHANGE_TABLE", value });
                break;
            default:
                break;
        }
    };

    // gestire l'invio
    const handleSubmit = (e) => {
        e.preventDefault();

        switch (e.target.id) {
            case "host-button":
                dispatch(setHost(form.host));
                break;
            case "table-button":
                dispatch(setTable(form.table));
                break;
            default:
                break;
        }
    };

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
            <div className="flex gap-10">
                <form className="flex max-w-60 flex-col gap-4">
                    <Input id="host-input" label="Indirizzo host" value={form.host} onChange={handleChange} size="sm" />
                    <Button type="submit" id="host-button" onClick={handleSubmit}>
                        Connetti
                    </Button>
                </form>

                <form className="flex max-w-60 flex-col gap-4">
                    <Input id="table-input" label="Nome tabella" value={form.table} onChange={handleChange} size="sm" />
                    <Button type="submit" id="table-button" onClick={handleSubmit}>
                        Carica
                    </Button>
                </form>
            </div>

            <CustomFormModal showToast={showToast} isOpen={isOpen} onOpenChange={onOpenChange}></CustomFormModal>

            <CustomTable showToast={showToast} onOpen={onOpen}></CustomTable>

            <ToastContainer position="bottom-right" autoClose={4000} pauseOnFocusLoss={false} hideProgressBar stacked theme="dark" />
        </>
    );
}

export default App;
