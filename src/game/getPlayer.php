<?php
namespace draughts;
include "../../siteUtils.php";

$result = sendRequest(
    "SELECT id FROM users WHERE Username = ?",
    ["s", $_GET['user']]
)->fetch_array();
echo json_encode($result)
?>