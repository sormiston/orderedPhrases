// INITIAL DATA
const phrases = {
  q1: 'Hay un muchacho y una muchacha en la clase de matemáticas.',
  q2: 'El maestro dice que los estudiantes necesitan un lápiz.',
  q3: 'Camila no tiene papel y Mateo tiene papel.',
  q4: 'Camila no tiene un libro de matemáticas y necesita un libro.',
  q5:
    'Mateo no tiene un lápiz, no tiene una hoja de papel, y no tiene un libro.',
  q6: 'El maestro está furioso.',
}

// Hold for reference
const correctOrder = Object.freeze({
  q1: 0,
  q2: 1,
  q3: 2,
  q4: 3,
  q5: 4,
  q6: 5
})

// translate 'phrases' object into an array of objects for sorting / handling
const phrasesArr = []
for (const [placeNum, text] of Object.entries(phrases)) {
  phrasesArr.push({ placeNum, text })
}

// FISHER YATES SHUFFLE - https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(array) {
  let counter = array.length

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter)

    // Decrease counter by 1
    counter--

    // And swap the last element with it
    let temp = array[counter]
    array[counter] = array[index]
    array[index] = temp
  }

  return array
}

// shuffle
let shuffledPhrasesArr = shuffle(phrasesArr)

// generate HTML elements
shuffledPhrasesArr.forEach(phraseObj => {
  const newDiv = document.createElement('div')
  newDiv.id = phraseObj.placeNum
  newDiv.innerText = phraseObj.text
  newDiv.classList.add('phrase')
  
  newDiv.classList.add('border', 'p-2')
  
  newDiv.setAttribute('draggable', true)
  newDiv.setAttribute('ondragstart', 'drag(event)')
  newDiv.setAttribute('ondrop', 'drop(event)')
  newDiv.setAttribute('ondragover', 'allowDrop(event)')
  document.getElementById('parent').appendChild(newDiv)
});


// Check Answer logic 
function checkAnswer() {
  // make tabulations and render pass/fail colors to UI
  let correct = 0
  let incorrect = 0
  let submission = [...document.getElementById('parent').children]
  submission.forEach((phrase, idx) => {
    if (idx === correctOrder[phrase.id]) {
      phrase.classList.add('border-success')
      correct++
    } else {
      phrase.classList.add('border-danger')
      incorrect++
    }
    // lock dragging
    phrase.removeAttribute('draggable')
  })
    // render feedback message - with conditional styling for pass/fail
    let resultDisplay = document.getElementById('result-display')
    if (correct >= 5) {
      resultDisplay.classList.add('text-success')
      resultDisplay.innerText = `${correct}/${correct + incorrect} answers correct!`
    } else {
      resultDisplay.classList.add('text-danger')
      resultDisplay.innerText = `${correct}/${correct + incorrect} answers correct`
    }
    
    
}

// DRAG AND DROP FUNCTIONALITY

function drag(e) {
  e.dataTransfer.setData('text', e.target.id)
}

function drop(e) {
  let dragindex = 0
  let dropindex = 0

  e.preventDefault()
  let clone = e.target.cloneNode(true)

  let data = e.dataTransfer.getData('text')
  let nodelist = document.getElementById('parent').children
  for (let i = 0; i < nodelist.length; i++) {
    if (nodelist[i].id == data) {
      dragindex = i
      // prevent duplication
      if (clone.id === nodelist[i].id) return
    }
  }

  document
    .getElementById('parent')
    .replaceChild(document.getElementById(data), e.target)

  document
    .getElementById('parent')
    .insertBefore(clone, nodelist[dragindex])
}

function allowDrop(e) {
  e.preventDefault()
}
