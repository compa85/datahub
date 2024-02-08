import { configureStore } from "@reduxjs/toolkit";
import { dbReducer } from "./dbSlice";
import { columnsReducer } from "./columnsSlice";
import { rowsReducer } from "./rowsSlice";
import { loadingReducer } from "./loadingSlice";
import { formReducer } from "./formSlice";

export default configureStore({
    reducer: {
        database: dbReducer,
        columns: columnsReducer,
        rows: rowsReducer,
        loading: loadingReducer,
        form: formReducer,
    },
});
