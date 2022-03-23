<?php
session_start();
if (isset($_SESSION['logged in'])) {
    header('location: ./src/menu/game-menu.php');
    exit;
} else {
    header('location: main-menu.php');
    exit;
}
?>

