<?php
include "database.php";

$cinema = new Database("mariadb", "root", "root", "cinema");

$json = file_get_contents("test.json");
$object = json_decode($json);


$response = $cinema->update($object);

echo json_encode($response);
