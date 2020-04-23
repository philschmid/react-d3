/** @format */

import React from 'react'
// import BarChartBarChart from './components/01_CicleChart'
import LineChart from './components/02_LineChart_score'
import LineChart2 from './components/02_LineChart_overview'
import BarChart from './components/03_barchart'

function App() {
  return (
    <div className="App">
      {/* <BarChart data={[1, 2, 3]} /> */}
      <LineChart data={[12, 56, 13, 46, 23, 23, 56, 79]} />
      <LineChart2 data={[12, 56, 13, 46, 23, 23, 56, 79]} />
      <BarChart data={[12, 56, 13, 46, 23, 23, 56, 79]} />
    </div>
  )
}

export default App
