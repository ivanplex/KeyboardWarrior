var myParagraph = document.getElementById("paragraph-input")
var myInput = document.getElementById("user-input")
var myText = ""

var correctWords = 0
var mistakes = 0
var myArray = []

/**
 * check matching between user input and text
 * @param string   text to be typed
 */
function textCheck(receivedText) {
  // paragraph
  myParagraph = document.getElementById("paragraph-input")

  // input
  myInput = document.getElementById("user-input")

  // split the incoming text with spaces
  myArray = receivedText.split(" ")
  myText = receivedText

  // display text
  displayParagraph(receivedText)

  // show paragraph source
  var source = document.getElementById("paragraph-source");
  source.innerHTML = textSource;

  // highlight the first word as green
  handleWordColor(0, true)

  // reset correct words and mistakes
  correctWords = 0
  mistakes = 0

  myInput.onkeypress = function(evt) {
    evt = evt || window.event

    // if space is pressed
    if (evt.charCode == 32) {

      // if we exceed the boundary
      if (correctWords === myArray.length) {
        myParagraph.innerHTML = myText
        myInput.value = ""
        return false
      }

      var myWord = myInput.value
      if (myWord === myArray[correctWords]) {
        changeInputColor("white")
        handleWordColor(++correctWords, true)
        myInput.value = ""
        return false
      } else {
        changeInputColor("red")
        handleWordColor(correctWords, false)
        mistakes++
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
  myParagraph.innerHTML = receivedText
}

/**
 * Change color of a word
 * @param integer   index of the word in the string
 * @param boolean   span if the word is correct, class='wrong' otherwise 
 */
function handleWordColor(index, isCorrect) {
  if (index !== myArray.length) {
    // clone the global array
    var localArray = myArray.slice(0)

    localArray[index] = "<span" + (isCorrect ? ">" : " class='wrong'>") + localArray[index] + "</span>"
    
    myParagraph.innerHTML = localArray.join(" ")
  }
}

/**
 * Change background color of the input box
 * @param string   background color
 */
function changeInputColor(color) {
  myInput.style.backgroundColor = color
}

/**
 * reset text when a game is finished
 * @param string   new text to display
 */
function resetText(newText) {
  myParagraph.innerHTML = newText
}

/**
 * disable the user input box
 */
function disableInput() {
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