<?php
session_start();
if (isset($_SESSION['logged in'])) {
    header('location: game-menu.php');
    die;
} else {
    header('location: main-menu.php');
    die;
}
?>

