/**
 * Manages in game displays according to game states
 * (1) Finding Players
 * (2) Counting Down
 * (3) In Game
 * (4) Game End
 */


/*
 * Global variables
 */
var waitingPanel = null;
var countdownPanel =  null;


var paragraph =  null;			//Paragraph to type
var source =  null;		//Quote of paragraph
var userInputBlock =  null;	//Player's input
var gamePanels =  null;

var completePanel =  null;
var gameFinishedPanel =  null;
var wpmPanel =  null;
var userInputBlock = null;
var gameFinishedPanel = null;
var leaderboardShade =  null;
var gameCompletionPanels =  null;

var fightingGround = null;





window.onload = function loadAllPanels(){
	waitingPanel = document.getElementById("waiting-panel");
	countdownPanel = document.getElementById("countdown-panel");


	paragraph = document.getElementById("paragraph-input");			//Paragraph to type
	source = document.getElementById("paragraph-source");			//Quote of paragraph
	userInputBlock = document.getElementById("user-input-block");	//Player's input
	gameTimeContainer = document.getElementById("gametime-container");
	gamePanels = [paragraph, source, userInputBlock, gameTimeContainer];

	completePanel = document.getElementById("complete-panel");		
	gameFinishedPanel = document.getElementById("game-finished-panel");
	wpmPanel = document.getElementById("wpm-panel");
	userInputBlock = document.getElementById("user-input-block");
	gameFinishedPanel = document.getElementById("game-finished-panel");
	leaderboardShade = document.getElementById("leaderboard-shade-area");
	gameCompletionPanels = [completePanel, gameFinishedPanel, wpmPanel, userInputBlock, leaderboardShade];

	fightingGround = document.getElementById("fighting-ground");
};

/**
 * Show loading Screen
 * "Waiting for players"
 */
function showLoadingScreen(){
	waitingPanel.style.display = "block";
	countdownPanel.style.display = "none";

	clearGamePanels();
	clearGameCompletionPanels();
	clearFightingGround();
}

/**
 * Show Count Down
 */
function showCountDown(){
	waitingPanel.style.display = "none";
	countdownPanel.style.display = "block";

	clearGamePanels();
	clearGameCompletionPanels();
}

/**
 * Display main Game Play
 */
function showGamePlay() {

	for(var i=0;i<gamePanels.length;i++){
		gamePanels[i].style.display = "block";
	}

	//Focus on user input
	var userInput = document.getElementById("user-input");
	userInput.value = "";
	userInput.focus();
}

/**
 * Hide Loading Screen
 */
function clearloadingScreen(){
	var waitingPanel = document.getElementById("waiting-panel");
	waitingPanel.style.display = "none";
}

/**
 * Clear Count down Screen
 */
function clearCountDown(){
	waitingPanel.style.display = "none";
	countdownPanel.style.display = "none";

	clearGamePanels();
	clearGameCompletionPanels();
}

/**
 * Clear all game panels
 */
function clearGamePanels(){
	for(var j=0;j<gamePanels.length;j++){
		gamePanels[j].style.display = "none";
	}
}

/**
 * Clear all game completion panels
 */
function clearGameCompletionPanels(){
	for(var i=0;i<gameCompletionPanels.length;i++){
		gameCompletionPanels[i].style.display = "none";
	}
}

/**
 * Empty Battle ground
 */
function clearFightingGround(){
	fightingGround.innerHTML = "";
}
