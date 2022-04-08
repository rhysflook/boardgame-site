<?php
namespace draughts;
include "../utils/siteUtils.php";

if (isset($_POST['to-login'])) {
    header('location: ../auth/login.php');
}

if (isset($_POST['to-registration'])) {
    header('location: ../auth/register.php');
}

?>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Draughts - Main Menu</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="../../menu.css">
    </head>
    <body>
        <form method="post">
            <div class="menu-container">
                <div class="popup">

                    <button class="popup-button" name="to-login">Login</button>
                    <button class="popup-button" name="to-registration">Sign up</button>
                </div>
            </div>
        </form>
    </body>
</html>