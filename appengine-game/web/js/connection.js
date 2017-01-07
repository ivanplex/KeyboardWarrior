var correctWords = 0,
deltaTimestamp = 0,
roomId = -1,
playerId,
playersInfo = [],
typeWords,
gameEnd = false,
startTime = 0,
endTime;

initConn();

//Unix timestamp in seconds
function unixTimeStamp() {
    return Math.round(new Date().getTime() / 1000 + deltaTimestamp)
}

var gameTicker;

// Initalise connection with server
function initConn() {
    console.log(unixTimeStamp());
    // Send timestamp and roomid waiting for server response
    $.ajax({
        type: 'POST',
        url: '/play',
        contentType: 'application/json',
        data: JSON.stringify({timestamp: unixTimeStamp(), room_id: -1}),
        dataType: 'json',
        success: function (response) {
            console.log(response);
            handleInitialResponse(response);
        },
        error: function (e) {
            console.log(e);
            // alert('No response from server');
        }
    });
}

function handleInitialResponse(jsonReply) {
    console.log("handleInitialResponse");
    this.typeWords = jsonReply.room.text;
    this.roomId = jsonReply.room.room_id;
    this.playerId = jsonReply.player_id;
    this.playersInfo = jsonReply.room.players;

    deltaTimestamp = 0;
    deltaTimestamp = jsonReply.timestamp - unixTimeStamp();

    textCheck(getWordPassage());
    // start sending info at 2 seconds interval
    gameTicker = setInterval(sendInfo, 2000);
}

// Sends information to server periodically
function sendInfo() {
    console.log("sendinfo");
    var correctWords = getCorrectWord();
    var mistakes = getMistakes();
    $.ajax({
        type: 'POST',
        url: '/play',
        contentType: 'application/json',
        data: JSON.stringify({timestamp: unixTimeStamp(), room_id: roomId, words_done: correctWords, mistakes: mistakes}),
        dataType: 'json',
        success: function (response) {
            console.log(response);
            handleResponse(response);
        },
        error: function (e) {
            console.log(e);
            alert('Lost connection, try again');
            $("#GameCanvas").hide();
            $("#SplashScreen").show();
            clearInterval(gameTicker);
        }
    });
}

function handleResponse(jsonReply) {
    // startTime -1 means game has not started
    // room null means game has ended
    var room = jsonReply.room;
    // if room returned is null, dont process it
    if (room !== null) {
        this.roomId = jsonReply.room.room_id;
        this.endTime = jsonReply.room.end_time;
        this.startTime = jsonReply.room.start_time;
        this.playersInfo = jsonReply.room.players;
    }

    var playerId = jsonReply.player_id;
    var currentTime = unixTimeStamp();
    var serverTimestamp = jsonReply.timestamp;

    if (room === null || (endTime < currentTime && endTime !== -1)) {
        console.log("clearInterval");
        // game ended or invalid room
        room_id = -1;
        $("#GameCanvas").hide();
        $("#SplashScreen").show();
        clearInterval(gameTicker)

        // resetBoard()
        // exit screen
        // give benoit a reset request
        this.gameEnd = true;
    } else {
        this.gameEnd = false;
        // updateBoard()
        // tell Mr. Ivan to update the board.
        // he can then ask for the startTime, and have state in the battle.js
        // to determine whether or not to start the countdown-
        // as well as to update the players movements by requesting it from you

        // game is ongoing
        if (startTime !== -1) {
            //updateBoard()
            // call this and have ivan
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

// add delta to take into consideration of drift timestamp
function getDeltaTimestamp() {
    return (deltaTimestamp + unixTimeStamp());
}

// Set cookie with player id set, time expiry and path
function setCookie(idValue) {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = playerID + "=" + idValue + ";" + expires + ";path=/";
}
