// Get the modal
var leaderboardModal = document.getElementById('leaderboardModal');

// Get the <span> element that closes the modal
var leaderboardSpan = document.getElementsByClassName("close")[1];

// When the user clicks on <span> (x), close the modal
leaderboardSpan.onclick = function() {
    leaderboardModal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        leaderboardModal.style.display = "none";
    }
}

function onFinished(excerpt){
  leaderboardModal.style.display = "block";
  $.post( "/completed?excerpt="+excerpt, function( data ) {
    $( "#completedbox" ).html( data );
  });
}
