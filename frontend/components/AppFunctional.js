import React, {useState} from 'react'
import axios from 'axios'
// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at 4

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [gridController, setGridController] = useState({
    message: initialMessage,
    email: initialEmail,
    steps: initialSteps,
    index: initialIndex,
  })

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
      let x = 0
      let breaker = true
      let ind = gridController.index
      while (breaker) {
        if (ind - 3 >= -3) {
          x++
          ind = ind - 3
        } else {
          breaker = false
        }
      }
      let y = (gridController.index % 3) + 1
      return ({x: x, y: y})
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    let xy = getXY()
    return (`Coordiates (${xy.y}, ${xy.x})`)
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setGridController({
      message: initialMessage,
      email: initialEmail,
      steps: initialSteps,
      index: initialIndex,
    })
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    
   if (direction === 'up') {
      if (gridController.index -3 >= 0) {
        setGridController({...gridController, index: gridController.index -3, steps: gridController.steps+1, message: ``})
      } else {
        setGridController({...gridController, message: `You can't go up`})
      }
    } else if (direction === 'down') {
      if (gridController.index +3 <= 8) {
        setGridController({...gridController, index: gridController.index +3, steps: gridController.steps+1, message: ``})
      } else {
        setGridController({...gridController, message: `You can't go down`})
      }
    } else if (direction === 'left') {
      if ((gridController.index % 3) -1 >= 0) {
        setGridController({...gridController, index: gridController.index -1, steps: gridController.steps+1, message: ``})
      } else {
        setGridController({...gridController, message: `You can't go left`})
      }
    } else {
      if ((gridController.index % 3) +2 < 4) {
        setGridController({...gridController, index: gridController.index +1, steps: gridController.steps+1, message: ``})
      } else {
        setGridController({...gridController, message: `You can't go right`})
      }
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setGridController({...gridController, email: evt.target.value})
  }

  function onSubmit(evt) {
    const grid = getXY()
    evt.preventDefault()
    axios.post(`http://localhost:9000/api/result`, {x: grid.y, y: grid.x, steps: gridController.steps, email: gridController.email})
    .then(res => {
      setGridController({...gridController, message: res.data.message, email: ''})
    })
    .catch(err => setGridController({...gridController, message: err.response.data.message, email: ''}))
  }
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {gridController.steps} {gridController.steps == 1 ? 'time' : 'times'}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === gridController.index ? ' active' : ''}`}>
              {idx === gridController.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{gridController.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => getNextIndex('left')}>LEFT</button>
        <button id="up" onClick={() => getNextIndex('up')}>UP</button>
        <button id="right" onClick={() => getNextIndex('right')}>RIGHT</button>
        <button id="down" onClick={() => getNextIndex('down')}>DOWN</button>
        <button id="reset" onClick={() => {reset()}}>reset</button>
      </div>
      <form>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={gridController.email}></input>
        <input id="submit" type="submit" onClick={(evt) => onSubmit(evt)}></input>
      </form>
    </div>
  )
}
