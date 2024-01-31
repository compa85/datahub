import { createSlice } from '@reduxjs/toolkit'

export const dataSlice = createSlice({
    name: 'data',
    initialState: {
        values: []
    },
    reducers: {
        addRecord: (state, action) => {
            state.values.push(action.payload)
        },
        addRecords: (state, action) => {
            state.values = action.payload
        },
        deleteRecord: (state, action) => {
            console.log(action);
            state.values = state.values.filter(
                (item) => item.CodAttore !== action.payload,
            );
        },
    },
})

export const { addRecord, addRecords, deleteRecord } = dataSlice.actions
export const dataReducer = dataSlice.reducer