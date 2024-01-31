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
        // controllo che il json sia valido
        if (json_validate($json)) {
            // convertire il json in un oggetto
            $data = json_decode($json);
            // effettuare il delete
            $response = $database->delete($data);
        } else {
            $response = new Response(false, "JSON is invalid");
        }
    } else {
        $response = new Response(false, "JSON is empty");
    }
} else {
    $response = new Response(false, $database->error);
}

// inviare la risposta
echo json_encode($response);
