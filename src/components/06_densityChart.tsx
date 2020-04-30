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
  // data: any[]
  textColor?: string
  color?: string
}
/* Component */
function DensityChart({color = '#4B57B1', textColor = 'black'}: IProps) {
  const ref: any = useRef<SVGElement>(null)

  const data = [
    {type: 'v1', value: 5},
    {type: 'v1', value: 15},
    {type: 'v1', value: 25},
    {type: 'v1', value: 35},
    {type: 'v1', value: 1},
    {type: 'v1', value: 2},
    {type: 'v1', value: 6},
    {type: 'v1', value: 8},
    {type: 'v1', value: 12},
    {type: 'v2', value: 10},
    {type: 'v2', value: 25},
    {type: 'v2', value: 45},
    {type: 'v2', value: 55},
    {type: 'v2', value: 75},
    {type: 'v2', value: 95},
    {type: 'v2', value: 85},
    {type: 'v2', value: 65},
    {type: 'v2', value: 50},
  ]

  useEffect(() => {
    const width = ref.current.clientWidth
    const height = ref.current.clientHeight

    const svg = select(ref.current)

    const yScale = scaleLinear()
      // @ts-ignore
      .domain([0, 0.12]) // [0, 65 (example)]
      .range([height, 0]) // [0, 400 (example)]

    const xScale = scaleLinear()
      // @ts-ignore
      .domain([0, 6]) // [0, 65 (example)]
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

    // Function to compute density
    function kernelDensityEstimator(kernel: any, X: any) {
      console.log(X)
      return function (V: any) {
        return X.map(function (x: any) {
          return [
            x,
            d3.mean(V, function (v: any) {
              return kernel(x - v)
            }),
          ]
        })
      }
    }
    function kernelEpanechnikov(k: any) {
      return function (v: any) {
        return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0
      }
    }

    const kde = kernelDensityEstimator(kernelEpanechnikov(6), xScale.ticks(200))
    const density1 = kde(
      data
        .filter(function (d) {
          return d.type === 'v1'
        })
        .map(function (d) {
          return d.value
        }),
    )
    console.log(density1)
    const density2 = kde(
      data
        .filter(function (d) {
          return d.type === 'v2'
        })
        .map(function (d) {
          return d.value
        }),
    )

    // tooltip
    var div = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // draw the bars

    svg
      .append('path')
      .attr('class', 'mypath')
      .datum(density1)
      .attr('fill', '#69b3a2')
      .attr('opacity', '.6')
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr(
        'd',
        // @ts-ignore
        d3
          .line()
          .curve(d3.curveBasis)
          .x(d => {
            return xScale(d[0])
          })
          .y(d => {
            return yScale(d[1])
          }),
      )
    // Plot the area
    svg
      .append('path')
      .attr('class', 'mypath')
      .datum(density2)
      .attr('fill', '#404080')
      .attr('opacity', '.6')
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .attr('stroke-linejoin', 'round')
      .attr(
        'd',
        d3
          .line()
          .curve(d3.curveBasis)
          .x(d => {
            return xScale(d[0])
          })
          .y(d => {
            return yScale(d[1])
          }),
      )

    // svg
    //   .selectAll('.bar')
    //   // @ts-ignore
    //   .data(data, (entry, index) => entry.name)
    //   // @ts-ignore
    //   .join((enter: any) => {
    //     console.log(enter)
    //     // @ts-ignore
    //     return enter
    //       .append('rect')
    //       .attr('y', (entry: any, index: any) => yScale(entry.name))
    //       .on('click', (entry: any, index: any) => {
    //         div.transition().duration(200).style('opacity', 0.9)
    //         div
    //           .html(`${entry.name} hat den wert ${entry.value}`)
    //           .style('position', 'absolute')
    //           .style('left', d3.event.pageX + 28 + 'px')
    //           .style('top', d3.event.pageY - 28 + 'px')
    //       })
    //       .on('focusout', (entry: any, index: any) =>
    //         div.transition().duration(500).style('opacity', 0),
    //       )
    //   })
    //   // @ts-ignore
    //   .attr('fill', entry => (entry.color ? entry.color : color))
    //   .attr('class', 'bar')
    //   .style('outline', 'none')
    //   .attr('x', 0)
    //   .attr('ry', 5)
    //   // @ts-ignore
    //   .attr('height', yScale.bandwidth())
    //   .transition()
    //   // @ts-ignore
    //   .attr('width', entry => xScale(entry.value))
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
export default DensityChart
