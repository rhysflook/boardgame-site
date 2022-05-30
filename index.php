<?php
session_start();

if ($_SERVER["HTTP_HOST"] === 'progress-it-school.net') {
    header('location: https://dragon-king-games.herokuapp.com');
    exit();
}

if (isset($_SESSION['logged in'])) {
    header('location: ./backend/menus/game-menu.php');
    exit;
} else {
    header('location: ./backend/menus/main-menu.php');
    exit;
}
?>
<!-- <head>

    <link rel="manifest" href="./manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
</head> -->


