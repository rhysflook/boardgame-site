<!DOCTYPE html>
<?php

function addUser($conn) {
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
    $sql = "INSERT INTO users (username, password, in_game) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $sql);
    $stmt->bind_param("ssi", $_POST['username'], $password, $_POST['in_game']);
    $stmt->execute();
}

function usernameTaken($conn) {
    $sql = "SELECT username FROM users WHERE username = ?";
    $stmt = mysqli_prepare($conn, $sql);
    $stmt->bind_param('s', $_POST['username']);
    $stmt->execute();
    $stmt->bind_result($username);
    $stmt->fetch();
    if ($username !== null) {
        return True;
    } 
}
$error = false;
session_start();
// $_POST = json_decode(file_get_contents("php://input"), true);
if (array_key_exists('register', $_POST)) {

    $conn = new mysqli("localhost", "root", "", "draughts");
    if (usernameTaken($conn)) {
        $_SESSION['username taken'] = true;
        header('location: register.php');
        exit;
    } else {
        addUser($conn);
        header('location: login.php');
        die;
    }
}

if(isset($_SESSION['username taken']))
{   
    $error = true;
    unset($_SESSION['username taken']);
}

?>

<html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="menu.css">
    </head>
    <body>
        <div class="menu-container">
        <form method="POST">
            <div class="menu-section">
                <label for="username">Username</label>
                <input type="text" name="username" >
            </div>
            <div class="menu-section">
                <label for="password">Password</label>
                <input type="password" name="password" id="passw">
            </div>
            <div class="menu-section">
                <label for="password">Repeat password</label>
                <input type="password" name="password-again" id="repeatPassw">
            </div>
            <div class="menu-section">
            <input type="submit" name="register" id="register" disabled>
            </div>
            <div class="menu-section">
            <?php if ($error): ?>
                <p class="error">User with that name already exists</p>
            <?php endif; ?>
            </div>
        </form>
        </div>
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
            console.log(passwOne)
            const passwordTwo = document.querySelector('#repeatPassw');
            passwOne.addEventListener('input', controlButton);
            passwordTwo.addEventListener('input', controlButton);
        </script>
    </body>
</html>