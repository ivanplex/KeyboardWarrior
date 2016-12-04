// Pull from seanwrona typeracer
$(document).ready(function(){
    $("button").click(function() {
        $.ajax({
            url: "http://www.seanwrona.com/typeracer/text.php?id=126",
            type: 'GET',
            success: function(result) {
                console.log(result);
                $("#div1").html(result);
            }
        });
    });
});
