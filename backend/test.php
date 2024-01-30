<?php
include "database.php";

$cinema = new Database("mariadb", "root", "root", "cinema", 3003);

$json = file_get_contents("test.json");
$object = json_decode($json);

$response = $cinema->select($object);

echo json_encode($response);
