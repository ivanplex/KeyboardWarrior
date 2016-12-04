/**
 * Image Slider
 * para1: Player's challenge
 * para2: Canvas Maximum width
 */
function Slider(string, max_width){

  this.shift = function(){
    if(($('#img').position().left -70)< max_width-max_width/string.split(' ').length){

        $('#img').animate({left:'+='+(max_width/string.split(' ').length/4)}, 75, function(){
           $(this).attr("src", "img/warrior3.png");
        });
        $('#img').animate({left:'+='+(max_width/string.split(' ').length/4)}, 75, function(){
           $(this).attr("src", "img/warrior4.png");
        });
        $('#img').animate({left:'+='+(max_width/string.split(' ').length/4)}, 75, function(){
           $(this).attr("src", "img/warrior3.png");
        }); 
        $('#img').animate({left:'+='+(max_width/string.split(' ').length/4)}, 75, function(){
           $(this).attr("src", "img/warrior2.png");
        });

    }else{
      console.log('Out of Bound!');
    }
  }
}