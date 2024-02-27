import { createSlice } from "@reduxjs/toolkit";

export const rowsSlice = createSlice({
    name: "rows",
    initialState: {
        values: [],
        sortDescriptor: {
            direction: "ascending",
            column: "",
        },
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

        // ordinare le righe secondo un campo della tabella
        sortRows: (state, action) => {
            // nome colonna secondo cui ordinare i valori
            const { column } = action.payload;

            // se la colonna è null vuol dire che è stata aggiunto una riga e il state.sortDescriptor è corretto, in caso contrario lo modifico
            if (column !== null) {
                // salvo la direzione di ordinamento (crescente se si ordina una colonna nuova) e la colonna interessata
                state.sortDescriptor = {
                    ...state.sortDescriptor,
                    direction: state.sortDescriptor.column === column ? (state.sortDescriptor.direction === "ascending" ? "descending" : "ascending") : "ascending",
                    column: column,
                };
            }

            // riordino elementi state.values secondo i parametri in state.sortDescriptor
            // .slice() prende ogni elemento dell'array se non riceve parametri
            // .sort() prende due elementi alla volta e ordina i due (con bubble sort) in modo crescente
            state.values = state.values.slice().sort((a, b) => {
                let first = a[state.sortDescriptor.column] === null ? a[state.sortDescriptor.column] : parseInt(a[state.sortDescriptor.column]) || a[state.sortDescriptor.column].toLowerCase();
                let second = b[state.sortDescriptor.column] === null ? b[state.sortDescriptor.column] : parseInt(b[state.sortDescriptor.column]) || b[state.sortDescriptor.column].toLowerCase();

                // confronto i due valori a e b; cmp = (1 se a > b; -1 se a < b: 0 se a = b)
                let cmp =
                    first === null
                        ? -1
                        : second === null
                        ? 1
                        : typeof first === "number" && typeof second !== "number"
                        ? -1
                        : typeof first !== "number" && typeof second === "number"
                        ? 1
                        : first > second
                        ? 1
                        : first < second
                        ? -1
                        : 0;

                // inverto posizione se ordine decrescente
                if (state.sortDescriptor.direction === "descending") {
                    cmp *= -1;
                }

                return cmp;
            });
        },
    },
});

export const { addRow, addRows, updateRow, deleteRows, deleteAllRows, sortRows } = rowsSlice.actions;
export const rowsReducer = rowsSlice.reducer;
