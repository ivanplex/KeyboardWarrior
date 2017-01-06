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

function handleInitialResponse(jsonReply) {
    // Temporary JSON to reflect incoming JSON
    // {
    //     "player_id": 5,
    //     "room": [{
    // 		"players": [{
    // 			"id": 5,
    // 			"name": "asdsada",
    // 			"updated_at": 1483,
    // 			"words_done": 0
    // 		}],
    // 		"room_id": 8,
    // 		"source": "etc",
    // 		"start_time": -1,
    // 		"text":"asdasdasd",
    // 		"text_id": "21",
    //     }],
    // 	"timestamp": 1483
    // }
    console.log(jsonReply);
    var typeWords = jsonReply.room.text;
    var roomId = jsonReply.room.id;
    var playerId = jsonReply.player_id;

    /***
     * Image Slider
     * para1: Player's challenge
     * para2: Canvas Maximum width
     */
    var slider = new Slider(typeWords, $("#animate-area").width());
    // Call function
    $(document).keypress(null, slider.shift);

    // Towards Benoit text checking, TODO: need to return words done
    textCheck(typeWords);

    // sendInfo(playerId, unixTimeStamp(), wordsDone, )
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
