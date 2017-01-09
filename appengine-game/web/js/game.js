
/**
 * Calculate words per minute
 */
function getWPM(){
	var players = getPlayersInfo();

	for(var i = 0; i<players.length; i++){
		if(players[i].id === getPlayerId()){
			return parseInt(players[i].words_done/(players[i].updated_at - getStartTime())*60);
		}
	}

	return "--";	//No player found
}

/**
 * Exit game and join a new game
 */
function restartGame(){
	initConn();
	showLoadingScreen();
	//paragraph.style.display = "none";
	//source.style.display = "none";
}
