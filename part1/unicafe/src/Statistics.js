import React from 'react'


const Statistics = ({ allClicks, good, bad, neutral}) => {
  const all = allClicks.length

  if (all === 0) {
    return (
      <div>
        <h2>No feedback given</h2>
      </div>
    )
  }
  return (
    <div>
      <table style={{padding: '5px'}}>
        <tbody style={{width: '30%', padding: '5px'}}>
            <tr>
              <td>good</td>
              <td>{good}</td>
            </tr>

            <tr>
              <td>neutral</td>
              <td>{neutral}</td>
            </tr>
          
            <tr>
              <td>bad</td> 
              <td>{bad}</td>
            </tr>
          
            <tr><td>all</td>
            <td>{all}</td>
            </tr>
          
            <tr>
              <td>average</td>
              <td>{((good-bad)/all).toFixed(1)}</td>
            </tr>
          
            <tr>
              <td>positive</td> 
              <td>{(100*(all - bad)/(all)).toFixed(1)} %</td>
            </tr>
        </tbody>
     </table>
    </div>
  )
}
export default Statistics
