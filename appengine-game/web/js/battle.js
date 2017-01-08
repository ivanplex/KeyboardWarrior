
//Global slider

var slider = {};

var inBattle = false;

function loadingScreen(){
	var waitingPanel = document.getElementById("waiting-panel");
	waitingPanel.style.display = "block";

	var countdownPanel = document.getElementById("countdown-panel");
	countdownPanel.style.display = "none";

	var paragraph = document.getElementById("paragraph-input");
	paragraph.style.display = "none";

	var source = document.getElementById("paragraph-source");
	source.style.display = "none";

	var userInputBlock = document.getElementById("user-input-block");
	userInputBlock.style.display = "none";

	var completePanel = document.getElementById("complete-panel");
	completePanel.style.display = "none";

	var leaderboardShade = document.getElementById("leaderboard-shade-area");
	leaderboardShade.style.display = "none";

	var fightingGround = document.getElementById("fighting-ground");
	fightingGround.innerHTML = "";
}

/**
 *
 */
function initBattleGround() {

	//clear slider array
	slider = {};
	drawPlayers();
}

function drawPlayers(){

	//Add player in fighting ground
	var fightingGround = document.getElementById("fighting-ground");

	fightingGround.innerHTML = "";

	var players = getPlayersInfo();

	for(var i = 0; i<players.length; i++){
		fightingGround.innerHTML += '<div id="player'+(i+1)+'" playerID="'+players[i].id+'" class="player_icon"> <img id="warrior-image-'+(i+1)+'" class="WarriorImage" src="img/warrior2.png" /><div class="player-name">'+players[i].name+'</div></div>';

		slider[players[i].id] = new Slider('player'+(i+1),'warrior-image-'+(i+1),myArray.length, $("#animate-area").width());

		//Add color filters to warrior image
		var image = document.getElementById("warrior-image-"+(i+1));
		degreeRotation = 360/players.length*i;
		image.style.filter = "hue-rotate("+degreeRotation+"deg)";
		image.style.WebkitFilter = "hue-rotate("+degreeRotation+"deg)";
	}
}

function beginCountdown(tMinus) {

	var waitingPanel = document.getElementById("waiting-panel");
	waitingPanel.style.display = "none";

	var countdownPanel = document.getElementById("countdown-panel");
	countdownPanel.style.display = "block";

	//Add players
	initBattleGround();

	var countdownNumber = document.getElementById("number-countdown");
	countdownNumber.innerHTML = tMinus;

	//Load Audio
	var countdownAudio = document.getElementById("cound-down-audio");
	var fightAudio = document.getElementById("fight-audio");

	if(tMinus>0) {	
	    countdownNumber.innerHTML = tMinus;
	    drawPlayers();
	    countdownAudio.play();
    } else {
	    //Hide Countdown
	    countdownPanel.style.display = "none";

	    //Show fight sign
	    var fightSign = document.getElementById("fight-sign");
	    fightSign.style.display = "block";

	    $("#fight-sign").animate({
	    	opacity: '1',
	    	width: '80%',
	    	paddingLeft: '20%'
	    });
	    //Play "FIGHT" audio
	    fightAudio.play();

	    //Hide fight sign in 1.5 second
	    // FIGHT!
	    setTimeout(function (){
		  fightSign.style.display = "none";
		  fight();
		}, 1500);

		inBattle = true;
	}
}

function fight() {
	var paragraph = document.getElementById("paragraph-input");
	paragraph.style.display = "block";

	var userInputBlock = document.getElementById("user-input-block");
	userInputBlock.style.display = "block";

	var source = document.getElementById("paragraph-source");
	source.style.display = "block";

	//Focus on user input
	var userInput = document.getElementById("user-input");
	userInput.value = "";
	userInput.focus();

}

function gameTimeOut(){

}

function gameCompleted(excerpt){

	var waitingPanel = document.getElementById("waiting-panel");
	waitingPanel.style.display = "none";

	var countdownPanel = document.getElementById("countdown-panel");
	countdownPanel.style.display = "none";

	var paragraph = document.getElementById("paragraph-input");
	paragraph.style.display = "none";

	var source = document.getElementById("paragraph-source");
	source.style.display = "none";

	var userInputBlock = document.getElementById("user-input-block");
	userInputBlock.style.display = "none";

	var gameFinishedPanel = document.getElementById("game-finished-panel");
	gameFinishedPanel.style.display = "block";

	var completePanel = document.getElementById("complete-panel");
	completePanel.style.display = "block";

	var leaderboardShade = document.getElementById("leaderboard-shade-area");
	leaderboardShade.style.display = "block";

	var leaderboardPanel = document.getElementById("leaderboard-panel");

	$.post( "/finished?excerpt="+excerpt, function( data ) {
		leaderboardPanel.innerHTML =  data ;
	});

	inBattle = false;
}

function playerCompleted(){

	var userInputBlock = document.getElementById("user-input-block");
	userInputBlock.style.display = "none";

	var completePanel = document.getElementById("complete-panel");
	completePanel.style.display = "block";

	var wpmPanel = document.getElementById("wpm-panel");
	wpmPanel.style.display = "block";

	var wpm = document.getElementById("wpm-div");
	wpm.innerHTML = getWPM();

}

function updateBattle(){

	if(inBattle){

		var players = getPlayersInfo();

		//Update all player's status
		for(var i = 0; i<players.length; i++){
			slider[players[i].id].shift(players[i].words_done);

			//Check if the player has finished the game
			if(players[i].id === getPlayerId() && players[i].words_done === getWordLength()){
				playerCompleted();
			}
		}

	}else if(!inBattle && getStartTime() !== -1){
		beginCountdown(getStartTime() - unixTimeStamp());	//Counting Down
	}else if(!inBattle && getStartTime() === -1){
		//alert("Game Suspended");
		loadingScreen();		//Count down is suspended
	}
 
}

function restartGame(){
	initConn();
	loadingScreen();
}

/**
 * Testing only
 */
function testMove(move){
	var players = getPlayersInfo();

	//Update all player's status
	for(var i = 0; i<players.length; i++){
		slider[players[i].id].shift(move);
	}
}
