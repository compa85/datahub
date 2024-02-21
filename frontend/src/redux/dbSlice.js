import { createSlice } from "@reduxjs/toolkit";

export const dbSlice = createSlice({
    name: "database",
    initialState: {
        host: "",
        table: "",
        primaryKeys: [],
        numericTypes: ["int", "decimal", "numeric", "float", "double", "real", "bit", "serial"],
    },
    reducers: {
        setHost: (state, action) => {
            state.host = action.payload;
            localStorage.setItem("host", state.host);
        },
        setTable: (state, action) => {
            state.table = action.payload;
            localStorage.setItem("table", state.table);
        },
        addPrimaryKey: (state, action) => {
            state.primaryKeys.push(action.payload);
        },
        setPrimaryKeys: (state, action) => {
            state.primaryKeys = action.payload;
        },
        deleteAllPrimaryKeys: (state, action) => {
            state.primaryKeys.length = 0;
        },
    },
});

export const { setHost, setTable, addPrimaryKey, setPrimaryKeys, deleteAllPrimaryKeys } = dbSlice.actions;
export const dbReducer = dbSlice.reducer;
