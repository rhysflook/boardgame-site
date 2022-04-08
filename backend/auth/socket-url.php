<?php 
    if($_SERVER["SERVER_NAME"]=="localhost") {
        echo "ws://localhost:8001/";
    } else {
        echo json_encode(getenv('SOCKET_URL'));    
    }
?>