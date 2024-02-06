import { createSlice } from "@reduxjs/toolkit";

export const formSlice = createSlice({
    name: "form",
    initialState: {
        values: {},
    },
    reducers: {
        addField: (state, action) => {
            const { fieldName, fieldValue } = action.payload;
            state.values[fieldName] = fieldValue;
        },
        resetField: (state, action) => {
            state.values[action.payload] = "";
        },
        resetFields: (state, action) => {
            state.values = {};
        },
    },
});

export const { addField, resetField, resetFields } = formSlice.actions;
export const formReducer = formSlice.reducer;
