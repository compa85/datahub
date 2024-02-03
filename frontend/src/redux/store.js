import { configureStore } from '@reduxjs/toolkit'
import { columnsReducer } from './columnsSlice'
import { rowsReducer } from './rowsSlice'
import { loadingReducer } from './loadingSlice'
import { formReducer } from './formSlice'

export default configureStore({
    reducer: {
        columns: columnsReducer,
        rows: rowsReducer,
        loading: loadingReducer,
        form: formReducer,
    },
})