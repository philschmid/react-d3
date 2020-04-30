/** @format */

import React, {useRef, useEffect} from 'react'
import * as d3 from 'd3'
import {select, axisBottom, scaleLinear} from 'd3'

interface IProps {
  data: number[]
  color: string
}
/* Component */
function LineChart({data, color}: IProps) {
  const ref: any = useRef<SVGElement>(null)

  useEffect(() => {
    const svgElement = select(ref.current)
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
      .curve(d3.curveCardinal)

    svgElement
      .selectAll('path')
      .data([data])
      .join('path')
      .attr('d', svgLine)
      .attr('fill', 'none')
      .attr('stroke-width', 5)
      .attr('stroke', 'white')
  }, [color, data, data.length])

  return (
    <>
      <div
        style={{
          width: 575,
          borderRadius: 15,
          background: '#6471D0',
          display: 'flex',
          flexDirection: 'column',
          padding: '0px 25px 50px 25px',
        }}>
        <div>
          <h1
            style={{
              color: 'white',
              fontFamily: 'arial',
              padding: '0px 20px',
            }}>
            xx
          </h1>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'space-evenly',
            justifyContent: 'space-between',
          }}>
          <svg
            width={350}
            height={100}
            ref={ref}
            style={{
              background: color,
              borderRadius: 15,
            }}
          />
          <div
            style={{
              background: color,
              borderRadius: 15,
              height: 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <h1
              style={{
                color: 'white',
                fontFamily: 'arial',
                padding: '0px 30px',
              }}>
              55 / 100
            </h1>
          </div>
        </div>
      </div>
    </>
  )
}
export default LineChart
