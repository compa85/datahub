import { createSlice } from "@reduxjs/toolkit";

export const rowsSlice = createSlice({
    name: "rows",
    initialState: [],
    reducers: {
        addRow: (state, action) => {
            state.push(action.payload);
        },
        addRows: (state, action) => {
            return action.payload;
        },
        updateRow: (state, action) => {
            const { fieldName, object } = action.payload;
            // salvo in rowIndex l'indice della riga che si vuole modificare
            const rowIndex = state.findIndex((row) => row[fieldName] === object[fieldName]);
            const newObj = { ...object, [fieldName]: state[rowIndex][fieldName] };
            // controllo se esiste un elemento con indice rowIndex
            if (rowIndex !== -1) {
                state[rowIndex] = { ...state[rowIndex], ...newObj };
            }
        },
        deleteRow: (state, action) => {
            const { fieldName, fieldValue } = action.payload;
            // salvo in rowIndex l'indice della riga che si vuole eliminare
            const rowIndex = state.findIndex((row) => row[fieldName] == fieldValue);
            state.splice(rowIndex, 1);
        },
        deleteAllRows: (state, action) => {
            state.length = 0;
        },
    },
});

export const { addRow, addRows, updateRow, deleteRow, deleteAllRows } = rowsSlice.actions;
export const rowsReducer = rowsSlice.reducer;
