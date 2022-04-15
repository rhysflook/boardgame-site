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
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="../../menu.css">
    </head>
    <body>
        <form method="POST">
        <div class="menu-container">
            <div class="popup">
                <div class="flex-container">
                    <label for="username">Username</label>
                    <input type="text" name="username" >
                    <label for="password">Password</label>
                    <input type="password" name="password">
                    <input class="popup-button" type="submit" name="login" value="Login">
                    <button class="popup-button" name="register" value="register">Register</button>
                    <?php
                    if ($error):
                    ?>
                    <p  class="error">Username or password incorrect</p>
                    <?php endif; ?>
                </div>
            </div>
        </div>
        </form>
    </body>
</html>