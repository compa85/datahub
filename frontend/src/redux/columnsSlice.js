import { createSlice } from "@reduxjs/toolkit";

export const columnsSlice = createSlice({
    name: "columns",
    initialState: {
        values: [],
    },
    reducers: {
        addColumn: (state, action) => {
            state.values.push(action.payload);
        },
        addColumns: (state, action) => {
            state.values = action.payload;
        },
        deleteAllColumns: (state, action) => {
            state.values.length = 0;
        },
    },
});

export const { addColumn, addColumns, deleteAllColumns } = columnsSlice.actions;
export const columnsReducer = columnsSlice.reducer;
