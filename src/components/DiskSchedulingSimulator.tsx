import React, { useMemo, useState } from 'react'

type DiskAlgorithm = 'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN' | 'LOOK'

type Direction = 'right' | 'left'

const parseRequestString = (value: string) => {
  return value
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map((value) => Number(value.trim()))
    .filter((value) => !Number.isNaN(value))
}

const sortAscending = (values: number[]) => [...values].sort((a, b) => a - b)
const sortDescending = (values: number[]) => [...values].sort((a, b) => b - a)

const clampTrack = (value: number, maxTrack: number) => Math.max(0, Math.min(value, maxTrack))

const simulateFCFS = (start: number, requests: number[]) => [start, ...requests]

const simulateSSTF = (start: number, requests: number[]) => {
  const remaining = [...requests]
  const path = [start]
  let current = start

  while (remaining.length > 0) {
    let nearestIndex = 0
    let nearestDistance = Math.abs(remaining[0] - current)

    for (let i = 1; i < remaining.length; i += 1) {
      const distance = Math.abs(remaining[i] - current)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = i
      }
    }

    current = remaining.splice(nearestIndex, 1)[0]
    path.push(current)
  }

  return path
}

const simulateSCAN = (start: number, requests: number[], direction: Direction, maxTrack: number) => {
  const left = requests.filter((track) => track < start)
  const right = requests.filter((track) => track >= start)
  const sortedLeft = sortDescending(left)
  const sortedRight = sortAscending(right)

  if (direction === 'right') {
    return [start, ...sortedRight, maxTrack, ...sortedLeft]
  }

  return [start, ...sortedLeft, 0, ...sortedRight]
}

const simulateCSCAN = (start: number, requests: number[], direction: Direction, maxTrack: number) => {
  const left = requests.filter((track) => track < start)
  const right = requests.filter((track) => track >= start)
  const sortedLeft = sortAscending(left)
  const sortedRight = sortAscending(right)

  if (direction === 'right') {
    return [start, ...sortedRight, maxTrack, 0, ...sortedLeft]
  }

  return [start, ...sortedLeft, 0, maxTrack, ...sortedRight]
}

const simulateLOOK = (start: number, requests: number[], direction: Direction) => {
  const left = requests.filter((track) => track < start)
  const right = requests.filter((track) => track >= start)
  const sortedLeft = sortDescending(left)
  const sortedRight = sortAscending(right)

  if (direction === 'right') {
    return [start, ...sortedRight, ...sortedLeft]
  }

  return [start, ...sortedLeft, ...sortedRight]
}

const moveDistance = (from: number, to: number) => Math.abs(from - to)

const derivePath = (
  algorithm: DiskAlgorithm,
  start: number,
  requests: number[],
  direction: Direction,
  maxTrack: number,
) => {
  const safeStart = clampTrack(start, maxTrack)
  const uniqueRequests = Array.from(new Set(requests.map((track) => clampTrack(track, maxTrack))))

  switch (algorithm) {
    case 'FCFS':
      return simulateFCFS(safeStart, uniqueRequests)
    case 'SSTF':
      return simulateSSTF(safeStart, uniqueRequests)
    case 'SCAN':
      return simulateSCAN(safeStart, uniqueRequests, direction, maxTrack)
    case 'C-SCAN':
      return simulateCSCAN(safeStart, uniqueRequests, direction, maxTrack)
    case 'LOOK':
      return simulateLOOK(safeStart, uniqueRequests, direction)
    default:
      return [safeStart, ...uniqueRequests]
  }
}

const getGraphRange = (path: number[], maxTrack: number) => {
  const values = [0, maxTrack, ...path]
  return {
    min: Math.min(...values),
    max: Math.max(...values),
  }
}

const getPathMoves = (path: number[]) => {
  return path.slice(1).map((destination, index) => ({
    from: path[index],
    to: destination,
    distance: moveDistance(path[index], destination),
  }))
}

const getChartPoints = (path: number[]) => {
  const minTrack = Math.min(...path)
  const maxTrack = Math.max(...path)
  const stepCount = path.length

  if (stepCount === 0) {
    return { points: [], minTrack, maxTrack }
  }

  const points = path.map((track, index) => ({
    track,
    step: index,
    x: track,
    y: index,
  }))

  return { points, minTrack, maxTrack }
}

export default function DiskSchedulingSimulator() {
  const [requestString, setRequestString] = useState('98, 183, 37, 122, 14, 124, 65, 67')
  const [startHead, setStartHead] = useState(53)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<DiskAlgorithm>('FCFS')
  const [direction, setDirection] = useState<Direction>('right')
  const [maxTrack, setMaxTrack] = useState(199)

  const requests = useMemo(() => parseRequestString(requestString), [requestString])
  const path = useMemo(
    () => derivePath(selectedAlgorithm, startHead, requests, direction, maxTrack),
    [selectedAlgorithm, startHead, requests, direction, maxTrack],
  )

  const moves = useMemo(() => getPathMoves(path), [path])
  const totalDistance = useMemo(() => moves.reduce((sum, move) => sum + move.distance, 0), [moves])
  const graphRange = useMemo(() => getGraphRange(path, maxTrack), [path, maxTrack])
  const stepLabels = useMemo(() => Array.from(new Set(path)), [path])
  const chart = useMemo(() => getChartPoints(path), [path])

  const chartWidth = 720
  const chartHeight = 320
  const margin = { top: 28, right: 24, bottom: 20, left: 48 }
  const topAxisOffset = 26
  const width = chartWidth - margin.left - margin.right
  const height = chartHeight - margin.top - margin.bottom - topAxisOffset

  const xMin = Math.min(0, chart.minTrack)
  const xMax = Math.max(maxTrack, chart.maxTrack)
  const yMin = 0
  const yMax = Math.max(1, path.length - 1)

  const xScale = (value: number) => ((value - xMin) / (xMax - xMin)) * width
  const yScale = (value: number) => ((value - yMin) / (yMax - yMin)) * height

  const linePath = chart.points
    .map((point, index) => {
      const x = margin.left + xScale(point.x)
      const y = margin.top + topAxisOffset + yScale(point.y)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  const xAxisTicks = Array.from({ length: 9 }, (_, index) => Math.round(xMin + (index * (xMax - xMin)) / 8))
  const yAxisTicks = chart.points.map((point) => point.step)

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e6edf3', borderRadius: '6px' }}>
      <h2>Disk Scheduling Simulator</h2>
      <p>Compare FCFS, SSTF, SCAN, C-SCAN, and LOOK using a chart-style head movement graph.</p>

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <label>Request queue</label>
          <input
            type="text"
            value={requestString}
            onChange={(e) => setRequestString(e.target.value)}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d0d0d0' }}
          />
        </div>

        <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: '1fr 1fr 1fr' }}>
          <div>
            <label>Start head position</label>
            <input
              type="number"
              min={0}
              max={maxTrack}
              value={startHead}
              onChange={(e) => setStartHead(Number(e.target.value))}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d0d0d0' }}
            />
          </div>
          <div>
            <label>Maximum track</label>
            <input
              type="number"
              min={1}
              value={maxTrack}
              onChange={(e) => setMaxTrack(Number(e.target.value))}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d0d0d0' }}
            />
          </div>
          <div>
            <label>Algorithm</label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value as DiskAlgorithm)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d0d0d0' }}
            >
              <option value="FCFS">FCFS</option>
              <option value="SSTF">SSTF</option>
              <option value="SCAN">SCAN</option>
              <option value="C-SCAN">C-SCAN</option>
              <option value="LOOK">LOOK</option>
            </select>
          </div>
        </div>

        {(selectedAlgorithm === 'SCAN' || selectedAlgorithm === 'C-SCAN' || selectedAlgorithm === 'LOOK') && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="direction"
                value="right"
                checked={direction === 'right'}
                onChange={() => setDirection('right')}
              />
              Right
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="direction"
                value="left"
                checked={direction === 'left'}
                onChange={() => setDirection('left')}
              />
              Left
            </label>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f6f8fa', borderRadius: '8px' }}>
        <strong>{selectedAlgorithm} head sequence:</strong> {path.join(' → ')}
        <div style={{ marginTop: '0.5rem' }}>
          <strong>Total head movement:</strong> {totalDistance} tracks
        </div>
      </div>

      <div style={{ padding: '1rem', background: '#fff', border: '1px solid #c0c0c0', borderRadius: '8px', marginBottom: '1rem' }}>
        <svg width={chartWidth} height={chartHeight} style={{ display: 'block' }}>
          <rect x={0} y={0} width={chartWidth} height={chartHeight} fill="#f8f8f8" />
          <g>
            <line x1={margin.left} y1={margin.top + topAxisOffset} x2={chartWidth - margin.right} y2={margin.top + topAxisOffset} stroke="#333" strokeWidth={1.5} />
            {xAxisTicks.map((tick) => {
              const x = margin.left + xScale(tick)
              return (
                <g key={tick}>
                  <line x1={x} y1={margin.top + topAxisOffset - 6} x2={x} y2={margin.top + topAxisOffset + 6} stroke="#333" />
                  <text x={x} y={margin.top + topAxisOffset - 10} textAnchor="middle" fontSize={12} fill="#111">
                    {tick}
                  </text>
                </g>
              )
            })}
            {yAxisTicks.map((tick) => {
              const y = margin.top + topAxisOffset + yScale(tick)
              return (
                <g key={tick}>
                  <line x1={margin.left} y1={y} x2={chartWidth - margin.right} y2={y} stroke="#e0e0e0" strokeDasharray="4 4" />
                  <text x={margin.left - 12} y={y + 4} textAnchor="end" fontSize={12} fill="#444">
                    {tick}
                  </text>
                </g>
              )
            })}
            <path d={linePath} fill="none" stroke="#000" strokeWidth={2} />
            {chart.points.map((point) => {
              const x = margin.left + xScale(point.x)
              const y = margin.top + topAxisOffset + yScale(point.y)
              return (
                <g key={`${point.step}-${point.track}`}> 
                  <circle cx={x} cy={y} r={5} fill="#000" />
                  <text x={x} y={y - 10} textAnchor="middle" fontSize={11} fill="#000">
                    {point.track}
                  </text>
                </g>
              )
            })}
            <line x1={margin.left} y1={margin.top + topAxisOffset} x2={margin.left} y2={chartHeight - margin.bottom} stroke="#333" strokeWidth={1.5} />
            <line x1={margin.left} y1={chartHeight - margin.bottom} x2={chartWidth - margin.right} y2={chartHeight - margin.bottom} stroke="#333" strokeWidth={1.5} />
            <text x={(margin.left + chartWidth - margin.right) / 2} y={chartHeight - 4} textAnchor="middle" fontSize={13} fill="#111">
              Track no
            </text>
            <text x={14} y={(margin.top + topAxisOffset + chartHeight - margin.bottom) / 2} textAnchor="middle" fontSize={13} fill="#111" transform={`rotate(-90 14 ${(margin.top + topAxisOffset + chartHeight - margin.bottom) / 2})`}>
              Time
            </text>
            <text x={chartWidth / 2} y={16} textAnchor="middle" fontSize={14} fontWeight={700} fill="#111">
              DISK Scheduling Algorithm : {selectedAlgorithm}
            </text>
          </g>
        </svg>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
        {moves.map((move, index) => (
          <div key={index} style={{ padding: '0.75rem', borderRadius: '8px', background: '#f6f8fa', border: '1px solid #e0e0e0' }}>
            <strong>{move.from}</strong> → <strong>{move.to}</strong> = {move.distance}
          </div>
        ))}
      </div>

      <div style={{ padding: '1rem', background: '#f6f8fa', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        <h3 style={{ marginTop: 0 }}>How to read the graph</h3>
        <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
          <li>The blue line shows the disk head movement across track positions.</li>
          <li>Dots mark actual seek requests in chronological order.</li>
          <li>The chart axis uses track number on X and sequence step on Y.</li>
        </ul>
      </div>
    </div>
  )
}
