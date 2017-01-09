/**
 * Image Slider
 * para1: Sliding HTML object's ID
 * para2: Sliding HTML object's ID
 * para3: length of challenge
 * para4: Canvas Maximum width
 */
function Slider(id, imageID, stringLength, max_width){

  this.lastStep = 0;

  this.changeImage = function(image){
    if(image === 2){
      $('#'+imageID+'-2').show();
      $('#'+imageID+'-3').hide();
      $('#'+imageID+'-4').hide();
    }else if(image === 3){
      $('#'+imageID+'-2').hide();
      $('#'+imageID+'-3').show();
      $('#'+imageID+'-4').hide();

    }else if(image === 4){
      $('#'+imageID+'-2').hide();
      $('#'+imageID+'-3').hide();
      $('#'+imageID+'-4').show();
    }
  }

  this.shift = function(step){
    if(this.lastStep === step){

    }else if(step > stringLength){
      console.log('Invalid step');
    }else if(step < this.lastStep){
      console.log('Player moved backwards?');
    }else if(step > this.lastStep && (parseInt($('#'+id).css("margin-left")) + parseInt($('#'+imageID+'-2').css("width")))< max_width){

      
      while(this.lastStep < step){
        var availableWidth = (max_width - parseInt($('#'+imageID+'-2').css("width")))/stringLength;

        $('#'+id).animate({marginLeft:'+='+(availableWidth/4)}, 75, this.changeImage(3));
        $('#'+id).animate({marginLeft:'+='+(availableWidth/4)}, 75, this.changeImage(4));
        $('#'+id).animate({marginLeft:'+='+(availableWidth/4)}, 75, this.changeImage(3));
        $('#'+id).animate({marginLeft:'+='+(availableWidth/4)}, 75, this.changeImage(2));

        this.lastStep++;
      }

    }else{
      //alert(this.lastStep);
      console.log('Out of Bound!');
    }
  };
}
