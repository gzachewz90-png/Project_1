<?php
$host = "localhost";
$db   = "kebede_yimer";
$user = "root";
$pass = "";                    // default XAMPP password is empty

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
else{
    echo "Connected succesfully";
}
?>