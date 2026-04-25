<?php
header('Content-Type: application/json');
require '../includes/config.php';

$data = json_decode(file_get_contents("php://input"), true);

$name  = trim($data['name']);
$email = trim($data['email']);
$pass  = $data['password'];

if (empty($name) || empty($email) || empty($pass)) {
    echo json_encode(["status" => "error", "message" => "All fields required"]);
    exit;
}

$hashed = password_hash($pass, PASSWORD_DEFAULT);

$sql = "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $name, $email, $hashed);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Registration successful!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Email already exists"]);
}
?>
