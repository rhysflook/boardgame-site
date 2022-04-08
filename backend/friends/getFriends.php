<?php 
    namespace draughts;
    include "../utils/siteUtils.php";
    $resultOne = sendRequest(
        "SELECT person_1, person_1_name FROM friendships WHERE person_2 = ? UNION 
        SELECT person_2, person_2_name FROM friendships WHERE person_1 = ?",
        ["ii", $_GET['id'], $_GET['id']]
    )->fetch_all();
    // $resultTwo = sendRequest(
    //     "SELECT person_2 FROM friendships WHERE person_1 = ?",
    //     ["i", $_GET['id']]
    // )->fetch_all();
    if (!$resultOne) {
        echo json_encode([]);  
    } else {
        echo json_encode($resultOne);
    }
?>
