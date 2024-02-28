import React, { useEffect, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setHost, setTable, setTablesName, deleteTablesName } from "../redux/dbSlice";
import { Button, Input, useDisclosure, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { dbGetTables } from "../database.js";
import Sidebar from "../components/CustomSidebar";
import CustomTable from "../components/CustomTable";
import CustomFormModal from "../components/CustomFormModal";
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
    const tablesName = database.tablesName;
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
            dispatch(deleteTablesName());
        }

        dbGetTables().then((response) => {
            if (response.status === "ok") {
                dispatch(setTablesName(response.result));
            }
        });
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
            <div className="flex">
                <Sidebar selectedKey="browse" />

                <div className="flex max-h-svh w-full flex-col gap-8 overflow-auto p-4">
                    <div className="flex flex-col gap-8 md:flex-row">
                        <form className="flex flex-col gap-4 md:w-48">
                            <Input id="host-input" label="Indirizzo host" value={form.host} size="sm" onChange={handleChange} />
                            <Button type="submit" id="host-button" onClick={handleSubmit}>
                                Connetti
                            </Button>
                        </form>

                        <Autocomplete
                            label="Nome tabella"
                            selectedKey={table}
                            listboxProps={{
                                emptyContent: `Nessun riscontro`,
                            }}
                            className="md:w-48"
                            size="sm"
                            onSelectionChange={(key) => {
                                key === null ? dispatch(setTable("")) : dispatch(setTable(key));
                            }}
                        >
                            {tablesName.map((tablename) => (
                                <AutocompleteItem key={tablename} value={tablename}>
                                    {tablename}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>

                    <CustomTable showToast={showToast} onOpen={onOpen}></CustomTable>
                </div>
            </div>

            <CustomFormModal showToast={showToast} isOpen={isOpen} onOpenChange={onOpenChange}></CustomFormModal>

            <ToastContainer position="bottom-right" autoClose={4000} pauseOnFocusLoss={false} hideProgressBar stacked theme="dark" />
        </>
    );
}

export default App;
