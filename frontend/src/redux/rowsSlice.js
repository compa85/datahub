import { createSlice } from '@reduxjs/toolkit'

export const rowsSlice = createSlice({
    name: 'rows',
    initialState: {
        values: []
    },
    reducers: {
        addRow: (state, action) => {
            state.values.push(action.payload)
        },
        addRows: (state, action) => {
            state.values = action.payload
        },
        deleteRow: (state, action) => {
            const { fieldName, fieldValue } = action.payload;
            state.values = state.values.filter(
                (item) => item[fieldName] !== fieldValue,
            );
        },
        deleteAllRows: (state, action) => {
            state.values = []
        },
    },
})

export const { addRow, addRows, deleteRow, deleteAllRows } = rowsSlice.actions
export const rowsReducer = rowsSlice.reducer