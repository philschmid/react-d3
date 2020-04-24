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
  color: string
}
/* Component */
function LineChart({data, color}: IProps) {
  const ref: any = useRef<SVGElement>(null)
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
    svgElement
      .select('.x-axis')
      .style('transform', `translateY(${height}px)`)
      .call(xAxis)

    const yAxis: any = d3.axisLeft(yScale)
    svgElement.select('.y-axis').call(yAxis)

    const svgLine = d3
      .line()
      .x((value: any, index: any) => xScale(index))
      // @ts-ignore
      .y(yScale)
      .curve(d3.curveCardinal)

    // @ts-ignore
    const areaGenerator = d3
      .area()
      .x((value, index) => xScale(index))
      // @ts-ignore
      .y0(height)
      // @ts-ignore
      .y1((value, index) => yScale(value))
      .curve(d3.curveCardinal)

    var defs = svgElement.append('defs')

    var gradient = defs
      .append('linearGradient')
      .attr('id', 'svgGradient')
      .attr('x1', '100%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '100%')

    gradient
      .append('stop')
      .attr('class', 'start')
      .attr('offset', '0%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0.8)
    gradient
      .append('stop')
      .attr('class', 'end')
      .attr('offset', '90%')
      .attr('stop-color', color)
      .attr('stop-opacity', 0)

    svgElement
      .selectAll('.line')
      .data([data])
      .join('path')
      .attr('class', 'line')
      .attr('d', svgLine)
      .attr('stroke-width', 2.5)
      .attr('stroke', color)
      .attr('fill', 'none')

    svgElement
      .append('path')
      .data([data])
      .attr('class', 'area')
      // @ts-ignore
      .attr('d', areaGenerator)
      .attr('fill', 'url(#svgGradient)')
  }, [color, data])

  return (
    <React.Fragment>
      <svg
        width={400}
        height={200}
        ref={ref}
        style={{overflow: 'overlay', margin: 25}}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </React.Fragment>
  )
}
export default LineChart
