

function beginCountdown() {
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
		    var countdownPanel = document.getElementById("countdown-panel");
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
