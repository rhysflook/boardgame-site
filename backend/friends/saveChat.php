<?php 
    namespace draughts;
    include "../utils/siteUtils.php";
    $_POST = json_decode(file_get_contents("php://input"),true);
    $result = sendRequest(
        "INSERT INTO chat (user_id, message, sender, recipient_id, is_read, date_sent) VALUES (?, ?, ?, ?, ?, ?)",
        ["issiii", $_POST['id'], $_POST['message'], $_POST['sender'], $_POST['recipient_id'], $_POST['is_read'], $_POST['date_sent']]
    );

    echo json_encode($result)
?>