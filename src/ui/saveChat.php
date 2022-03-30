<?php 
    namespace draughts;
    include "../../siteUtils.php";
    $_POST = json_decode(file_get_contents("php://input"),true);
    $result = sendRequest(
        "INSERT INTO chat (user_id, message, sender, recipient_id) VALUES (?, ?, ?, ?)",
        ["issi", $_POST['id'], $_POST['message'], $_POST['sender'], $_POST['recipient_id']]
    );

    echo json_encode($result)
?>