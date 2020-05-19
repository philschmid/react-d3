/** @format */

import React, {useRef, useEffect, useState} from 'react'
import * as d3 from 'd3'
import {select, axisBottom, scaleLinear, scaleTime} from 'd3'

// @ts-ignore
// Array.prototype.max = function () {
//   return Math.max.apply(null, this)
// }

const parseData = (array: any[]) => {
  return array.map((e: any) => {
    return {date: d3.timeParse('%Y-%m-%dT%H:%M:%S.%LZ')(e.date), value: e.value}
  })
}

interface IProps {
  data: {
    date: string
    value: number
  }[]
  color: string
}

/* Component */
function ScatterPlot({data, color}: IProps) {
  const ref: any = useRef<SVGElement>(null)
  const [parsedData, setParsedData]: any = useState(parseData(data))
  useEffect(() => {
    const width = ref.current.clientWidth
    const height = ref.current.clientHeight
    const svg = select(ref.current)

    var div = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    const xScale: any = scaleTime()
      .domain(
        //@ts-ignore
        d3.extent(parsedData.map(entry => entry.date)),
      )
      .range([0, width])

    const yScale = scaleLinear()
      // scale data to max value
      // .domain([0, Math.max.apply(null, data)])
      .domain([0, 100])
      .range([height, 0])

    const xAxis: any = svg
      .select('.x-axis')
      .style('transform', `translateY(${height}px)`)
      //@ts-ignore
      .call(d3.axisBottom(xScale))

    const yAxis: any = svg
      .select('.y-axis')
      // @ts-ignore
      .call(d3.axisLeft(yScale))

    const clip = svg
      .append('defs')
      .append('svg:clipPath')
      .attr('id', 'clip')
      .append('svg:rect')
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0)

    const brush = d3
      .brushX() // Add the brushy feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on('end', updateChart)

    // @ts-ignore
    const scatter = svg.append('g').attr('clip-path', 'url(#clip)')

    // Add circles
    svg.append('g')

    scatter
      .selectAll('dot')
      .data(parsedData)
      .enter()
      .append('circle')
      .attr('cx', (entry: any) => xScale(entry.date))
      .attr('cy', (entry: any) => yScale(entry.value))
      .attr('r', 8)
      .style('fill', 'blue')
      .style('opacity', 0.5)

    // Add the brushing
    scatter.append('g').attr('class', 'brush').call(brush)

    let idleTimeout: any
    function idled() {
      idleTimeout = null
    }

    // A function that update the chart for given boundaries
    function updateChart() {
      // What are the selected boundaries?
      const extent = d3.event.selection

      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if (!extent) {
        if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)) // This allows to wait a little bit
        xScale.domain([4, 8])
      } else {
        xScale.domain([xScale.invert(extent[0]), xScale.invert(extent[1])])
        // @ts-ignore
        scatter.select('.brush').call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and area position
      xAxis.call(d3.axisBottom(xScale))
      scatter
        .selectAll('circle')
        .transition()
        .duration(1000)
        .attr('cx', (entry: any) => xScale(entry.date))
        .attr('cy', (entry: any) => yScale(entry.value))
        .attr('r', 8)
        .style('fill', 'blue')
        .style('opacity', 0.5)
    }
    // If user double click, reinitialize the chart
    svg.on('dblclick', function () {
      xScale.domain(
        //@ts-ignore
        d3.extent(parsedData.map(entry => entry.date)),
      )
      xAxis.call(d3.axisBottom(xScale))
      scatter
        .selectAll('circle')
        .transition()
        .duration(1)
        .attr('cx', (entry: any) => xScale(entry.date))
        .attr('cy', (entry: any) => yScale(entry.value))
        .attr('r', 8)
        .style('fill', 'blue')
        .style('opacity', 0.5)
    })
  }, [color, data, parsedData])

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
export default ScatterPlot
