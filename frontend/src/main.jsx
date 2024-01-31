import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";
import { NextUIProvider } from "@nextui-org/react";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Provider store={store}>
            <NextUIProvider>
                <App />
            </NextUIProvider>
        </Provider>
    </React.StrictMode>,
);
