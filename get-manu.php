<?php
header('Content-Type: application/json');
require '../includes/config.php';

$result = $conn->query("SELECT * FROM menu_items");
$items = [];

while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}

echo json_encode($items);
?>