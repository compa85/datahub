import { createSlice } from "@reduxjs/toolkit";

export const rowsSlice = createSlice({
    name: "rows",
    initialState: {
        values: [],
    },
    reducers: {
        addRow: (state, action) => {
            state.values.push(action.payload);
        },
        addRows: (state, action) => {
            state.values = action.payload;
        },
        updateRow: (state, action) => {
            const { fieldName, object } = action.payload;
            // salvo in rowIndex l'indice della riga che si vuole modificare
            const rowIndex = state.values.findIndex((row) => row[fieldName] === object[fieldName]);
            const newObj = { ...object, [fieldName]: state.values[rowIndex][fieldName] };
            // controllo se esiste un elemento con indice rowIndex
            if (rowIndex !== -1) {
                state.values[rowIndex] = { ...state.values[rowIndex], ...newObj };
            }
        },
        deleteRow: (state, action) => {
            const { fieldName, fieldValue } = action.payload;
            // salvo in rowIndex l'indice della riga che si vuole eliminare
            const rowIndex = state.values.findIndex((row) => row[fieldName] == fieldValue);
            state.values.splice(rowIndex, 1);
        },
        deleteAllRows: (state, action) => {
            state.values.length = 0;
        },
    },
});

export const { addRow, addRows, updateRow, deleteRow, deleteAllRows } = rowsSlice.actions;
export const rowsReducer = rowsSlice.reducer;
