<?php
namespace draughts;
include "../utils/siteUtils.php";

function addUser() {
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    sendRequest(
        "INSERT INTO users (username, password, in_game) VALUES (?, ?, ?)",
        ["ssi", $_POST['username'], $password, $_POST['in_game']]
    );
}

function usernameTaken() {
    [$username] = sendRequest(
        "SELECT username FROM users WHERE username = ?",
        ['s', $_POST['username']]
    )->fetch_array();

    if ($username !== null) {
        return True;
    } 
}
$error = false;
session_start();
// $_POST = json_decode(file_get_contents("php://input"), true);
if (array_key_exists('register', $_POST)) {
    if (usernameTaken($conn)) {
        $_SESSION['username taken'] = true;
        header('location: register.php');
        exit;
    } else {
        addUser($conn);
        $_SESSION['logged in'] = true;
        $id = getUser($_POST['username'])[1];
        setcookie('id', $id, 0, "/");
        header("location: ../menus/game-menu.php?user={$_POST['username']}");
        exit;
    }
}



?>

<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="../../menu.css">
    </head>
    <body>
        <form method="POST">
        <div class="menu-container flex-column-center">
            <div class="popup flex-column-center"> 
            <div class="max flex-column-center">
                <label for="username">Username</label>
                <input type="text" name="username" >
        
                <label for="password">Password</label>
                <input type="password" name="password" id="passw">
          
                <label for="password">Repeat password</label>
                <input type="password" name="password-again" id="repeatPassw">
         
            <input class="popup-button" type="submit" name="register" id="register" value="Register" disabled>
      
            <?php if ($error): ?>
                <p class="popup flex-column-center">User with that name already exists</p>
            <?php endif; ?>
            </div>
            </div>
        </div>
    </form>
        <script>
            function controlButton() {
                if (validPassword(passwOne.value, passwordTwo.value)) {
                    registerButton.disabled = false;
                } else {
                    registerButton.disabled = true;
                }
            }

            function validPassword(passOne, passTwo) {
                return passOne !== "" && 
                       passTwo !== "" && 
                       passOne === passTwo;
            }

            const registerButton = document.querySelector('#register');
            const passwOne = document.querySelector('#passw');
            const passwordTwo = document.querySelector('#repeatPassw');
            passwOne.addEventListener('input', controlButton);
            passwordTwo.addEventListener('input', controlButton);
        </script>
    </body>
</html>