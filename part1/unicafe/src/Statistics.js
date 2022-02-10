import React, { useState } from 'react'
const { useMemo } = React
const useCountClicks = allClicks =>
  useMemo(() => allClicks.reduce((acc, x) => ({
    ...acc,
    [x]: (acc[x] || 0) + 1
  }), { all: allClicks.length }), [allClicks])

const Statistics = ({ allClicks }) => {
  const { all, G, N, B } = useCountClicks(allClicks)
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
              <td>{G}</td>
            </tr>

            <tr>
              <td>neutral</td>
              <td>{N}</td>
            </tr>
          
            <tr>
              <td>bad</td> 
              <td>{B}</td>
            </tr>
          
            <tr><td>all</td>
            <td>{all}</td>
            </tr>
          
            <tr>
              <td>average</td>
              <td>{((G-B)/all).toFixed(1)}</td>
            </tr>
          
            <tr>
              <td>positive</td> 
              <td>{(100*(all - B)/(all)).toFixed(1)} %</td>
            </tr>
        </tbody>
     </table>
    </div>
  )
}
export default Statistics