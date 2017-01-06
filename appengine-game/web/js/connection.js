//Unix timestamp in seconds
function unixTimeStamp() {
    return Math.round(new Date().getTime() / 1000)
}

// Initalise connection with server
function initConn() {
    // Send timestamp and roomid waiting for server response
    $.ajax({
        type: 'POST',
        url: '/play',
        contentType: 'application/json',
        data: JSON.stringify({
            player_id: 1,
            timestamp: unixTimeStamp(),
            room_id: -1
        }),
        dataType: 'json',
        success: function (response) {
            // Create cookie upon successful response
            // new setCookie(playerId);
            handleInitialResponse(response);
            return response;
        }
    });
}

function handleInitialResponse(jsonInfo) {
    // Temporary JSON to reflect incoming JSON
    // var json = '{"player_id": 1,"start_time": "1483654609","room": [{"id": 1,"text": "Good morning, how are you?"}],"players": [{"player_id": 2,"words_done" : 30}, {"player_id" : 3,"words_done" : 40}]}';
    typeWords = jsonInfo.room.text;
    playerId = jsonInfo.player_id;

    // Towards benoit text checking, TODO: need to return words done
    textCheck(typeWords);
}

// Sends information to server periodically
function sendInfo(playerid, timestamp, wordsdone, roomid) {
    $.ajax({
        type: 'POST',
        url: '/play',
        contentType: 'application/json',
        data: JSON.stringify({
            player_id: playerid,
            timestamp: timestamp,
            room_id: roomid,
            words_done: wordsdone
        }),
        dataType: 'json',
        success: function (response) {
            return response;
        }
    });
}

// function handleResponses(noWords, ) {
    // Send (words_done), with timestamp to server every 2 seconds
    // gameid -1 means game has ended
    // var intervalInfo = setInterval(sendInfo(playerId, unixTimeStamp(), wordsDone, roomId), (2 * 1000));
    // var playersInfo = intervalInfo
// }

// Set cookie with player id set, time expiry and path
function setCookie(idValue) {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = playerID + "=" + idValue + ";" + expires + ";path=/";
}
