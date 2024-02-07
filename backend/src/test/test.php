<?php
include_once "../database.php";
include_once "../response.php";
include_once "../json.php";

$response = null;

try {
    $database = new Database("mariadb", "root", "root", "cinema", 3003);
    $json = file_get_contents("test.json");
    $data = validate($json);
    $response = $database->select($data);
} catch (Exception $e) {
    $response = new Response(false, $e->getMessage());
}

echo json_encode($response);
