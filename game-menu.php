<!DOCTYPE html>
<?php 

session_start();
if (isset($_POST['ai'])){
    setcookie('new-game', true, 0,'/');
    setcookie('type', 'ai', 0, '/');
    setcookie('colour', $_POST['colour'], 0, '/');
    $_SESSION['type'] = 'ai';
    header('location: game/draughts.php');
}
echo var_dump($_POST);
if (isset($_POST['vs-player'])) {
    $id = $_COOKIE['id'];

    $mysqli = new mysqli("localhost", "root", "", "draughts");
    $sql = "INSERT INTO games (player_1_id) VALUES (?)";
    $stmt = mysqli_prepare($mysqli, $sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $sql = "UPDATE users SET in_game=1 WHERE id=?";
    $stmt = mysqli_prepare($mysqli, $sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    setcookie('player-1', true, 0, '/');
    setcookie('new-game', true, 0,'/');
    setcookie('type', 'vs', 0, '/');
    setcookie('colour', $_POST['colour'], 0, '/');
    header('location: game/draughts.php');
}
if (isset($_POST['join-game'])) {
    $mysqli = new mysqli("localhost", "root", "", "draughts");
    $sql = "SELECT id, username FROM users WHERE Username = ?";
    $stmt = mysqli_prepare($mysqli, $sql);
    $stmt->bind_param("s", $_POST['username']);
    $stmt->execute();
    $stmt->bind_result($opponent, $user);
    $stmt->fetch();
    $id = $_COOKIE['id'];
    $mysqli = new mysqli("localhost", "root", "", "draughts");
    $sql = "INSERT INTO games (player_2_id) VALUES (?)";
    $stmt = mysqli_prepare($mysqli, $sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $sql = "UPDATE users SET in_game=1 WHERE id=?";
    $stmt = mysqli_prepare($mysqli, $sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    setcookie('opponent', $opponent, 0, '/');
    setcookie('new-game', true, 0,'/');
    setcookie('type', 'join-game', 0, '/');
    header('location: game/draughts.php');
}
if(isset($_SESSION['type']))
{   
    unset($_SESSION['type']);
}  

?>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <link rel="stylesheet" href="menu.css">
    </head>
    <body>
        <div class="menu-container">
        <div class="menu-upper">
                <h2>Game Type</h2>
                <form method="post">
                <button class="menu-button" id="vs-ai" name="ai">A.I</button>
                <button class="menu-button" id="vs-player" name="vs-player">Invite Player</button>
                <br>
                <br>
                <p>Input a player name to join their game</p>
                <input type="text" name="username">
                <button class="menu-button" id="join-game" name="join-game">Join game</button>
                <h2>Select your colour</h2>
                <input type="radio" name="colour" value="black" id="black"><label>Black</label></input>
                <input type="radio" name="colour" value="white" id="white" checked><label>White</label></input>
                </form>
            </div>

        </div>
    </body>
</html>