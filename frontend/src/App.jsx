import React from "react";
import { useReducer } from "react";
import { useDisclosure } from "@nextui-org/react";
import CustomTable from "./components/CustomTable";
import CustomFormModal from "./components/CustomFormModal";
import Toast from "./components/Toast";

function App() {
    // dati
    const [data, dispatchData] = useReducer(dataReducer, []);

    // reducer
    function dataReducer(state, action) {
        switch (action.type) {
            case "INSERT_RECORD":
                return [...state, action.object];
            case "INSERT_RECORDS":
                return action.array;
            case "DELETE_RECORD":
                return state.filter(
                    (item) => item.CodAttore !== action.object.codAttore,
                );
            default:
                return state;
        }
    }

    // aggiungi un record
    function addRecord(object) {
        dispatchData({ type: "INSERT_RECORD", object });
    }

    // aggiungi più record
    function addRecords(array) {
        dispatchData({ type: "INSERT_RECORDS", array });
    }

    // elimina un record
    function deleteRecord(object) {
        dispatchData({ type: "DELETE_RECORD", object });
    }

    // stato del form (se aperto o chiuso)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // return
    return (
        <>
            <CustomTable
                data={data}
                addRecords={addRecords}
                deleteRecord={deleteRecord}
                onOpen={onOpen}
            ></CustomTable>

            <CustomFormModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                addRecord={addRecord}
            ></CustomFormModal>
        </>
    );
}

export default App;
