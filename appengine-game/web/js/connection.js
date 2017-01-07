initConn();

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
            timestamp: unixTimeStamp(),
            room_id: -1
        }),
        dataType: 'json',
        success: function (response) {
            handleInitialResponse(response);
            return response;
        },
        error: function() {
            alert('No response from server');
        }
    });
}

function handleInitialResponse(jsonReply) {
    console.log(jsonReply);
    this.typeWords = jsonReply.room.text;
    this.roomId = jsonReply.room.id;
    this.playerId = jsonReply.player_id;
    // send info until valid start_time is given
    sendInfo(playerId, unixTimeStamp(), -1, roomId, 0);
}

function getWordPassage(){
    return typeWords;
}

// Sends information to server periodically
function sendInfo(playerid, timestamp, starttime, roomid, wordsdone) {
    $.ajax({
        type: 'POST',
        url: '/play',
        contentType: 'application/json',
        data: JSON.stringify({
            // TODO: check with boon
            player_id: playerid,
            timestamp: timestamp,
            start_time: starttime,
            room_id: roomid,
            words_done: wordsdone
        }),
        dataType: 'json',
        success: function (response) {
            handleResponses(response);
            return response;
        }
    });
}

function handleResponses(jsonReply) {
    // Send (words_done), with timestamp to server every 2 seconds
    // startTime -1 means game has not started
    // gameid -1 means game has ended

    var roomId = jsonReply.room.id;
    var playerId = jsonReply.player_id;
    var startTime = jsonReply.room.start_time;

    // have to utilise other players information
    this.playersInfo = jsonReply.room.players;

    if (startTime == -1) {
        // Keep sending every two seconds until game starts
        setInterval(sendInfo(playerId, unixTimeStamp(), startTime, 0, roomId), (2 * 1000));
    } else {
        if (roomId == -1) { // game has ended
            // exit screen

        } else {
            // Game has started if current time is bigger than startTime
            if (unixTimeStamp() > startTime) {
                setInterval(sendInfo(playerId, unixTimeStamp(), startTime, 20, roomId), (2 * 1000));
            } else {
                // Start counting down to start game
                var countdownDifference = startTime - unixTimeStamp();
                beginCountdown(countdownDifference);
                setInterval(sendInfo(playerId, unixTimeStamp(), startTime, 20, roomId), (2 * 1000));
            }
        }
    }

    // need a function to return words done
}

function getPlayersInfo() {
    return playersInfo;
}

// Set cookie with player id set, time expiry and path
function setCookie(idValue) {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = playerID + "=" + idValue + ";" + expires + ";path=/";
}
