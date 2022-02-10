import React, { useState } from 'react'
const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
const Vote = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)
const Display = (props) =>{
  //console.log('props',props)
  return(
    <div>
      has {props.vote} votes
    </div>
  )
}

const App = () => {

  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]


  const [selected, setSelected] = useState(0)
  const setToSelected = newValue => {
    setSelected(newValue)
  }
  const [copy, setCopy] = useState(new Uint8Array(7))

  const setToCopy = newVote =>{

    const newCopy = [...copy]
    newCopy[selected] += 1
    setCopy(newCopy)
  }

  const big = copy.indexOf(Math.max(...copy))
  
  return (
    
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <Display vote={copy[selected]}/>
      <Button handleClick={() =>setToSelected( Math.floor(Math.random() * 7))} text="next sentence" />
      <Vote handleClick={() =>setToCopy(copy)} text="vote"/>
      <h2>Anecdote with the most votes</h2>
      {anecdotes[big]}
      
    </div>
  )
}

export default App