// Asynchronous request to get the data
// $.getJSON("data/data.json", function(json) {
function textCheck(receivedText) {
  //generate text and input
  var myParagraph = document.getElementById("myText")

  // myParagraph.innerHTML = json.text
  myParagraph.innerHTML = receivedText;

  // get the value of the paragraph and split it
  var myText = document.getElementById("myText").innerHTML
  var myArray = myText.split(" ")

  // input
  var myInput = document.getElementById("myInput")

  var re1 = new RegExp(myArray[0],"g")

  $("p:contains(" + myArray[0] + ")").html(function(_, html) {
    return html.replace(re1, '<span>'+ myArray[0] + '</span>')
  })

  // handle the event
  var count = 0
  myInput.onkeypress = function(evt) {
    evt = evt || window.event
    if (evt.keyCode == 32) {
      if(count >= myArray.length) {
        return false
      }
      var myWord = myInput.value
      if (myWord == myArray[count]) {
        myInput.style.backgroundColor = "white";
        // change color of words
        var myText2 = document.getElementById("myText")
        myText2.innerHTML = myText2.innerHTML.replace(/<\/?span[^>]*>/g,"")
        var re3 = new RegExp(myArray[count+1],"g")
        $("p:contains(" + myArray[count+1] + ")").html(function(_, html) {
          return html.replace(re3, '<span>'+ myArray[count+1] + '</span>')
        })
        count += 1
        // reset value of the input
        myInput.value = ""
        return false
      } else {
        myInput.style.backgroundColor = "red";
        var re3 = new RegExp(myArray[count],"g")
        $("p:contains(" + myArray[count] + ")").html(function(_, html) {
          return html.replace(re3, '<span class="wrong">'+ myArray[count] + '</span>')
        })
        return false
      }
    }
  }
}
// })
