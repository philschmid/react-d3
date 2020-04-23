/** @format */

import React, {useRef, useEffect} from 'react'
import * as d3 from 'd3'
import {select, axisBottom, scaleLinear, scaleBand} from 'd3'

// @ts-ignore
// Array.prototype.max = function () {
//   return Math.max.apply(null, this)
// }

interface IProps {
  data: number[]
}
/* Component */
function BarChart({data}: IProps) {
  const ref: any = useRef<SVGElement>(null)

  useEffect(() => {
    const width = ref.current.clientWidth
    const height = ref.current.clientHeight

    const svgElement = select(ref.current)
    // @ts-ignore
    const xScale: any = scaleBand()
      // @ts-ignore
      // .domain(data.map((value: number, index: number) => index))
      .domain(data.map((value: number, index: number) => index))
      .range([0, width])
      .padding(0.8)

    const yScale = scaleLinear().domain([0, 100]).range([height, 0])

    const xAxis: any = axisBottom(xScale).ticks(data.length)
    svgElement
      .select('.x-axis')
      .style('transform', `translateY(${height}px)`)
      .call(xAxis)

    const colorScale: any = scaleLinear()
      .domain([0, 50, 75])
      // @ts-ignore
      .range(['red', 'orange', 'green'])
      .clamp(true)

    const yAxis: any = d3.axisLeft(yScale)
    svgElement.select('.y-axis').call(yAxis)

    svgElement
      .selectAll('.bar')
      .data(data)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (value, index) => xScale(index))
      .attr('y', yScale)
      .attr('rx', 5)
      .attr('fill', colorScale)
      .attr('width', xScale.bandwidth())
      .attr('height', (value: number) => height - yScale(value))
  }, [data])

  return (
    <React.Fragment>
      <svg
        width={400}
        height={200}
        ref={ref}
        style={{background: '#ddd', overflow: 'overlay', margin: 25}}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </React.Fragment>
  )
}
export default BarChart
