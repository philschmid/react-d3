/** @format */

import React, {useRef, useEffect} from 'react'
import * as d3 from 'd3'
import {select, axisBottom, scaleLinear} from 'd3'

interface IProps {
  data: number[]
}
/* Component */
function LineChart({data}: IProps) {
  const ref: any = useRef<SVGElement>(null)

  useEffect(() => {
    const svgElement = select(ref.current)
    console.log()
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, ref.current.clientWidth])

    const yScale = scaleLinear()
      // scale data to max value
      // .domain([0, Math.max.apply(null, data)])
      .domain([0, 100])
      .range([ref.current.clientHeight, 0])

    // const xAxis = d3.axisBottom()

    const svgLine = d3
      .line()
      .x((value: any, index: any) => xScale(index))
      // @ts-ignore
      .y(yScale)

    svgElement
      .selectAll('path')
      .data([data])
      .join('path')
      .attr('d', svgLine)
      .attr('fill', 'none')
      .attr('stroke-width', 4)
      .attr('stroke', 'blue')
  }, [data, data.length])

  return (
    <>
      <svg width={400} height={200} ref={ref} style={{background: '#ccc', borderRadius: 25}} />
    </>
  )
}
export default LineChart
