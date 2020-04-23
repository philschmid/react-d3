/** @format */

import React, {useRef, useEffect} from 'react'
import * as d3 from 'd3'
import {select, axisBottom, scaleLinear} from 'd3'

// @ts-ignore
// Array.prototype.max = function () {
//   return Math.max.apply(null, this)
// }

interface IProps {
  data: number[]
}
/* Component */
function LineChart(props: IProps) {
  const ref: any = useRef<SVGElement>(null)
  const {data} = props
  useEffect(() => {
    const width = ref.current.clientWidth
    const height = ref.current.clientHeight

    const svgElement = select(ref.current)
    const xScale: any = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width])

    const yScale = scaleLinear()
      // scale data to max value
      // .domain([0, Math.max.apply(null, data)])
      .domain([0, 100])
      .range([height, 0])

    const xAxis: any = d3
      .axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((index: any) => index + 1)
    svgElement.select('.x-axis').style('transform', `translateY(${height}px)`).call(xAxis)

    const yAxis: any = d3.axisLeft(yScale)
    svgElement.select('.y-axis').call(yAxis)

    const svgLine = d3
      .line()
      .x((value: any, index: any) => xScale(index))
      // @ts-ignore
      .y(yScale)
      .curve(d3.curveCardinal)

    svgElement
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('class', 'line')
      .attr('d', svgLine)
      .attr('fill', 'none')
      .attr('stroke-width', 4)
      .attr('stroke', 'blue')
  }, [data, props.data.length])

  return (
    <React.Fragment>
      <svg width={400} height={200} ref={ref} style={{background: '#787878', overflow: 'overlay', margin: 25}}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </React.Fragment>
  )
}
export default LineChart
