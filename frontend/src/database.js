// variabili
const host = "localhost:3001";

// select
async function dbSelect(object) {
    let response = await fetch(`http://${host}/api/select.php`, {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify(object),
    });
    let json = await response.json();
    return json;
}

// insert
async function dbInsert(object) {
    let response = await fetch(`http://${host}/api/insert.php`, {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify(object),
    });
    let json = await response.json();
    return json;
}

// update
async function dbUpdate(object) {
    let response = await fetch(`http://${host}/api/update.php`, {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify(object),
    });
    let json = await response.json();
    return json;
}

// delete
async function dbDelete(object) {
    let response = await fetch(`http://${host}/api/delete.php`, {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify(object),
    });
    let json = await response.json();
    return json;
}

// get columns
async function dbGetColumns(object) {
    let response = await fetch(`http://${host}/api/getcolumns.php`, {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify(object),
    });
    let json = await response.json();
    return json;
}

// get last id
async function dbGetLastId(object) {
    let response = await fetch(`http://${host}/api/getlastid.php`, {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify(object),
    });
    let json = await response.json();
    return json;
}

export { dbSelect, dbInsert, dbUpdate, dbDelete, dbGetColumns, dbGetLastId };
