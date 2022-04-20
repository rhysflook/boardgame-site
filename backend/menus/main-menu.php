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
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
        <meta http-equiv="ScreenOrientation" content="autoRotate:disabled">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="../../menu.css">
    </head>
    <body>
        <form method="post">
            <div class="menu-container flex-column-center">
                <div class="popup flex-column-center">

                    <button class="base-button" name="to-login">Login</button>
                    <button class="base-button" name="to-registration">Sign up</button>
                </div>
            </div>
        </form>
    </body>
</html>