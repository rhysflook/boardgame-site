<!DOCTYPE html>
<?php 

if (isset($_POST['ai'])){
    setcookie('new-game', true, 0,'/');
    setcookie('colour', $_POST['colour'], 0, '/');
    header('location: game/draughts.php');
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
                <button class="menu-button">Invite Player</button>
                <button class="menu-button">Matchmaking</button>
                <h2>Select your colour</h2>
                <input type="radio" name="colour" value="black" id="black"><label>Black</label></input>
                <input type="radio" name="colour" value="white" id="white"><label>White</label></input>
                </form>
            </div>

        </div>
    </body>
</html>