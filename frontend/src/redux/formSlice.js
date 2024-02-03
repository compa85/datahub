import { createSlice } from '@reduxjs/toolkit'

export const formSlice = createSlice({
    name: 'form',
    initialState: {
        values: {}
    },
    reducers: {
        addField: (state, action) => {
            const { fieldName, fieldValue } = action.payload;
            state.values[fieldName] = fieldValue;
        },
        resetFields: (state, action) => {
            state.values = {}
        },
    },
})

export const { addField, resetFields } = formSlice.actions
export const formReducer = formSlice.reducer