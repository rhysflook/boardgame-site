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
<meta name="apple-mobile-web-app-capable" content="yes" />


