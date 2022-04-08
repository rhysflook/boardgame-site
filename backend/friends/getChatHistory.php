<?php 
    namespace draughts;
    include "../utils/siteUtils.php";
    $result = sendRequest(
        "SELECT * FROM chat WHERE recipient_id = ?",
        ['i', $_GET['recipient_id']]
    )->fetch_all();

    echo json_encode($result)

?>