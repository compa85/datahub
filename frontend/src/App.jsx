import React from "react";
import { useDisclosure } from "@nextui-org/react";
import CustomTable from "./components/CustomTable";
import CustomFormModal from "./components/CustomFormModal";

function App() {
    // stato del form (se aperto o chiuso)
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <CustomTable onOpen={onOpen}></CustomTable>

            <CustomFormModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            ></CustomFormModal>
        </>
    );
}

export default App;
