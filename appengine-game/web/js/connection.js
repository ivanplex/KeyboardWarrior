function unixTimeStamp() {
    // get unix time in seconds
    return Math.round(new Date().getTime() / 1000)
}

// Initalise connection with server
function initConn() {
    // TODO: get from server??? generate user id
    var playerId = Math.random().toString(36).substr(2, 16);

    console.log(unixTimeStamp());

    console.log(uniqueId);

    // Send playerid, timestamp and roomid waiting for server response
    $.ajax({
        type: "POST",
        url: '/play',
        contentType: 'application/json',
        crossDomain: true,
        data: JSON.stringify({
            player_id: playerId,
            time_stamp: unixTimeStamp(),
            room_id: -1
        }),
        dataType: 'json',
        success: function (response) {
            // Create cookie upon successful response
            new setCookie(playerId);
            console.log(response);
            return $.parseJSON(response);
        }
    });
}

// Sends information to server periodically
function sendInfo(playerid, timestamp, wordsdone, roomid) {
    $.ajax({
        url: '/play',
        type: 'POST',
        contentType: 'application/json',
        crossDomain: true,
        data: JSON.stringify({
            player_id: playerid,
            current_time: timestamp,
            room_id: roomid,
            words_done: wordsdone
        }),
        dataType: 'json',
        success: function (response) {
            console.log(response);
            return $.parseJSON(response);;
        }
    });
}

// Set cookie with player id set, time expiry and path
function setCookie(idValue) {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = playerID + "=" + idValue + ";" + expires + ";path=/";
}
