initConn();

var words_done = 1;
var roomId;
var playerId;
var playersInfo;
var typeWords;
var gameEnd = false;
var startTime = 0;

//Unix timestamp in seconds
function unixTimeStamp() {
    return Math.round(new Date().getTime() / 1000)
}

var gameTicker;

// Initalise connection with server
function initConn() {
    // Send timestamp and roomid waiting for server response
    $.ajax({
        type: 'POST',
        url: '/play',
        contentType: 'application/json',
        data: JSON.stringify({timestamp: unixTimeStamp(), room_id: -1}),
        dataType: 'json',
        success: function (response) {
            handleInitialResponse(response);
        },
        error: function (e) {
            console.log(e);
            alert('No response from server');
        }
    });
}

function handleInitialResponse(jsonReply) {
    console.log("handleInitialResponse");
    this.typeWords = jsonReply.room.text;
    this.roomId = jsonReply.room.room_id;
    this.playerId = jsonReply.player_id;

    // start sending info at 2 seconds interval
    var gameTicker = setInterval(function(){
        sendInfo();
    }, 2000);
}


// Sends information to server periodically
function sendInfo() {
    console.log("sendinfo");
    $.ajax({
        type: 'POST',
        url: '/play',
        contentType: 'application/json',
        data: JSON.stringify({timestamp: unixTimeStamp(), room_id: roomId, words_done: words_done}),
        dataType: 'json',
        success: function (response) {
            handleResponse(response);
        },
        error: function (e) {
            console.log(e);
            alert('Lost connection, try again');
        }
    });
}

function handleResponse(jsonReply) {
    // Send (words_done), with timestamp to server every 2 seconds
    // startTime -1 means game has not started
    // roomid -1 means game has ended
    var roomId = jsonReply.room.room_id;
    var playerId = jsonReply.player_id;
    this.startTime = jsonReply.room.start_time;
    var endTime = jsonReply.room.end_time;

    var currentTime = unixTimeStamp();

    // have to utilise other players information
    this.playersInfo = jsonReply.room.players;

    if (jsonReply.room === null || endTime < currentTime) {
        console.log("clearInterval");
        // game ended or invalid room
        room_id = -1;
        clearInterval(gameTicker)
        // exit screen

        // give benoit a reset request
        this.gameEnd = true;
    } else {
        this.gameEnd = false;
        // game is ongoing
        if (startTime !== -1) {
            // game has started
            if (startTime < currentTime) {
                // Start counting down to start game
                var countdownDifference = startTime - currentTime;
                beginCountdown(countdownDifference);
            }
        } else {
            // wait for startTime, show waiting screen at #gamecanvas
            // document.getElementById("countdown-panel").style.display = "none";
        }
    }
}

function getGameStatus() {
    // returns true when game has ended, false when ongoing
    return gameEnd;
}

function getPlayersInfo() {
    // returns players information in the room
    return playersInfo;
}

function getWordPassage() {
    // return words to be typed
    return typeWords;
}

function getPlayerId(){
    // return current player's id
    return playerId;
}

function getStartTime(){
    // return -1 when game has not started, return valid when started
    return startTime;
}

// Set cookie with player id set, time expiry and path
function setCookie(idValue) {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = playerID + "=" + idValue + ";" + expires + ";path=/";
}
