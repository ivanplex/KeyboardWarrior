
/*
 * Global Variables
 * ============================
 */

/*
 * Global array to store all slider object
 */
var slider = {};

//Game State
var inBattle = false;


/**
 * Draw Players in the battle ground
 */
function drawPlayers(){

	//Clear players from fighting ground and re-draw
	clearFightingGround();
	
	//clear slider array
	slider = {};

	var players = getPlayersInfo();

	for(var i = 0; i<players.length; i++){
		fightingGround.innerHTML += '<div id="player'+(i+1)+'" playerID="'+players[i].id+'" class="player_icon"> <img id="warrior-image-'+(i+1)+'-2" class="WarriorImage" src="img/warrior2.png" /><img id="warrior-image-'+(i+1)+'-3" class="WarriorImage" src="img/warrior3.png" style="display: none;"/><img id="warrior-image-'+(i+1)+'-4" class="WarriorImage" src="img/warrior4.png" style="display: none;"/><div class="player-name">'+players[i].name+'</div></div>';

		slider[players[i].id] = new Slider('player'+(i+1),'warrior-image-'+(i+1),myArray.length, $("#animate-area").width());

		//Add color filters to warrior image
		var image = document.getElementById("player"+(i+1));
		degreeRotation = 360/players.length*i;
		image.style.filter = "hue-rotate("+degreeRotation+"deg)";
		image.style.WebkitFilter = "hue-rotate("+degreeRotation+"deg)";
	}

}


/**
 * Initiate count down with T-minus: tMinus
 *
 * This function is called repeatedly by updateBattle()
 *
 * @para {Number} tMinus
 */
function countDown(tMinus) {

	clearloadingScreen();
	showCountDown();


	//Display T-Minus
	var countdownNumber = document.getElementById("number-countdown");
	countdownNumber.innerHTML = tMinus;

	//Load Audio
	var countdownAudio = document.getElementById("cound-down-audio");
	var fightAudio = document.getElementById("fight-audio");

	//Before Game begins
	if(tMinus>0) {

	    drawPlayers();	//Redraw players
	    countdownAudio.play();	//Play count-down beeps

    } else {

	    //Hide Countdown
	    clearCountDown();

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
		  showGamePlay();
		}, 1500);

		inBattle = true;
	}
}



function gameCompleted(excerpt){

	waitingPanel.style.display = "none";
	countdownPanel.style.display = "none";

	clearGamePanels();

	var userInputBlock = document.getElementById("user-input-block");
	userInputBlock.style.display = "none";

	var gameFinishedPanel = document.getElementById("game-finished-panel");
	gameFinishedPanel.style.display = "block";

	var completePanel = document.getElementById("complete-panel");
	completePanel.style.display = "block";

	var leaderboardShade = document.getElementById("leaderboard-shade-area");
	leaderboardShade.style.display = "block";

	var leaderboardPanel = document.getElementById("leaderboard-panel");

	setTimeout(
		function()
			{
				console.log("Getting Leaderboard");
				$.post( "/finished?excerpt="+excerpt, function( data ) {
				leaderboardPanel.innerHTML =  data ;
			});
	}, 2000);

	inBattle = false;
}

/**
 * Notify player has completed and display the player's performance
 */
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
		countDown(getStartTime() - unixTimeStamp());	//Counting Down
	}else if(!inBattle && getStartTime() === -1){
		//alert("Game Suspended");
		showLoadingScreen();		//Count down is suspended
	}

}
