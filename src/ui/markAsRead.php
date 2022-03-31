<?php
    namespace draughts;
    include "../../siteUtils.php";
    $_PATCH = json_decode(file_get_contents("php://input"),true);
    $result = sendRequest(
        "UPDATE chat SET is_read = 1 WHERE user_id = ? AND recipient_id = ?",
        ['ii', $_PATCH['user_id'], $_PATCH['recipient_id']]
    );
?>