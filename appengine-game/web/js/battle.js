function waitingScreen(){

}


/**
 * 
 */
function initBattleGround() {

	alert(getPlayersInfo());
	var numOfPlayer = 5;

	//Add player in fighting ground
	var fightingGround = document.getElementById("fighting-ground");

	for(var i = 1; i<=numOfPlayer; i++){
		fightingGround.innerHTML += '<div id="player'+i+'" playerID="" class="player_icon"> <img id="warrior-image-'+i+'" class="WarriorImage" src="img/warrior2.png" /><div class="player-name">'+"Ivan Chan"+'</div></div>';	

		//Add color filters to warrior image
		var image = document.getElementById("warrior-image-"+i);
		degreeRotation = 360/numOfPlayer*(i-1);
		image.style.filter = "hue-rotate("+degreeRotation+"deg)";
		image.style.WebkitFilter = "hue-rotate("+degreeRotation+"deg)";
	}

}

function beginCountdown() {

	var waitingPanel = document.getElementById("waiting-panel");
	waitingPanel.style.display = "none";

	var countdownPanel = document.getElementById("countdown-panel");
	countdownPanel.style.display = "block";

	//Add players
	initBattleGround();

	var countdownNumber = document.getElementById("number-countdown");
	var countdownFrom = 5;
	countdownNumber.innerHTML = countdownFrom;

	//LET THE COUNT DOWN BEGIN!!
	var timeinterval = setInterval(function(){
	    countdownFrom--;
	    countdownNumber.innerHTML = countdownFrom;
	    if(countdownFrom<0){
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
