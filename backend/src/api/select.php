<?php
include_once "./config.php";
include_once "../database.php";
include_once "../response.php";
include_once "../json.php";

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

$response = null;

try {
    $database = new Database(DBHOST, DBUSER, DBPWD, DBNAME, DBPORT);
    $json = file_get_contents('php://input');
    $data = validate($json);
    $response = $database->select($data);
} catch (Exception $e) {
    $response = new Response(false, $e->getMessage());
}

echo json_encode($response);
