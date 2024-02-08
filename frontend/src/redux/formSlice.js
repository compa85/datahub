import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

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
            const primaryKeys = action.payload;

            // resetto tutti i campi tranne le chiavi primarie
            for (let field in state.values) {
                if (field !== primaryKeys[0]) {
                    state.values[field] = "";
                }
            }
        },
        deleteAllFields: (state, action) => {
            state.values = {};
        },
    },
});

export const { addField, resetField, resetFields, deleteAllFields } = formSlice.actions;
export const formReducer = formSlice.reducer;
