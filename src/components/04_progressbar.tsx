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
  data: number
  color?: string
  height?: 'small' | 'medium' | 'large'
}
/* Component */
function ProgressBar({data, color = '#4B57B1', height = 'medium'}: IProps) {
  const ref: any = useRef<SVGElement>(null)
  const size: any = {small: 8, medium: 12, height: 20}

  useEffect(() => {
    const width = ref.current.clientWidth
    const svg = select(ref.current)

    const xScale = scaleLinear()
      // @ts-ignore
      .domain([0, 100])
      .range([0, width])

    svg
      .selectAll(null)
      .data([{progress: data, color}])
      .enter()
      .append('rect')
      .attr('height', size[height])
      .attr('width', entry => xScale(xScale.domain()[1]))
      .attr('rx', 5)
      .attr('ry', 5)
      .style('fill', '#ccc')

    svg
      .selectAll(null)
      .data([{progress: data, color}])
      .enter()
      .append('rect')
      .attr('height', size[height])
      // @ts-ignore
      .attr('width', entry => xScale(entry.progress))
      .attr('rx', 5)
      // .attr('ry', 5)
      .style('fill', entry => entry.color)
      .transition()
      .duration(200)
      .style('opacity', 0.9)
  }, [color, data, height, size])

  return (
    <React.Fragment>
      <svg width={'100%'} ref={ref}></svg>
    </React.Fragment>
  )
}
export default ProgressBar
