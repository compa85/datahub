import { createSlice } from "@reduxjs/toolkit";

export const rowsSlice = createSlice({
    name: "rows",
    initialState: {
        values: [],
    },
    reducers: {
        // aggiungere una riga
        addRow: (state, action) => {
            state.values.push(action.payload);
        },

        // aggiungere una o più righe (action.payload deve essere un array di oggetti)
        addRows: (state, action) => {
            // controllo che action.payload sia un array
            if (Array.isArray(action.payload)) {
                state.values = action.payload;
            } else {
                state.values = [];
            }
        },

        // aggiornare una riga
        updateRow: (state, action) => {
            const row = action.payload;

            // controllo che il primo oggetto contenga un solo attributo (l'id)
            if (Object.keys(row[0]).length === 1) {
                // ottengo il nome del campo dell'id e il suo valore
                const fieldName = Object.keys(row[0])[0];
                const fieldValue = row[0][fieldName];
                // salvo in object l'oggetto che contiene i campi da modificare
                const object = row[1];

                // trovo l'indice dello stato in cui è salvata la corrispondente riga
                const index = state.values.findIndex((tmpRow) => tmpRow[fieldName] === fieldValue);
                
                const newObj = { ...object, [fieldName]: state.values[index][fieldName] };
                // controllo se esiste un elemento con indice rowIndex
                if (index !== -1) {
                    state.values[index] = { ...state.values[index], ...newObj };
                }
            }
        },

        // eliminare una o più righe (action.payload deve essere un array di oggetti)
        deleteRows: (state, action) => {
            const rows = action.payload;

            rows.forEach((row) => {
                // controllo che l'oggetto contenga un solo attributo (l'id)
                if (Object.keys(row).length === 1) {
                    // ottengo il nome del campo dell'id e il suo valore
                    const fieldName = Object.keys(row)[0];
                    const fieldValue = row[fieldName];

                    // trovo l'indice dello stato in cui è salvata la corrispondente riga
                    const index = state.values.findIndex((tmpRow) => tmpRow[fieldName] === fieldValue);

                    // se l'indice esiste, rimuovo la riga dallo stato
                    if (index !== -1) {
                        state.values.splice(index, 1);
                    }
                }
            });
        },

        // eliminare tutte le righe
        deleteAllRows: (state, action) => {
            state.values.length = 0;
        },
    },
});

export const { addRow, addRows, updateRow, deleteRow, deleteRows, deleteAllRows } = rowsSlice.actions;
export const rowsReducer = rowsSlice.reducer;
