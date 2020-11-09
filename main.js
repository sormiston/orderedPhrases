// INITIAL DATA
const questions = {
  q1: 'Hay un muchacho y una muchacha en la clase de matemáticas.',
  q2: 'El maestro dice que los estudiantes necesitan un lápiz.',
  q3: 'Camila no tiene papel y Mateo tiene papel.',
  q4: 'Camila no tiene un libro de matemáticas y necesita un libro.',
  q5:
    'Mateo no tiene un lápiz, no tiene una hoja de papel, y no tiene un libro.',
  q6: 'El maestro está furioso.',
}

const correctOrder = {}

// DRAG AND DROP FUNCTIONALITY

let dragindex = 0
let dropindex = 0
let clone

function drag(e) {
  e.dataTransfer.setData('text', e.target.id)
}

function drop(e) {
  e.preventDefault()
  clone = e.target.cloneNode(true)

  let data = e.dataTransfer.getData('text')
  let nodelist = document.getElementById('parent').children
  console.log(data)
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
