/**
 * Image Slider
 * para1: Sliding HTML object's ID
 * para2: Sliding HTML object's ID
 * para3: length of challenge
 * para4: Canvas Maximum width
 */
function Slider(id, imageID, stringLength, max_width){

  this.lastStep = 0;

  this.shift = function(step){
    if(this.lastStep === step){

    }else if(step > stringLength){
      console.log('Invalid step');
    }else if(step < this.lastStep){
      console.log('Player moved backwards?');
    }else if(step > this.lastStep && (parseInt($('#'+id).css("margin-left")) + parseInt($('#'+imageID).css("width")))< max_width){


      //while(lastStep < step){
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

        this.lastStep++;
      //}

    }else{
      //alert(this.lastStep);
      console.log('Out of Bound!');
    }
  }
}
