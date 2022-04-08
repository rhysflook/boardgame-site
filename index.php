<?php
session_start();
if (isset($_SESSION['logged in'])) {
    header('location: ./backend/menus/game-menu.php');
    exit;
} else {
    header('location: ./backend/menus/main-menu.php');
    exit;
}
?>

