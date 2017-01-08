function getWPM(){
	var players = getPlayersInfo();

	//Update all player's status
	for(var i = 0; i<players.length; i++){
		if(players[i].id === getPlayerId()){
			return players[i].words_done/(players[i].updated_at - getStartTime())*60;
		}
	}
}