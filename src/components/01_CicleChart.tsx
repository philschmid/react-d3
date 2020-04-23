/** @format */

import React, {useRef, useEffect, useState} from 'react'
import * as d3 from 'd3'

interface IProps {
  data?: number[]
}
/* Component */
function CircleChart(props: IProps) {
  const ref = useRef(null)
  const [data, setData] = useState([12, 56, 13, 46, 23])
  /* The useEffect Hook is for running side effects outside of React,
       for instance inserting elements into the DOM using D3 */
  useEffect(() => {
    const svgElement = d3.select(ref.current)
    svgElement
      .selectAll('circle')
      .data(data)
      // .join(
      //   (enter: any) => enter.append('circle'),
      //   (update: any) => update.attr('class', 'updated'),
      // )
      .join('circle')
      .attr('r', (value: number) => value)
      .attr('cx', (value: number) => value * 2)
      .attr('cy', (value: number) => value * 2)
      .attr('stroke', 'red')
  }, [data])

  return (
    <>
      <svg width={400} height={200} ref={ref} />
      <button
        onClick={() => {
          setData(data.map(value => value + 5))
        }}>
        update
      </button>
      <button
        onClick={() => {
          setData(data.filter(value => value > 25))
        }}>
        remove
      </button>
    </>
  )
}
export default CircleChart
