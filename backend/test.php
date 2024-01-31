<?php
include "database.php";

$cinema = new Database("mariadb", "root", "root", "cinema", 3003);
$response = null;

if ($cinema->error === null) {
    $json = file_get_contents("test.json");

    if (json_validate($json)) {
        $object = json_decode($json);
        $response = $cinema->select($object);
    } else {
        $response = new Response(false, "JSON is invalid");
    }
} else {
    $response = new Response(false, $database->error);
}

echo json_encode($response);
