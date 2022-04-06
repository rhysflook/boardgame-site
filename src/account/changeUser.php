<?php
    namespace draughts;
    include "../../siteUtils.php";
    $_PATCH = json_decode(file_get_contents("php://input"),true);
    // echo isset($_PATCH['newName'])

    function getQuery($data) {
        $set = '';
        $params = null;
        if ($data['newName'] === '') {
            $set = 'password = ?';
            $params = ['ss', password_hash($data['password'], PASSWORD_DEFAULT), $data['username']];
        } else if ($data['password'] === '') {
            $set = "username = ?";
            $params = ['ss', $data['newName'], $data['username']];

        } else {
            $set = 'username = ?, password = ?';
            $params = ['sss', $data['newName'], password_hash($data['password'], PASSWORD_DEFAULT), $data['username']];

        }
        return ["UPDATE users SET {$set} WHERE username = ?", $params];
    }

    function updateFriendships($username, $newName, $num) {
        sendRequest(
            "UPDATE friendships SET person_{$num}_name = ? WHERE person_{$num}_name = ?",
            ['ss', $newName, $username]
        );
    }

    $result = getUser($_PATCH['username']);
 
    if (!$result) {
        errorResponse('User not found', '400 Bad Request');
    } else {
        [$sql, $params] = getQuery($_PATCH);
        sendRequest(
            $sql,
            $params
        );

        $result = getUser($_PATCH['newName']);
        if ($result && $_PATCH['password'] === '') {
            echo json_encode([
                'type'=>'username',
                'username'=>$result[0],
                'id'=>$result[1],
                'in_game'=>$result[2]
            ]);
        updateFriendships($_PATCH['username'], $result[0], '1');
        updateFriendships($_PATCH['username'], $result[0], '2');
        } else if( $_PATCH['newName'] === '') {
            echo json_encode(
                [
                    'type'=>'password'
                ]
            );
        } else if ($result) {
            echo json_encode([
                'type'=>'both',
                'username'=>$result[0],
                'id'=>$result[1],
                'in_game'=>$result[2]
            ]);
            updateFriendships($_PATCH['username'], $result[0], '1');
        updateFriendships($_PATCH['username'], $result[0], '2');
        }
    }

?>