<?php 
namespace draughts;
include "../utils/siteUtils.php";
checkSession();
removeCookies(['type', 'new-game', 'player-1']);
if (isset($_POST['ai'])){
    $_SESSION['ai'] = true;
    setCookies(['new-game'=>true, 'type'=>'ai', 'colour'=>$_POST['colour']]);
    header('location: ../game/draughts.php');
}

if (isset($_POST['logout'])) {
    $_SESSION['logged in'] = false;
    header("location: ../auth/login.php");
}

if (isset($_POST['training'])) {
    if(isset($_SESSION['ai'])) {   
        unset($_SESSION['ai']);
    }  
    setCookies(
        ['player-1'=>true, 'new-game'=>true, 'type'=>'training']
    );
    header('location: ../game/draughts.php');
}

if (isset($_POST['vs-player'])) {
    if(isset($_SESSION['ai']))
        {   
            unset($_SESSION['ai']);
        }  
    sendRequest("INSERT INTO games (player_1_id) VALUES (?)", ["i", $id]);
    sendRequest("UPDATE users SET in_game=1 WHERE id=?",  ["i", $id]);
    setCookies(
        ['player-1'=>true, 'new-game'=>true, 'type'=>'vs', 'colour'=>$_POST['colour']]
    );
    $_SESSION['player-1'] = true;
    header('location: ../game/draughts.php');
}

if (isset($_POST['join-game'])) {

    [$opponent, $user] = sendRequest(
        "SELECT id, username FROM users WHERE Username = ?",
        ["s", $_POST['username']]
    )->fetch_array();
    sendRequest("INSERT INTO games (player_2_id) VALUES (?)", ["i", $id]);
    sendRequest("UPDATE users SET in_game=1 WHERE id=?", ["i", $id]);
    setCookies(['opponent'=>$opponent, 'new-game'=>true, 'type'=>'vs', 'colour'=>$_POST['colour']]);
    header('location: ../game/draughts.php');
}
if(isset($_SESSION['type']))
{   
    unset($_SESSION['type']);
}  

?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta http-equiv="ScreenOrientation" content="autoRotate:disabled">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="../../manifest.json" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="../../menu.css">
        <title>Main Menu</title>
    </head>
    <body>
        <div class="screen">
        <form method="post">
        <div id="screen" class="menu-container flex-column-center">
        <div class="popup flex-column-center">
                <div class="max flex-column-center">
                        <h1>Game Type</h1>
                        <button class="base-button" id="vs-ai" name="ai">A.I</button>
                        <button class="base-button" id="vs-player" name="vs-player">Invite</button>
                        <button class="base-button" id="training" name="training">Training</button>
                        <button class="base-button spaced" id="logout" name="logout">Logout</button> 
 
                        <!-- <h3>Input a player name to join their game</h3>
                        <input type="text" name="username">
                        <button class="base-button" id="join-game" name="join-game">Join</button> -->

                </div>
            </div>
           <div id="chat-area-bar"></div> 
        </div>
    </form>
</div>
    <script type="module" src="../../dist/gameModeMenu.bundle.js"></script>
    </body>

</html>