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
    },
});

export const { addColumn, addColumns } = columnsSlice.actions;
export const columnsReducer = columnsSlice.reducer;
