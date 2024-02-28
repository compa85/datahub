import { useNavigate, Routes, Route } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import Browse from "./pages/Browse.jsx";
import Query from "./pages/Query.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
    const navigate = useNavigate();

    return (
        <NextUIProvider navigate={navigate}>
            <Routes>
                <Route path="/" element={<Browse />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/query" element={<Query />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </NextUIProvider>
    );
}

export default App;
