/** @format */

import React from 'react'
// import BarChartBarChart from './components/01_CicleChart'
import LineChart from './components/02_LineChart_score'
import LineChart2 from './components/02_LineChart_overview'
import BarChart from './components/03_barchart'
import BarChartVertikal from './components/03_barchart_vertikal'

function App() {
  return (
    <div className="App">
      {/* <BarChart data={[1, 2, 3]} /> */}
      <LineChart data={[12, 56, 13, 46, 23, 23, 56, 79]} color={'#6471D0'} />
      <LineChart2 data={[12, 56, 13, 46, 23, 23, 56, 79]} color={'#4B57B1'} />
      <BarChart data={[12, 56, 13, 46, 23, 23, 56, 79]} />
      <BarChartVertikal
        data={[
          {
            name: 'beta',
            value: 15,
            color: '#cccccc',
          },
          {
            name: 'charlie',
            value: 20,
            color: '#c2b0c9',
          },
          {
            name: 'alpha',
            value: 10,
            color: '#f4efd3',
          },
          {
            name: 'delta',
            value: 25,
            color: '#9656a1',
          },
          {
            name: 'echo',
            value: 8,
            color: '#fa697c',
          },
          {
            name: 'foxtrot',
            value: 35,
            color: '#fcc169',
          },
        ]}
      />
    </div>
  )
}

export default App
