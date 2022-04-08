<?php 
    namespace draughts;
    include "../utils/siteUtils.php";
    $_POST = json_decode(file_get_contents("php://input"),true);

    $result = sendRequest(
        "INSERT INTO friendships (person_1, person_2, person_1_name, person_2_name) VALUES (?, ?, ?, ?)",
        ["iiss", $_POST['id'], $_POST['friendId'], $_POST['name'], $_POST['friendName']]
    );


    echo json_encode($result);

?>