// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("cog");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

$('#username_form').submit(function(e) {
    e.preventDefault();
    $.ajax({
        type: 'POST',
        url: 'player',
        data: { new_nickname: $('#new_nickname').val() },
        error: function()
        {
           alert("Please enter a valid username");
        },
        success: function(response)
        {
           modal.style.display = "none";
           $('#hello').text("Hello " + $('#new_nickname').val());
        }
    });
    return false;
});
