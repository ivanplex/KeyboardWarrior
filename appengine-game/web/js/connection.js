var correctWords = 0,
    deltaTimestamp = 0,
    roomId = -1,
    playerId,
    playersInfo = [],
    typeWords,
    wordLength,
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
    // console.log(unixTimeStamp());
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
            console.log('No response from server');
        }
    });
}

// Handles init connection response
function handleInitialResponse(jsonReply) {
    console.log("handleInitialResponse");
    this.typeWords = jsonReply.room.text;
    this.roomId = jsonReply.room.room_id;
    this.wordLength = jsonReply.room.text_length;
    this.playerId = jsonReply.player_id;
    this.playersInfo = jsonReply.room.players;

    // correct time drift from server
    this.deltaTimestamp = 0;
    this.deltaTimestamp = jsonReply.timestamp - unixTimeStamp();
    // load text received from server
    textCheck(getWordPassage());
    // start sending info at 2 seconds interval
    gameTicker = setInterval(sendInfo, 2000);
}

// Sends information to server periodically with timestamp, roomid, correctWords and mistakes
function sendInfo() {
    // console.log("sendinfo");
    var correctWords = getCorrectWord();
    console.log(correctWords, "correctWords");
    var mistakes = getMistakes();
    $.ajax({
        type: 'POST',
        url: '/play',
        contentType: 'application/json',
        data: JSON.stringify({timestamp: unixTimeStamp(), room_id: roomId, words_done: correctWords, mistakes: mistakes}),
        dataType: 'json',
        success: function (response) {
            // console.log(response);
            handleResponse(response);
        },
        error: function (e) {
            console.log('Lost connection, try again');
            clearInterval(gameTicker);
            this.gameEnd = true;
            this.roomId = -1;
            gameCompleted();
        }
    });
}

function handleResponse(jsonReply) {
    // startTime -1 means game has not started, room null means game has ended
    var room = jsonReply.room;
    // if room returned is null, dont process it
    if (room !== null) {
        this.roomId = jsonReply.room.room_id;
        this.endTime = jsonReply.room.end_time;
        this.startTime = jsonReply.room.start_time;
        this.playersInfo = jsonReply.room.players;
        console.log(this.playersInfo, "players");
    }

    var playerId = jsonReply.player_id;
    var currentTime = unixTimeStamp();
    var serverTimestamp = jsonReply.timestamp;

    if (room === null || (endTime < currentTime && endTime !== -1)) {
        console.log("clearInterval");
        // game ended or invalid room
        room_id = -1;
        clearInterval(gameTicker)
        this.gameEnd = true;
        gameCompleted();
    } else {
        // ongoing game, call the board to update itself
        this.gameEnd = false;
        updateBattle();
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

function getPlayerId() {
    // return current player's id
    return playerId;
}

function getStartTime() {
    // return -1 when game has not started, return valid when started
    return startTime;
}

function getEndTime() {
    // return time when the game is supposed to end after game has started
    return endTime;
}

function getTimeLeft() {
    // return time left in the game
    return (endTime - unixTimeStamp());
}

function getWordLength() {
    // return numbers of words needed to be typed
    return wordLength;
}

// Set cookie with player id set, time expiry and path
function setCookie(idValue) {
    var d = new Date();
    d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = playerID + "=" + idValue + ";" + expires + ";path=/";
}
