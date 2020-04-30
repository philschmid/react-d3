/** @format */

import React, {useRef, useEffect, useState} from 'react'
import * as d3 from 'd3'
import {select, axisBottom, scaleLinear, scaleTime} from 'd3'

// @ts-ignore
// Array.prototype.max = function () {
//   return Math.max.apply(null, this)
// }
const groupByDay = (array: any[]) => {
  const newDataArray = array.reduce((objectsByKeyValue, obj) => {
    const value = new Date(obj['date']).toLocaleDateString('en', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
    return objectsByKeyValue
  }, {})
  return Object.entries(newDataArray).map((day: any) => {
    return {
      date: new Date(day[0]),
      value: Math.round(
        day[1].reduce((total: any, next: any) => total + next.value, 0) /
          day[1].length,
      ),
    }
  })
}
const groupByMonth = (array: any[]) => {
  const newDataArray = array.reduce((objectsByKeyValue, obj) => {
    const value = new Date(obj['date']).toLocaleDateString('en', {
      year: 'numeric',
      month: '2-digit',
    })
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
    return objectsByKeyValue
  }, {})
  return Object.entries(newDataArray).map((day: any) => {
    return {
      date: new Date(
        new Date(`${day[0].split('/')[1]}/${day[0].split('/')[0]}`),
      ),
      value: Math.round(
        day[1].reduce((total: any, next: any) => total + next.value, 0) /
          day[1].length,
      ),
    }
  })
}
const groupByYear = (array: any[]) => {
  const newDataArray = array.reduce((objectsByKeyValue, obj) => {
    const value = new Date(obj['date']).toLocaleDateString('en', {
      year: 'numeric',
    })
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj)
    return objectsByKeyValue
  }, {})
  return Object.entries(newDataArray).map((day: any) => {
    return {
      date: new Date(new Date(day[0])),
      value: Math.round(
        day[1].reduce((total: any, next: any) => total + next.value, 0) /
          day[1].length,
      ),
    }
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
function LineChart({data, color}: IProps) {
  const ref: any = useRef<SVGElement>(null)
  const [parsedData, setParsedData]: any = useState(groupByDay(data))
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

    const svgLine = d3
      .line()
      .x((entry: any) => xScale(entry.date))
      // @ts-ignore
      .y((entry: any) => yScale(entry.value))
      .curve(d3.curveCardinal)

    // @ts-ignore
    const areaGenerator = d3
      .area()
      .x((entry: any) => xScale(entry.date))
      // @ts-ignore
      .y0(height)
      // @ts-ignore
      .y1((entry: any) => yScale(entry.value))
      .curve(d3.curveCardinal)

    var defs = svg.append('defs')

    var gradient = defs
      .append('linearGradient')
      .attr('id', 'svgGradient')
      .attr('x1', '100%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '100%')

    // gradient
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
      .brushX() // Add the brush feature using the d3.brush function
      .extent([
        [0, 0],
        [width, height],
      ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on('end', updateChart)

    const area = svg.append('g').attr('clip-path', 'url(#clip)')

    area
      .append('path')
      .data([parsedData])
      .attr('class', 'area') // I add the class myArea to be able to modify it later on.
      // @ts-ignore
      .attr('d', areaGenerator)
      .attr('fill', 'url(#svgGradient)')

    area.append('g').attr('class', 'brush').call(brush)
    const dots = svg
      .selectAll('.dot')
      .data(parsedData)
      .enter()
      .append('circle') // Uses the enter().append() method
      .attr('class', 'dot') // Assign a class for styling
      .attr('cx', (entry: any) => xScale(entry.date))
      .attr('cy', (entry: any) => yScale(entry.value))
      .attr('r', 3)
      .attr('stroke', color)
      .attr('stroke-width', 2)
      .attr('fill', 'white')
      .on('click', (entry: any, index: any) => {
        div.transition().duration(200).style('opacity', 0.9)
        div
          .html(`${entry.date} hat den wert ${entry.value}`)
          .style('position', 'absolute')
          .style('left', d3.event.pageX + 28 + 'px')
          .style('top', d3.event.pageY - 28 + 'px')
      })
      .on('focusout', (entry: any, index: any) =>
        div.transition().duration(500).style('opacity', 0),
      )
      .attr('clip-path', 'url(#clip)')

    svg
      .selectAll('.line')
      .data([parsedData])
      .join('path')
      .attr('class', 'line')
      // @ts-ignore
      .attr('d', svgLine)
      .attr('stroke-width', 2)
      .attr('stroke', color)
      .attr('fill', 'none')
      .attr('clip-path', 'url(#clip)')

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
        area.select('.brush').call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }

      // Update axis and area position
      xAxis.call(d3.axisBottom(xScale))
      console.log(xScale.domain())
      svg
        .selectAll('.line')
        .transition()
        .duration(1000)
        // @ts-ignore
        .attr('d', svgLine)

      area
        .select('.area')
        .transition()
        .duration(1000)
        // @ts-ignore
        .attr('d', areaGenerator)

      svg
        .selectAll('.dot')
        .transition()
        .duration(1000)
        .attr('cx', (entry: any) => xScale(entry.date))
        .attr('cy', (entry: any) => yScale(entry.value))
    }
    // If user double click, reinitialize the chart
    svg.on('dblclick', function () {
      xScale.domain(
        //@ts-ignore
        d3.extent(parsedData.map(entry => entry.date)),
      )
      xAxis.call(d3.axisBottom(xScale))
      area
        .select('.area')
        .transition()
        .duration(1)
        // @ts-ignore
        .attr('d', areaGenerator)

      svg
        .selectAll('.line')
        .transition()
        .duration(1)
        // @ts-ignore
        .attr('d', svgLine)
      svg
        .selectAll('.dot')
        .transition()
        .duration(1)
        // @ts-ignore
        .attr('cx', (entry: any) => xScale(entry.date))
        .attr('cy', (entry: any) => yScale(entry.value))
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
export default LineChart
