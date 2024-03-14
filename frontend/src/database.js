import store from "./redux/store";

// fetch api
async function fetchApi(action, object) {
    const host = store.getState().database.host;

    try {
        let response = await fetch(`${host}/api/${action}.php`, {
            method: "POST",
            "Content-Type": "application/json",
            body: JSON.stringify(object),
        });

        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return { status: "error", message: "Failed to fetch", query: null, result: null };
    }
}

// fetch api senza parametri
async function fetchApiNO(action) {
    const host = store.getState().database.host;

    try {
        let response = await fetch(`${host}/api/${action}.php`);

        let json = await response.json();
        return json;
    } catch (error) {
        console.error(error);
        return { status: "error", message: "Failed to fetch", query: null, result: null };
    }
}

// select
async function dbSelect(object) {
    return await fetchApi("select", object);
}

// insert
async function dbInsert(object) {
    return await fetchApi("insert", object);
}

// update
async function dbUpdate(object) {
    return await fetchApi("update", object);
}

// delete
async function dbDelete(object) {
    return await fetchApi("delete", object);
}

// get columns
async function dbGetColumns(object) {
    return await fetchApi("getcolumns", object);
}

// get last id
async function dbGetLastId(object) {
    return await fetchApi("getlastid", object);
}

// get Tables
async function dbGetTables() {
    return await fetchApiNO("gettables");
}

export { dbSelect, dbInsert, dbUpdate, dbDelete, dbGetColumns, dbGetLastId, dbGetTables };
