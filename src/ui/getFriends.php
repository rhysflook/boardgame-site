<?php 
    namespace draughts;
    include "../../siteUtils.php";
    $result = sendRequest(
        "SELECT * FROM friendships WHERE person_1 = ? OR person_2 = ?",
        ["ii", $_GET['id'], $_GET['id']]
    )->fetch_all();
    if (!$result) {
        http_response_code(400);  
    } else {
        echo json_encode($result);
    }
?>
