<?php
    namespace draughts;
    include "../../siteUtils.php";
    $result = sendRequest(
        "SELECT * FROM chat WHERE recipient_id = ? AND user_id = ? OR recipient_id = ? AND user_id = ?",
        ['iiii', $_GET['recipient_id'], $_GET['user_id'], $_GET['user_id'], $_GET['recipient_id'] ]
    )->fetch_all();

    echo json_encode($result)
?>