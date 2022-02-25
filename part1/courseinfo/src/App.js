const App = () => {
  
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Header=(props)=> {
    return (
      <h1>{props.course.name}</h1>
    )
  }
  const Content=(props)=> {
    return(
      <div>
        <Part content={props.parts[0]}/>
        <Part content={props.parts[1]}/>
        <Part content={props.parts[2]}/>
      </div>
    )
  }

  const Part=(props)=> {
    
    return(
      <div>
        {props.content.name} {props.content.exercises}
      </div>
    )
  }
  const Total=(props)=> {
    return (
      <div>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises} </div>
    )
  }
  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App