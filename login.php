<!DOCTYPE html>
<?php
    function getUserInfo($conn) {
        $sql = "SELECT id, username, password FROM users WHERE Username = ?";
        $stmt = mysqli_prepare($conn, $sql);
        $stmt->bind_param("s", $_POST['username']);
        $stmt->execute();
        $stmt->bind_result($id, $user, $passw);
        $stmt->fetch();
        
        return array('id'=>$id, 'username'=>$user, 'password'=>$passw);
    }
    $error = false;
    session_start();
    if (array_key_exists("login", $_POST)) {
        
        // $_POST = json_decode(file_get_contents("php://input"), true);
        $mysqli = new mysqli("localhost", "root", "", "draughts");

        $userInfo = getUserInfo($mysqli);

        $correct_passw = password_verify($_POST['password'], $userInfo['password']);
        if ($userInfo['username'] && $correct_passw) {
            $_SESSION['logged in'] = true;
            setcookie('id', $userInfo['id'], 0, "/");
            header('location: game-menu.php');
            exit;
            // echo json_encode(['id'=>$userInfo['id'], 'status'=>200, 'message'=>'login successful']);
        } else if (!$userInfo['username']) {
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
                    <input type="password" name="password">
                </div>
                <div class="menu-section">
                <input type="submit" name="login">
                </div>
                <div class="menu-section">
                <?php
                if ($error):
                ?>
                <p  class="error">Username or password incorrect</p>
                <?php endif; ?>
                </div>
            </form>
        </div>
    </body>
</html>