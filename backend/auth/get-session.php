<?php
    session_start();
    if ($_SESSION['id']){
        echo json_encode(['sessionActive'=>True]);
    }
?>