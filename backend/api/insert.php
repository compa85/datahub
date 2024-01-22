<?php
include "../database.php";

// headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

// attributi
$database = new Database("mariadb", "root", "root", "cinema");
$json = file_get_contents('php://input');
$response = null;

// controllare se è presente un json
if (!empty($json)) {
    // convertire il json in un oggetto
    $data = json_decode($json);
    // inserire l'oggetto nel database
    $response = array(
        "message" => $database->insert($data),
    );
} else {
    $response = array(
        "message" => "JSON is empty",
    );
}

// inviare la risposta
echo json_encode($response);
