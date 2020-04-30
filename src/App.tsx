/** @format */

import React from 'react'
// import BarChartBarChart from './components/01_CicleChart'
import LineChart from './components/02_LineChart_score'
import LineChart2 from './components/02_LineChart_overview'
import BarChart from './components/03_barchart'
import BarChartVertikal from './components/03_barchart_vertikal'
import ProgressBar from './components/04_progressbar'
import ScatterPlot from './components/05_scatterplot'
import DensityChart from './components/06_densityChart'
import {data} from './data'

let parsedData = data
  .sort((a: any, b: any) => {
    //@ts-ignore
    return new Date(a.publishedAt) - new Date(b.publishedAt)
  })
  .map((element: any) => {
    return {date: element.publishedAt, value: (element.sentiment + 1) * 50}
  })

function App() {
  return (
    <div className="App">
      {/* <BarChart data={[1, 2, 3]} /> */}
      <ScatterPlot data={parsedData} color={'#6471D0'} />
      <LineChart data={parsedData} color={'#6471D0'} />

      <LineChart2 data={[12, 56, 13, 46, 23, 23, 56, 79]} color={'#4B57B1'} />
      <BarChartVertikal
        data={[
          {
            name: 'beta',
            value: 15,
          },
          {
            name: 'charlie',
            value: 20,
          },
          {
            name: 'alpha',
            value: 10,
          },
          {
            name: 'delta',
            value: 25,
          },
          {
            name: 'echo',
            value: 8,
          },
          {
            name: 'foxtrot',
            value: 35,
          },
        ]}
      />
      <br />
      <ProgressBar data={50}></ProgressBar>
      <DensityChart />

      <BarChart data={[12, 56, 13, 46, 23, 23, 56, 79]} />
    </div>
  )
}

export default App
