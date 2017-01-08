
/**
 * Calculate words per minute
 */
function getWPM(){
	var players = getPlayersInfo();

	for(var i = 0; i<players.length; i++){
		if(players[i].id === getPlayerId()){
			return players[i].words_done/(players[i].updated_at - getStartTime())*60;
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
}