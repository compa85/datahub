// select
async function dbSelect(object) {
    let response = await fetch("http://localhost:8080/api/select.php", {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify(object),
    });
    let json = await response.json();
    return json;
};

// insert
async function dbInsert(object) {
    let response = await fetch("http://localhost:8080/api/insert.php", {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify(object),
    });
    let json = await response.json();
    return json;
}

// update
async function dbUpdate(object) {
    let response = await fetch("http://localhost:8080/api/update.php", {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify(object),
    });
    let json = await response.json();
    return json;
}

// delete
async function dbDelete(object) {
    let response = await fetch("http://localhost:8080/api/delete.php", {
        method: "POST",
        "Content-Type": "application/json",
        body: JSON.stringify(object),
    });
    let json = await response.json();
    return json;
}


export { dbSelect, dbInsert, dbUpdate, dbDelete };