<?php
namespace draughts;
include "../utils/siteUtils.php";

function getUserInfo() {
    return sendRequest(
        "SELECT id, username, password FROM users WHERE Username = ?",
        ["s", $_POST['username']]
    )->fetch_array();
}
$error = false;
session_start();
if (array_key_exists("login", $_POST)) {
    
    [$id, $user, $passw] = getUserInfo();

    $correct_passw = password_verify($_POST['password'], $passw);
    if ($user && $correct_passw) {
        $_SESSION['logged in'] = true;
        setcookie('id', $id, 0, "/");

        header("location: ../menus/game-menu.php?user={$user}");
        exit;
        // echo json_encode(['id'=>$userInfo['id'], 'status'=>200, 'message'=>'login successful']);
    } else if (!$user) {
        $_SESSION['login error'] = true;
        header('location: login.php');
        exit;
    } else if (!$correct_passw) {
        $_SESSION['login error'] = true;
        header('location: login.php');
        exit;
    } else {
        echo json_encode(['error'=>'Unknown error']);
    }
} else if (array_key_exists("register", $_POST)) {
    header("location: register.php");
}

if(isset($_SESSION['login error']))
{   
    $error = true;
    unset($_SESSION['login error']);
}  

        
?>


<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
        <meta http-equiv="ScreenOrientation" content="autoRotate:disabled">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="../../menu.css">
    </head>
    <body>
        <form method="POST">
            <?php
            if ($error):
            ?>
            <div id="error" class="login-error">
                <p  class="popup flex-column-center">Username or password incorrect</p>
            </div>
            <?php endif; ?>
        <div class="menu-container flex-column-center">
            <div class="popup flex-column-center">
                <div class="max flex-column-center">
                    <label for="username">Username</label>
                    <input type="text" name="username" >
                    <label for="password">Password</label>
                    <input type="password" name="password">
                    <input class="base-button" type="submit" name="login" value="Login">
                    <button class="base-button" name="register" value="register">Register</button>
                </div>
            </div>
        </div>
        </form>

    </body>
</html>