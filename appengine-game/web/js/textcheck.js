var 
correctWords = 0,
mistakes = 0
/**
 * check matching between user input and text
 * @param string   text to be typed
 */
function textCheck(receivedText) {

  // display text
  displayParagraph(receivedText)

  var myParagraph = document.getElementById("paragraph-input")
  var myArray = myParagraph.innerHTML.split(" ")
  // input
  var myInput = document.getElementById("user-input")

  handleWordColor(0, true)

  // handle events
  var count = 0
  myInput.onkeypress = function(evt) {
    evt = evt || window.event
    if (evt.keyCode == 32) {
      if(count >= myArray.length-1) {
        myParagraph.innerHTML = myParagraph.innerHTML.replace(/<\/?span[^>]*>/g,"")
        correctWords ++
        myInput.value = ""
        disableInput()
        return false
      }
      var myWord = myInput.value
      if (myWord == myArray[count]) {
        changeInputColor("white")
        handleWordColor(count+1, true)
        count ++
        correctWords ++
        myInput.value = ""
        return false
      } else {
        changeInputColor("red")
        handleWordColor(count, false)
        mistakes ++
        return false
      }
    }
  }
}

/**
 * Display the text to be typed
 * @param string   text to be typed
 */
 function displayParagraph(receivedText) {
  
  var myParagraph = document.getElementById("paragraph-input")
  myParagraph.innerHTML = receivedText

}

/**
 * Change color of a word
 * @param integer   index of the word in the string
 * @param boolean   span if the word is correct, class='wrong' otherwise 
 */
function handleWordColor(index, isCorrect) {

  var myParagraph = document.getElementById("paragraph-input")
  myParagraph.innerHTML = myParagraph.innerHTML.replace(/<\/?span[^>]*>/g,"")

  var myArray = myParagraph.innerHTML.split(" ")

  if(isCorrect === true) {
    myArray[index] = "<span>" + myArray[index] + "</span>"  
  } else if(isCorrect === false) {
    myArray[index] = "<span class='wrong'>" + myArray[index] + "</span>"
  }
  
  myParagraph.innerHTML = myArray.join(" ")

}

/**
 * Change background color of the input box
 * @param string   background color
 */
function changeInputColor(color) {

  var myInput = document.getElementById("user-input")
  myInput.style.backgroundColor = color

}

/**
 * reset text when a game is finished
 * @param string   new text to display
 */
function resetText(newText) {

  var myParagraph = document.getElementById("paragraph-input")
  myParagraph.innerHTML = newText

}

/**
 * disable the user input box
 */
function disableInput() {

  var myInput = document.getElementById("user-input")
  myInput.disabled = true

}

/**
 * get the number of correct word typed so far
 */
function getCorrectWord() {

  return correctWords
  
}

/**
 * get the number of mistakes typed so far
 */
function getMistakes() {

  return mistakes

}