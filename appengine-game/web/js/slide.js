/**
 * Image Slider
 * para1: Sliding HTML object's ID
 * para2: Sliding HTML object's ID
 * para3: length of challenge
 * para4: Canvas Maximum width
 */
function Slider(id, imageID, stringLength, max_width){
  this.shift = function(){
    if((parseInt($('#'+id).css("margin-left")) + parseInt($('#'+imageID).css("width")))< max_width){

        var availableWidth = (max_width - parseInt($('#'+imageID).css("width")))/stringLength;

        $('#'+id).animate({marginLeft:'+='+(availableWidth/4)}, 75, function(){
           $('#'+imageID).attr("src", "img/warrior3.png");
        });
        $('#'+id).animate({marginLeft:'+='+(availableWidth/4)}, 75, function(){
           $('#'+imageID).attr("src", "img/warrior4.png");
        });
        $('#'+id).animate({marginLeft:'+='+(availableWidth/4)}, 75, function(){
           $('#'+imageID).attr("src", "img/warrior3.png");
        });
        $('#'+id).animate({marginLeft:'+='+(availableWidth/4)}, 75, function(){
           $('#'+imageID).attr("src", "img/warrior2.png");
        });

    }else{
      
      console.log('Out of Bound!');
    }
  }
}
