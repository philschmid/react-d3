/** @format */

import React, {useRef, useEffect} from 'react'
import * as d3 from 'd3'
import {select, axisBottom, scaleLinear, scaleBand, max} from 'd3'

// @ts-ignore
// Array.prototype.max = function () {
//   return Math.max.apply(null, this)
// }

interface IProps {
  data: any[]
}
/* Component */
function BarChartVertikal({data}: IProps) {
  const ref: any = useRef<SVGElement>(null)

  useEffect(() => {
    const width = ref.current.clientWidth
    const height = ref.current.clientHeight

    const svg = select(ref.current)

    // @ts-ignore
    const yScale = scaleBand()
      .paddingInner(0.1)
      // @ts-ignore
      .domain(data.map((value, index) => index)) // [0,1,2,3,4,5]
      .range([0, height]) // [0, 200]
      .padding(0.7)

    const xScale = scaleLinear()
      // @ts-ignore
      .domain([0, 100]) // [0, 65 (example)]
      .range([0, width]) // [0, 400 (example)]

    // draw the bars
    svg
      .selectAll('.bar')
      // @ts-ignore
      .data(data, (entry, index) => entry.name)
      .join(enter =>
        enter.append('rect').attr('y', (entry, index) => yScale(index)),
      )
      // @ts-ignore
      .attr('fill', entry => entry.color)
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('rx', 5)
      .attr('height', yScale.bandwidth())
      .transition()
      // @ts-ignore
      .attr('width', entry => xScale(entry.value))
      .attr('y', (entry, index) => yScale(index))

    // draw the labels
    svg
      .selectAll('.label')
      // @ts-ignore
      .data(data, (entry, index) => entry.name)
      .join(enter =>
        enter
          .append('text')
          .attr(
            'y',
            (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5,
          ),
      )
      // @ts-ignore
      .text(entry => `${entry.name} (${entry.value} meters)`)
      .attr('class', 'label')
      .style('transform', entry => `translateX(${entry.value * 4}px)`)
      .attr('x', 10)
      .transition()
      .attr('y', (entry, index) => yScale(index) + yScale.bandwidth() / 2 + 5)
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
export default BarChartVertikal
