import { createSlice } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
    name: 'columns',
    initialState: {
        values: {
            header: true,
            body: true,
        }
    },
    reducers: {
        setHeaderLoading: (state, action) => {
            state.values.header = action.payload
        },
        setBodyLoading: (state, action) => {
            state.values.body = action.payload
        },
    },
})

export const { setHeaderLoading, setBodyLoading } = loadingSlice.actions
export const loadingReducer = loadingSlice.reducer