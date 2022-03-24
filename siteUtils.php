<?php
namespace draughts;
function getConnection() {
    if($_SERVER["SERVER_NAME"]=="localhost"){
        return new \mysqli("127.0.0.1", "root", "", "draughts");
    } else {
        $cleardb_url = parse_url(getenv("CLEARDB_DATABASE_URL"));
        $cleardb_server = $cleardb_url["host"];
        $cleardb_username = $cleardb_url["user"];
        $cleardb_password = $cleardb_url["pass"];
        $cleardb_db = substr($cleardb_url["path"],1);
        $active_group = 'default';
        $query_builder = TRUE;
        return new \mysqli($cleardb_server, $cleardb_username, $cleardb_password, $cleardb_db);
    }
    
}

function sendRequest($sql, $params) {
    $mysqli = getConnection();
    $stmt = mysqli_prepare($mysqli, $sql);
    $stmt->bind_param(...$params);
    $stmt->execute();
    return $stmt->get_result();
}

function setCookies($cookies) {
    foreach ($cookies as $key => $value) {
        setcookie($key, $value, 0, '/');
    }
}

?>