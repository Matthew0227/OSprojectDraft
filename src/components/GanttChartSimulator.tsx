import React, { useState } from 'react'

interface Process {
  id: string
  arrivalTime: number
  burstTime: number
  priority?: number
}

interface ScheduleResult {
  processId: string
  startTime: number
  endTime: number
  waitingTime: number
  turnaroundTime: number
}

interface ScheduleSegment {
  processId: string
  startTime: number
  endTime: number
}

type SchedulingAlgorithm = 'FCFS' | 'SJF' | 'RR' | 'Priority'

export default function GanttChartSimulator() {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 'P1', arrivalTime: 0, burstTime: 3, priority: 2 },
    { id: 'P2', arrivalTime: 1, burstTime: 2, priority: 1 },
    { id: 'P3', arrivalTime: 2, burstTime: 1, priority: 3 },
  ])
  
  const [schedule, setSchedule] = useState<ScheduleSegment[]>([])
  const [scheduleResults, setScheduleResults] = useState<ScheduleResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SchedulingAlgorithm>('FCFS')
  const [timeQuantum, setTimeQuantum] = useState(2)
  const [isPreemptive, setIsPreemptive] = useState(false)

  // Helper to calculate results from segments
  const calculateResultsFromSegments = (segments: ScheduleSegment[]): ScheduleResult[] => {
    const processMap: { [key: string]: { firstStart: number; lastEnd: number } } = {}

    segments.forEach(segment => {
      if (!processMap[segment.processId]) {
        processMap[segment.processId] = { firstStart: segment.startTime, lastEnd: segment.endTime }
      } else {
        processMap[segment.processId].lastEnd = Math.max(processMap[segment.processId].lastEnd, segment.endTime)
      }
    })

    const results: ScheduleResult[] = []
    Object.entries(processMap).forEach(([processId, times]) => {
      const process = processes.find(p => p.id === processId)
      if (process) {
        const turnaroundTime = times.lastEnd - process.arrivalTime
        const waitingTime = turnaroundTime - process.burstTime
        results.push({
          processId,
          startTime: times.firstStart,
          endTime: times.lastEnd,
          waitingTime,
          turnaroundTime,
        })
      }
    })

    return results.sort((a, b) => processes.findIndex(p => p.id === a.processId) - processes.findIndex(p => p.id === b.processId))
  }

  const handleProcessChange = (index: number, field: keyof Process, value: string | number) => {
    const newProcesses = [...processes]
    if (field === 'id') {
      newProcesses[index][field] = value as string
    } else {
      newProcesses[index][field] = Number(value)
    }
    setProcesses(newProcesses)
  }

  const addProcess = () => {
    const newId = `P${processes.length + 1}`
    setProcesses([...processes, { id: newId, arrivalTime: 0, burstTime: 1, priority: processes.length + 1 }])
  }

  const simulateFCFS = (): { segments: ScheduleSegment[]; results: ScheduleResult[] } => {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
    let currentTime = 0
    const segments: ScheduleSegment[] = []

    for (const process of sortedProcesses) {
      const startTime = Math.max(currentTime, process.arrivalTime)
      const endTime = startTime + process.burstTime

      segments.push({
        processId: process.id,
        startTime,
        endTime,
      })

      currentTime = endTime
    }

    const results = calculateResultsFromSegments(segments)
    return { segments, results }
  }

  const simulateSJF = (): { segments: ScheduleSegment[]; results: ScheduleResult[] } => {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)

    if (isPreemptive) {
      // SRTF - Shortest Remaining Time First (Preemptive)
      let currentTime = 0
      const segments: ScheduleSegment[] = []
      const remainingTime: { [key: string]: number } = {}

      sortedProcesses.forEach(p => {
        remainingTime[p.id] = p.burstTime
      })

      while (Object.values(remainingTime).some(time => time > 0)) {
        const available = sortedProcesses.filter(
          p => remainingTime[p.id] > 0 && p.arrivalTime <= currentTime
        )

        if (available.length === 0) {
          const nextProcess = sortedProcesses.find(p => remainingTime[p.id] > 0)
          if (nextProcess) {
            currentTime = nextProcess.arrivalTime
          }
          continue
        }

        // Find process with shortest remaining time
        const shortest = available.reduce((min, p) =>
          remainingTime[p.id] < remainingTime[min.id] ? p : min
        )

        const segmentStart = currentTime

        // Find when next event happens (either process finishes or new process arrives)
        let nextEventTime = segmentStart + remainingTime[shortest.id]

        for (const p of sortedProcesses) {
          if (p.arrivalTime > currentTime && p.arrivalTime < nextEventTime) {
            nextEventTime = p.arrivalTime
          }
        }

        const executeTime = nextEventTime - segmentStart
        const segmentEnd = segmentStart + executeTime

        segments.push({
          processId: shortest.id,
          startTime: segmentStart,
          endTime: segmentEnd,
        })

        remainingTime[shortest.id] -= executeTime
        currentTime = segmentEnd
      }

      const results = calculateResultsFromSegments(segments)
      return { segments, results }
    } else {
      // Non-preemptive SJF
      let currentTime = 0
      const segments: ScheduleSegment[] = []
      const processed = new Set<string>()

      while (processed.size < sortedProcesses.length) {
        const available = sortedProcesses.filter(
          p => !processed.has(p.id) && p.arrivalTime <= currentTime
        )

        if (available.length === 0) {
          const nextProcess = sortedProcesses.find(p => !processed.has(p.id))
          if (nextProcess) {
            currentTime = nextProcess.arrivalTime
          }
          continue
        }

        const shortestJob = available.reduce((min, p) =>
          p.burstTime < min.burstTime ? p : min
        )

        const startTime = currentTime
        const endTime = startTime + shortestJob.burstTime

        segments.push({
          processId: shortestJob.id,
          startTime,
          endTime,
        })

        processed.add(shortestJob.id)
        currentTime = endTime
      }

      const results = calculateResultsFromSegments(segments)
      return { segments, results }
    }
  }

  const simulateRR = (): { segments: ScheduleSegment[]; results: ScheduleResult[] } => {
    const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)
    let currentTime = 0
    const segments: ScheduleSegment[] = []
    const remainingBurst: { [key: string]: number } = {}

    queue.forEach(p => {
      remainingBurst[p.id] = p.burstTime
    })

    const processQueue: string[] = []
    let processIndex = 0

    while (Object.values(remainingBurst).some(burst => burst > 0)) {
      // Add all processes that have arrived
      for (let i = processIndex; i < queue.length; i++) {
        if (queue[i].arrivalTime <= currentTime) {
          if (!processQueue.includes(queue[i].id) && remainingBurst[queue[i].id] > 0) {
            processQueue.push(queue[i].id)
          }
          processIndex = i + 1
        } else {
          break
        }
      }

      if (processQueue.length === 0) {
        const nextArrival = queue.find(p => p.arrivalTime > currentTime)
        if (nextArrival) {
          currentTime = nextArrival.arrivalTime
          processQueue.push(nextArrival.id)
          processIndex = queue.indexOf(nextArrival) + 1
        }
        continue
      }

      const processId = processQueue.shift()!
      const burstToExecute = Math.min(remainingBurst[processId], timeQuantum)
      const startTime = currentTime
      const endTime = currentTime + burstToExecute

      segments.push({
        processId,
        startTime,
        endTime,
      })

      remainingBurst[processId] -= burstToExecute
      currentTime = endTime

      if (remainingBurst[processId] > 0) {
        processQueue.push(processId)
      }

      // Add newly arrived processes
      for (let i = processIndex; i < queue.length; i++) {
        if (queue[i].arrivalTime <= currentTime && !processQueue.includes(queue[i].id) && remainingBurst[queue[i].id] > 0) {
          processQueue.push(queue[i].id)
          processIndex = i + 1
        }
      }
    }

    const results = calculateResultsFromSegments(segments)
    return { segments, results }
  }

  const simulatePriority = (): { segments: ScheduleSegment[]; results: ScheduleResult[] } => {
    const sortedProcesses = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime)

    if (isPreemptive) {
      // Preemptive Priority - interrupts if higher priority arrives
      let currentTime = 0
      const segments: ScheduleSegment[] = []
      const remainingTime: { [key: string]: number } = {}

      sortedProcesses.forEach(p => {
        remainingTime[p.id] = p.burstTime
      })

      while (Object.values(remainingTime).some(time => time > 0)) {
        const available = sortedProcesses.filter(
          p => remainingTime[p.id] > 0 && p.arrivalTime <= currentTime
        )

        if (available.length === 0) {
          const nextProcess = sortedProcesses.find(p => remainingTime[p.id] > 0)
          if (nextProcess) {
            currentTime = nextProcess.arrivalTime
          }
          continue
        }

        // Find process with highest priority (lowest number)
        const highestPriority = available.reduce((max, p) =>
          (p.priority ?? 999) < (max.priority ?? 999) ? p : max
        )

        const segmentStart = currentTime

        // Find when next event happens (either process finishes or higher priority arrives)
        let nextEventTime = segmentStart + remainingTime[highestPriority.id]

        for (const p of sortedProcesses) {
          if (p.arrivalTime > currentTime && p.arrivalTime < nextEventTime) {
            nextEventTime = p.arrivalTime
          }
        }

        const executeTime = nextEventTime - segmentStart
        const segmentEnd = segmentStart + executeTime

        segments.push({
          processId: highestPriority.id,
          startTime: segmentStart,
          endTime: segmentEnd,
        })

        remainingTime[highestPriority.id] -= executeTime
        currentTime = segmentEnd
      }

      const results = calculateResultsFromSegments(segments)
      return { segments, results }
    } else {
      // Non-preemptive Priority
      let currentTime = 0
      const segments: ScheduleSegment[] = []
      const processed = new Set<string>()

      while (processed.size < sortedProcesses.length) {
        const available = sortedProcesses.filter(
          p => !processed.has(p.id) && p.arrivalTime <= currentTime
        )

        if (available.length === 0) {
          const nextProcess = sortedProcesses.find(p => !processed.has(p.id))
          if (nextProcess) {
            currentTime = nextProcess.arrivalTime
          }
          continue
        }

        const highestPriority = available.reduce((max, p) =>
          (p.priority ?? 999) < (max.priority ?? 999) ? p : max
        )

        const startTime = currentTime
        const endTime = startTime + highestPriority.burstTime

        segments.push({
          processId: highestPriority.id,
          startTime,
          endTime,
        })

        processed.add(highestPriority.id)
        currentTime = endTime
      }

      const results = calculateResultsFromSegments(segments)
      return { segments, results }
    }
  }

  const simulate = () => {
    let data: { segments: ScheduleSegment[]; results: ScheduleResult[] } = { segments: [], results: [] }

    switch (selectedAlgorithm) {
      case 'FCFS':
        data = simulateFCFS()
        break
      case 'SJF':
        data = simulateSJF()
        break
      case 'RR':
        data = simulateRR()
        break
      case 'Priority':
        data = simulatePriority()
        break
    }

    setSchedule(data.segments)
    setScheduleResults(data.results)
    setShowResults(true)
  }

  const removeProcess = (index: number) => {
    setProcesses(processes.filter((_, i) => i !== index))
  }

  const avgWaitingTime =
    scheduleResults.length > 0
      ? (scheduleResults.reduce((sum, s) => sum + s.waitingTime, 0) / scheduleResults.length).toFixed(2)
      : 0

  const avgTurnaroundTime =
    scheduleResults.length > 0
      ? (scheduleResults.reduce((sum, s) => sum + s.turnaroundTime, 0) / scheduleResults.length).toFixed(2)
      : 0

  const maxEndTime = schedule.length > 0 ? Math.max(...schedule.map(s => s.endTime)) : 10

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e6edf3', borderRadius: '6px' }}>
      <h2>CPU Scheduling Simulator</h2>

      <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f6f8fa', borderRadius: '6px' }}>
        <h3 style={{ marginTop: 0 }}>Algorithm Settings</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '0.5rem' }}>Select Algorithm:</label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value as SchedulingAlgorithm)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d0d0d0' }}
            >
              <option value="FCFS">FCFS (First-Come-First-Serve)</option>
              <option value="SJF">SJF (Shortest Job First)</option>
              <option value="RR">RR (Round Robin)</option>
              <option value="Priority">Priority Scheduling</option>
            </select>
          </div>
          {selectedAlgorithm === 'RR' && (
            <div>
              <label style={{ marginRight: '0.5rem' }}>Time Quantum:</label>
              <input
                type="number"
                value={timeQuantum}
                onChange={(e) => setTimeQuantum(Number(e.target.value))}
                style={{ width: '80px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #d0d0d0' }}
                min="1"
              />
            </div>
          )}
          {(selectedAlgorithm === 'SJF' || selectedAlgorithm === 'Priority') && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={isPreemptive}
                onChange={(e) => setIsPreemptive(e.target.checked)}
              />
              Preemptive
            </label>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Processes</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #d0d0d0' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Process ID</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Arrival Time</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Burst Time</th>
              {selectedAlgorithm === 'Priority' && (
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Priority (1=Highest)</th>
              )}
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #e6edf3' }}>
                <td style={{ padding: '0.5rem' }}>
                  <input
                    type="text"
                    value={process.id}
                    onChange={(e) => handleProcessChange(index, 'id', e.target.value)}
                    style={{ width: '60px', padding: '0.25rem' }}
                  />
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <input
                    type="number"
                    value={process.arrivalTime}
                    onChange={(e) => handleProcessChange(index, 'arrivalTime', e.target.value)}
                    style={{ width: '80px', padding: '0.25rem' }}
                    min="0"
                  />
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <input
                    type="number"
                    value={process.burstTime}
                    onChange={(e) => handleProcessChange(index, 'burstTime', e.target.value)}
                    style={{ width: '80px', padding: '0.25rem' }}
                    min="1"
                  />
                </td>
                {selectedAlgorithm === 'Priority' && (
                  <td style={{ padding: '0.5rem' }}>
                    <input
                      type="number"
                      value={process.priority || 999}
                      onChange={(e) => handleProcessChange(index, 'priority', e.target.value)}
                      style={{ width: '80px', padding: '0.25rem' }}
                      min="1"
                    />
                  </td>
                )}
                <td style={{ padding: '0.5rem' }}>
                  <button
                    onClick={() => removeProcess(index)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={addProcess}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0969da',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginRight: '0.5rem',
          }}
        >
          Add Process
        </button>
        <button
          onClick={simulate}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Simulate
        </button>
      </div>

      {showResults && (
        <>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3>Gantt Chart
              {selectedAlgorithm === 'SJF' && isPreemptive && ' (SRTF - Shortest Remaining Time First)'}
              {selectedAlgorithm === 'Priority' && isPreemptive && ' (Preemptive Priority)'}
              {selectedAlgorithm === 'Priority' && !isPreemptive && ' (Non-Preemptive Priority)'}
              {selectedAlgorithm === 'SJF' && !isPreemptive && ' (Non-Preemptive SJF)'}
            </h3>
            <div
              style={{
                display: 'flex',
                height: '60px',
                border: '2px solid #333',
                position: 'relative',
                marginBottom: '1rem',
                backgroundColor: '#f6f8fa',
              }}
            >
              {schedule.map((item, index) => {
                const width = (item.endTime - item.startTime) / maxEndTime * 100
                const colors = ['#0969da', '#28a745', '#d1300b', '#6f42c1', '#fd7e14', '#dc3545', '#17a2b8', '#ffc107']
                const processIndex = processes.findIndex(p => p.id === item.processId)
                const color = colors[processIndex % colors.length]

                return (
                  <div
                    key={index}
                    style={{
                      width: `${width}%`,
                      backgroundColor: color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      border: '1px solid #333',
                      fontSize: '0.875rem',
                    }}
                  >
                    {item.processId}
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#666' }}>
              <span>0</span>
              {[...new Set(schedule.map(s => s.endTime))].sort((a, b) => a - b).map((time, idx) => (
                <span key={idx}>{time}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3>Scheduling Results</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #d0d0d0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Process</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Arrival Time</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Burst Time</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Start Time</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>End Time</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Waiting Time</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Turnaround Time</th>
                </tr>
              </thead>
              <tbody>
                {scheduleResults.map((result, index) => {
                  const process = processes.find(p => p.id === result.processId)
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #e6edf3' }}>
                      <td style={{ padding: '0.5rem' }}>{result.processId}</td>
                      <td style={{ padding: '0.5rem' }}>{process?.arrivalTime}</td>
                      <td style={{ padding: '0.5rem' }}>{process?.burstTime}</td>
                      <td style={{ padding: '0.5rem' }}>{result.startTime}</td>
                      <td style={{ padding: '0.5rem' }}>{result.endTime}</td>
                      <td style={{ padding: '0.5rem' }}>{result.waitingTime}</td>
                      <td style={{ padding: '0.5rem' }}>{result.turnaroundTime}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: '#f6f8fa',
              borderRadius: '6px',
              border: '1px solid #e6edf3',
            }}
          >
            <h3>Metrics</h3>
            <p>
              <strong>Average Waiting Time:</strong> {avgWaitingTime}
            </p>
            <p>
              <strong>Average Turnaround Time:</strong> {avgTurnaroundTime}
            </p>
          </div>
        </>
      )}
    </div>
  )
}
