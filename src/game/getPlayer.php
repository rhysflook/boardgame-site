<?php
namespace draughts;
include "../../siteUtils.php";

$result = sendRequest(
    "SELECT id FROM users WHERE Username = ?",
    ["s", $_GET['user']]
)->fetch_array();

if (!$result) {
 http_response_code(400);  
}

echo json_encode($result)
?>