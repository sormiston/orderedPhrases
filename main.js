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
  q6: 5,
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

// generate HTML elements + append to document parent container
shuffledPhrasesArr.forEach((phraseObj) => {
  const newDiv = document.createElement('div')
  newDiv.id = phraseObj.placeNum
  newDiv.innerText = phraseObj.text
  newDiv.classList.add('phrase')
  newDiv.classList.add('border', 'p-2')
  
  // dom event callbacks follow the "attribute" pattern for easier cloning
  newDiv.setAttribute('draggable', true)
  newDiv.setAttribute('ondragstart', 'drag(event)')
  newDiv.setAttribute('ondrop', 'drop(event)')
  newDiv.setAttribute('ondragover', 'allowDrop(event)')
  
  // overloading dragover - remember to reattach on cloning
  newDiv.addEventListener('dragover', (e) => dragOver(e))
  newDiv.setAttribute('ondragleave', 'dragLeave(event)')
  
  document.getElementById('parent').appendChild(newDiv)
})

// Check Answer logic
function checkAnswer() {
  // make tabulations and render pass/fail colors to UI
  let data = []
  let correct = 0
  let incorrect = 0
  let submission = [...document.getElementById('parent').children]
  
  // answer evaluation logic
  submission.forEach((phrase, idx) => {
    if (idx === correctOrder[phrase.id]) {
      phrase.classList.add('border-success')
      correct++
    } else {
      phrase.classList.add('border-danger')
      incorrect++
    }
    // freeze drag n drop functionality - pencils down!
    phrase.removeAttribute('draggable')
    data.push({ [phrase.id]: phrase.innerText })
  })
  // render feedback message - with conditional styling for pass/fail
  let resultDisplay = document.getElementById('result-display')
  if (correct >= 5) {
    resultDisplay.classList.add('text-success')
    resultDisplay.innerText = `${correct}/${
      correct + incorrect
    } answers correct!`
  } else {
    resultDisplay.classList.add('text-danger')
    resultDisplay.innerText = `${correct}/${
      correct + incorrect
    } answers correct`
  }

  let resultReturnCode = document.getElementById('result-return-code')
  let newCode = document.createElement('pre')
  let post = JSON.stringify(data, null, ' ')
  newCode.innerText = post
  resultReturnCode.appendChild(newCode)
}

// DRAG AND DROP FUNCTIONALITY

function drag(e) {
  e.dataTransfer.setData('text', e.target.id)
  e.target.classList.add('border-primary')
}

function drop(e) {
  // event target refers to the dropzone node
  let dragindex = 0
  let dropindex = 0

  e.preventDefault()
  // temp variable for dropzone element
  let clone = e.target.cloneNode(true)
  // re-attach eventListener
  clone.addEventListener('dragover', (e) => dragOver(e))
  
  let data = e.dataTransfer.getData('text')
  let nodelist = document.getElementById('parent').children
  for (let i = 0; i < nodelist.length; i++) {
    if (nodelist[i].id == data) {
      dragindex = i
      // prevent duplication
      if (clone.id === nodelist[i].id) return
    }
  }
  // normalize style of dropzone
  setTimeout(() => {
    clone.classList.remove('border-warning')
  }, 300)

  // normalize style of droppable
  let dragging = document.getElementById(data)
  setTimeout(() => {
    dragging.classList.remove('border-primary')
  }, 300)

  document.getElementById('parent').replaceChild(dragging, e.target)

  document
    .getElementById('parent')
    .insertBefore(clone, nodelist[dragindex])
}

function allowDrop(e) {
  e.preventDefault()
}

// style valid dropzones on movement
function dragOver(e) {
  if (e.target.nodeType === 1)
    e.target.classList.add('border-warning')
}

function dragLeave(e) {
  if (e.target.nodeType === 1)
    e.target.classList.remove('border-warning')
}
