import React, { useState } from 'react'
import Statistics from './Statistics'

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0) 
  const [allClicks, setAll] = useState([])
  const setToGood = newValue => {
    setGood(good+1)
    setAll(allClicks.concat('G'))
  }
  const setToNeutral = newValue => {
    setNeutral(neutral+1)
    setAll(allClicks.concat('N'))
  }
  const setToBad = newValue => {
    setBad(bad+1)
    setAll(allClicks.concat('B'))
  }
  return (
    <div>
      <h2>give feedback</h2>
      <Button handleClick={() =>setToGood(good + 1)}text="good" />
      <Button handleClick={() =>setToNeutral(neutral + 1)}text="neutral" />
      <Button handleClick={() =>setToBad(bad + 1)}text="bad"/>
      <h2>staticstics</h2>
      <Statistics allClicks={allClicks} setAll = {setAll} good = {good} neutral={neutral} bad={bad}/>
    </div>
  )
}
export default App
