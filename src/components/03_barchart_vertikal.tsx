/** @format */

import React, {useRef, useEffect} from 'react'
import * as d3 from 'd3'
import {select, axisBottom, scaleLinear, scaleBand, max} from 'd3'
import './style.css'
// @ts-ignore
// Array.prototype.max = function () {
//   return Math.max.apply(null, this)
// }

interface IProps {
  data: any[]
  textColor?: string
  color?: string
}
/* Component */
function BarChartVertikal({
  data,
  color = '#4B57B1',
  textColor = 'black',
}: IProps) {
  const ref: any = useRef<SVGElement>(null)

  useEffect(() => {
    const width = ref.current.clientWidth
    const height = ref.current.clientHeight

    const svg = select(ref.current)

    // @ts-ignore
    const yScale = scaleBand()
      .paddingInner(0.1)
      // @ts-ignore
      .domain(data.map((value: any, index: number) => value.name)) // [0,1,2,3,4,5]
      .range([0, height]) // [0, 200]
      .padding(0.7)

    const xScale = scaleLinear()
      // @ts-ignore
      .domain([0, 100]) // [0, 65 (example)]
      .range([0, width]) // [0, 400 (example)]

    const xAxis: any = axisBottom(xScale).ticks(data.length)
    svg
      .select('.x-axis')
      .style('transform', `translateY(${height}px)`)
      .call(xAxis)
    svg.selectAll('.tick line').attr('stroke', 'transparent')
    svg.selectAll('.x-axis path').attr('stroke', 'transparent')
    svg.selectAll('.x-axis text').attr('color', textColor)
    // y-axis
    const yAxis: any = d3.axisLeft(yScale)
    // // @ts
    // .ticks((value, index) => {
    //   console.log(value)
    // })
    // .tickFormat((index: any, d: any) => {
    //   console.log(d)
    //   return index
    // })
    svg.select('.y-axis').call(yAxis)
    svg.selectAll('.tick line').attr('stroke', 'transparent')
    svg.selectAll('.y-axis path').attr('stroke', 'transparent')
    svg.selectAll('.y-axis text').attr('color', textColor)

    // tooltip
    var div = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // draw the bars
    svg
      .selectAll('.bar')
      // @ts-ignore
      .data(data, (entry, index) => entry.name)
      // @ts-ignore
      .join((enter: any) => {
        console.log(enter)
        // @ts-ignore
        return enter
          .append('rect')
          .attr('y', (entry: any, index: any) => yScale(entry.name))
          .on('click', (entry: any, index: any) => {
            div.transition().duration(200).style('opacity', 0.9)
            div
              .html(`${entry.name} hat den wert ${entry.value}`)
              .style('position', 'absolute')
              .style('left', d3.event.pageX + 28 + 'px')
              .style('top', d3.event.pageY - 28 + 'px')
          })
          .on('focusout', (entry: any, index: any) =>
            div.transition().duration(500).style('opacity', 0),
          )
      })
      // @ts-ignore
      .attr('fill', entry => (entry.color ? entry.color : color))
      .attr('class', 'bar')
      .style('outline', 'none')
      .attr('x', 0)
      .attr('ry', 5)
      .attr('height', yScale.bandwidth())
      .transition()
      // @ts-ignore
      .attr('width', entry => xScale(entry.value))
  }, [color, data, textColor])

  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#F1F1F1',
          borderRadius: 25,
        }}>
        <svg
          width={'100%'}
          height={200}
          ref={ref}
          style={{
            overflow: 'overlay',
            margin: '35px 55px',
          }}>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </React.Fragment>
  )
}
export default BarChartVertikal
