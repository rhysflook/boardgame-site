<?php 
namespace draughts;
include "siteUtils.php";
session_start();
$id = $_COOKIE['id'];
if (isset($_POST['ai'])){
    $_SESSION['type'] = 'ai';
    setCookies(['new-game'=>true, 'type'=>'ai', 'colour'=>$_POST['colour']]);
    header('location: game/draughts.php');
}

if (isset($_POST['vs-player'])) {
    sendRequest("INSERT INTO games (player_1_id) VALUES (?)", ["i", $id]);
    sendRequest("UPDATE users SET in_game=1 WHERE id=?",  ["i", $id]);
    setCookies(
        ['player-1'=>true, 'new-game'=>true, 'type'=>'vs', 'colour'=>$_POST['colour']]
    );
    header('location: game/draughts.php');
}

if (isset($_POST['join-game'])) {

    [$opponent, $user] = sendRequest(
        "SELECT id, username FROM users WHERE Username = ?",
        ["s", $_POST['username']]
    )->fetch_all();
    sendRequest("INSERT INTO games (player_2_id) VALUES (?)", ["i", $id]);
    sendRequest("UPDATE users SET in_game=1 WHERE id=?", ["i", $id]);
    setCookies(['opponent'=>$opponent, 'new-game'=>true, 'type'=>'vs', 'colour'=>$_POST['colour']]);
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