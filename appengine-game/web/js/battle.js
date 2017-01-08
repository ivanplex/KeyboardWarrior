
//Global slider

var slider = {};

var countingDown = false;
var inBattle = false;

function loadingScreen(){

	var waitingPanel = document.getElementById("waiting-panel");
	waitingPanel.style.display = "block";

	var countdownPanel = document.getElementById("countdown-panel");
	countdownPanel.style.display = "none";

	var paragraph = document.getElementById("paragraph-input");
	paragraph.style.display = "none";

	var userInputBlock = document.getElementById("user-input-block");
	userInputBlock.style.display = "none";

	var completePanel = document.getElementById("complete-panel");
	completePanel.style.display = "none";

}

/**
 * 
 */
function initBattleGround() {

	//Add player in fighting ground
	var fightingGround = document.getElementById("fighting-ground");

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

	//Change count down state
	countingDown = true;

	var waitingPanel = document.getElementById("waiting-panel");
	waitingPanel.style.display = "none";

	var countdownPanel = document.getElementById("countdown-panel");
	countdownPanel.style.display = "block";

	//Add players
	initBattleGround();

	var countdownNumber = document.getElementById("number-countdown");
	var countdownFrom = tMinus;
	countdownNumber.innerHTML = countdownFrom;

	var countdownAudio = document.getElementById("cound-down-audio");

	//LET THE COUNT DOWN BEGIN!!
	var timeinterval = setInterval(function(){
	    countdownFrom--;
	    countdownNumber.innerHTML = countdownFrom;

	    if(countdownFrom<1){
		    clearInterval(timeinterval);

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

		    //Hide fight sign in 1.5 second
		    // FIGHT!
		    setTimeout(function (){
			  fightSign.style.display = "none";
			  fight();
			}, 1500);

			countingDown = false;
			inBattle = true;

		}else{
			countdownAudio.play();
		}
	},1000);

}

function fight() {
	var paragraph = document.getElementById("paragraph-input");
	paragraph.style.display = "block";

	var userInputBlock = document.getElementById("user-input-block");
	userInputBlock.style.display = "block";

	//Focus on user input
	var userInput = document.getElementById("user-input");
	userInput.focus();

}

function gameTimeOut(){

}

function gameCompleted(){

	var waitingPanel = document.getElementById("waiting-panel");
	waitingPanel.style.display = "none";

	var countdownPanel = document.getElementById("countdown-panel");
	countdownPanel.style.display = "none";

	var paragraph = document.getElementById("paragraph-input");
	paragraph.style.display = "none";

	var userInputBlock = document.getElementById("user-input-block");
	userInputBlock.style.display = "none";

	var completePanel = document.getElementById("complete-panel");
	completePanel.style.display = "block";

	var wpm = document.getElementById("wpm-div");
	wpm.innerHTML = getWPM();

	inBattle = false;
}

function updateBattle(){

	if(inBattle){

		var players = getPlayersInfo();

		//Update all player's status
		for(var i = 0; i<players.length; i++){
			slider[players[i].id].shift(players[i].words_done);
		}

	}else if(!countingDown && getStartTime() !== -1){
		beginCountdown(getStartTime() - unixTimeStamp());
	}
}

function restartGame(){
	initConn();
	loadingScreen();
}