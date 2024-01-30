<?php
include "./config.php";
include "../database.php";

// headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

// attributi
$database = new Database(DBHOST, DBUSER, DBPWD, DBNAME, DBPORT);
$json = file_get_contents('php://input');
$response = null;

// controllare errori di connessione al db
if ($database->error === null) {
    // controllare se è presente un json
    if (!empty($json)) {
        // convertire il json in un oggetto
        $data = json_decode($json);
        // effettuare l'insert
        $response = $database->insert($data);
    } else {
        $response = new Response("JSON is empty");
    }
} else {
    $response = new Response("Error: " . $database->error);
}

// inviare la risposta
echo json_encode($response);
