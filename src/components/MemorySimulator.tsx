import React, { useState } from 'react'

interface MemoryBlock {
  blockId: string
  size: number
}

interface Process {
  processId: string
  memoryRequired: number
}

interface AllocationResult {
  processId: string
  blockId: string
  startAddress: number
  endAddress: number
  allocated: boolean
}

type AllocationAlgorithm = 'FirstFit' | 'BestFit' | 'WorstFit' | 'NextFit'

export default function MemorySimulator() {
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([
    { blockId: 'B1', size: 50 },
    { blockId: 'B2', size: 30 },
    { blockId: 'B3', size: 40 },
  ])

  const [processes, setProcesses] = useState<Process[]>([
    { processId: 'P1', memoryRequired: 20 },
    { processId: 'P2', memoryRequired: 15 },
    { processId: 'P3', memoryRequired: 25 },
  ])

  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AllocationAlgorithm>('FirstFit')
  const [allocationResults, setAllocationResults] = useState<AllocationResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const [blockStates, setBlockStates] = useState<{ [key: string]: number[] }>({})

  const handleBlockChange = (index: number, field: keyof MemoryBlock, value: string | number) => {
    const newBlocks = [...memoryBlocks]
    if (field === 'blockId') {
      newBlocks[index][field] = value as string
    } else {
      newBlocks[index][field] = Number(value)
    }
    setMemoryBlocks(newBlocks)
  }

  const handleProcessChange = (index: number, field: keyof Process, value: string | number) => {
    const newProcesses = [...processes]
    if (field === 'processId') {
      newProcesses[index][field] = value as string
    } else {
      newProcesses[index][field] = Number(value)
    }
    setProcesses(newProcesses)
  }

  const addMemoryBlock = () => {
    const newId = `B${memoryBlocks.length + 1}`
    setMemoryBlocks([...memoryBlocks, { blockId: newId, size: 50 }])
  }

  const addProcess = () => {
    const newId = `P${processes.length + 1}`
    setProcesses([...processes, { processId: newId, memoryRequired: 10 }])
  }

  const removeMemoryBlock = (index: number) => {
    setMemoryBlocks(memoryBlocks.filter((_, i) => i !== index))
  }

  const removeProcess = (index: number) => {
    setProcesses(processes.filter((_, i) => i !== index))
  }

  const simulateFirstFit = (): AllocationResult[] => {
    const results: AllocationResult[] = []
    const blockUsage: { [key: string]: number } = {}

    // Initialize block usage tracking
    memoryBlocks.forEach(block => {
      blockUsage[block.blockId] = 0
    })

    // Allocate each process
    for (const process of processes) {
      let allocated = false

      // First Fit: allocate to first block with enough space
      for (const block of memoryBlocks) {
        const availableSpace = block.size - blockUsage[block.blockId]
        if (availableSpace >= process.memoryRequired) {
          const startAddress = blockUsage[block.blockId]
          const endAddress = startAddress + process.memoryRequired
          results.push({
            processId: process.processId,
            blockId: block.blockId,
            startAddress,
            endAddress,
            allocated: true,
          })
          blockUsage[block.blockId] += process.memoryRequired
          allocated = true
          break
        }
      }

      if (!allocated) {
        results.push({
          processId: process.processId,
          blockId: 'None',
          startAddress: 0,
          endAddress: 0,
          allocated: false,
        })
      }
    }

    return results
  }

  const simulateBestFit = (): AllocationResult[] => {
    const results: AllocationResult[] = []
    const blockUsage: { [key: string]: number } = {}

    memoryBlocks.forEach(block => {
      blockUsage[block.blockId] = 0
    })

    for (const process of processes) {
      let bestBlock: MemoryBlock | null = null
      let bestFitSize = Infinity

      // Best Fit: find block with smallest sufficient space
      for (const block of memoryBlocks) {
        const availableSpace = block.size - blockUsage[block.blockId]
        if (availableSpace >= process.memoryRequired && availableSpace < bestFitSize) {
          bestBlock = block
          bestFitSize = availableSpace
        }
      }

      if (bestBlock) {
        const startAddress = blockUsage[bestBlock.blockId]
        const endAddress = startAddress + process.memoryRequired
        results.push({
          processId: process.processId,
          blockId: bestBlock.blockId,
          startAddress,
          endAddress,
          allocated: true,
        })
        blockUsage[bestBlock.blockId] += process.memoryRequired
      } else {
        results.push({
          processId: process.processId,
          blockId: 'None',
          startAddress: 0,
          endAddress: 0,
          allocated: false,
        })
      }
    }

    return results
  }

  const simulateWorstFit = (): AllocationResult[] => {
    const results: AllocationResult[] = []
    const blockUsage: { [key: string]: number } = {}

    memoryBlocks.forEach(block => {
      blockUsage[block.blockId] = 0
    })

    for (const process of processes) {
      let worstBlock: MemoryBlock | null = null
      let worstFitSize = -1

      // Worst Fit: find block with largest sufficient space
      for (const block of memoryBlocks) {
        const availableSpace = block.size - blockUsage[block.blockId]
        if (availableSpace >= process.memoryRequired && availableSpace > worstFitSize) {
          worstBlock = block
          worstFitSize = availableSpace
        }
      }

      if (worstBlock) {
        const startAddress = blockUsage[worstBlock.blockId]
        const endAddress = startAddress + process.memoryRequired
        results.push({
          processId: process.processId,
          blockId: worstBlock.blockId,
          startAddress,
          endAddress,
          allocated: true,
        })
        blockUsage[worstBlock.blockId] += process.memoryRequired
      } else {
        results.push({
          processId: process.processId,
          blockId: 'None',
          startAddress: 0,
          endAddress: 0,
          allocated: false,
        })
      }
    }

    return results
  }

  const simulateNextFit = (): AllocationResult[] => {
    const results: AllocationResult[] = []
    const blockUsage: { [key: string]: number } = {}
    let lastBlockIndex = 0

    memoryBlocks.forEach(block => {
      blockUsage[block.blockId] = 0
    })

    for (const process of processes) {
      let allocated = false
      let startIndex = lastBlockIndex

      // Next Fit: allocate from where we left off
      for (let i = 0; i < memoryBlocks.length; i++) {
        const blockIndex = (startIndex + i) % memoryBlocks.length
        const block = memoryBlocks[blockIndex]
        const availableSpace = block.size - blockUsage[block.blockId]

        if (availableSpace >= process.memoryRequired) {
          const startAddress = blockUsage[block.blockId]
          const endAddress = startAddress + process.memoryRequired
          results.push({
            processId: process.processId,
            blockId: block.blockId,
            startAddress,
            endAddress,
            allocated: true,
          })
          blockUsage[block.blockId] += process.memoryRequired
          lastBlockIndex = blockIndex
          allocated = true
          break
        }
      }

      if (!allocated) {
        results.push({
          processId: process.processId,
          blockId: 'None',
          startAddress: 0,
          endAddress: 0,
          allocated: false,
        })
      }
    }

    return results
  }

  const simulate = () => {
    let results: AllocationResult[] = []

    switch (selectedAlgorithm) {
      case 'FirstFit':
        results = simulateFirstFit()
        break
      case 'BestFit':
        results = simulateBestFit()
        break
      case 'WorstFit':
        results = simulateWorstFit()
        break
      case 'NextFit':
        results = simulateNextFit()
        break
    }

    setAllocationResults(results)
    setShowResults(true)

    // Build block state visualization
    const states: { [key: string]: number[] } = {}
    memoryBlocks.forEach(block => {
      states[block.blockId] = Array(block.size).fill(0)
    })

    results.forEach((result, idx) => {
      if (result.allocated) {
        const colors = [1, 2, 3, 4, 5, 6, 7, 8]
        const colorIdx = idx % colors.length + 1
        for (let i = result.startAddress; i < result.endAddress; i++) {
          states[result.blockId][i] = colorIdx
        }
      }
    })

    setBlockStates(states)
  }

  const allocatedCount = allocationResults.filter(r => r.allocated).length
  const externalFragmentation = memoryBlocks.reduce((sum, block) => {
    const used = allocationResults
      .filter(r => r.blockId === block.blockId)
      .reduce((total, r) => total + (r.endAddress - r.startAddress), 0)
    const free = block.size - used
    return sum + (free > 0 ? 1 : 0)
  }, 0)

  const totalMemory = memoryBlocks.reduce((sum, b) => sum + b.size, 0)
  const totalAllocated = allocationResults
    .filter(r => r.allocated)
    .reduce((sum, r) => sum + (r.endAddress - r.startAddress), 0)
  const totalFree = totalMemory - totalAllocated

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e6edf3', borderRadius: '6px' }}>
      <h2>Memory Management Simulator</h2>

      <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f6f8fa', borderRadius: '6px' }}>
        <h3 style={{ marginTop: 0 }}>Algorithm Settings</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '0.5rem' }}>Select Algorithm:</label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value as AllocationAlgorithm)}
              style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #d0d0d0' }}
            >
              <option value="FirstFit">First Fit</option>
              <option value="BestFit">Best Fit</option>
              <option value="WorstFit">Worst Fit</option>
              <option value="NextFit">Next Fit</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Memory Blocks</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #d0d0d0' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Block ID</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Size (KB)</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {memoryBlocks.map((block, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #e6edf3' }}>
                <td style={{ padding: '0.5rem' }}>
                  <input
                    type="text"
                    value={block.blockId}
                    onChange={(e) => handleBlockChange(index, 'blockId', e.target.value)}
                    style={{ width: '60px', padding: '0.25rem' }}
                  />
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <input
                    type="number"
                    value={block.size}
                    onChange={(e) => handleBlockChange(index, 'size', e.target.value)}
                    style={{ width: '80px', padding: '0.25rem' }}
                    min="10"
                  />
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <button
                    onClick={() => removeMemoryBlock(index)}
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
          onClick={addMemoryBlock}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0969da',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add Memory Block
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Processes</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #d0d0d0' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Process ID</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Memory Required (KB)</th>
              <th style={{ padding: '0.5rem', textAlign: 'left' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #e6edf3' }}>
                <td style={{ padding: '0.5rem' }}>
                  <input
                    type="text"
                    value={process.processId}
                    onChange={(e) => handleProcessChange(index, 'processId', e.target.value)}
                    style={{ width: '60px', padding: '0.25rem' }}
                  />
                </td>
                <td style={{ padding: '0.5rem' }}>
                  <input
                    type="number"
                    value={process.memoryRequired}
                    onChange={(e) => handleProcessChange(index, 'memoryRequired', e.target.value)}
                    style={{ width: '80px', padding: '0.25rem' }}
                    min="1"
                  />
                </td>
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
            <h3>Memory Allocation Visualization</h3>
            {memoryBlocks.map(block => {
              const blockState = blockStates[block.blockId] || Array(block.size).fill(0)
              const colors = ['#f6f8fa', '#0969da', '#28a745', '#d1300b', '#6f42c1', '#fd7e14', '#dc3545', '#17a2b8', '#ffc107']

              return (
                <div key={block.blockId} style={{ marginBottom: '1rem' }}>
                  <div style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                    <strong>{block.blockId}</strong> (Size: {block.size} KB)
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      height: '40px',
                      border: '2px solid #333',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: '#f6f8fa',
                    }}
                  >
                    {blockState.map((state, idx) => (
                      <div
                        key={idx}
                        style={{
                          flex: 1,
                          backgroundColor: colors[state],
                          borderRight: state === blockState[idx + 1] ? 'none' : '1px solid #ccc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          color: state > 0 ? 'white' : '#666',
                        }}
                        title={`Address ${idx}`}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3>Allocation Results</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #d0d0d0' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Process ID</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Block ID</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Start Address</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>End Address</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Size (KB)</th>
                  <th style={{ padding: '0.5rem', textAlign: 'left' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {allocationResults.map((result, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e6edf3' }}>
                    <td style={{ padding: '0.5rem' }}>{result.processId}</td>
                    <td style={{ padding: '0.5rem' }}>{result.blockId}</td>
                    <td style={{ padding: '0.5rem' }}>{result.startAddress}</td>
                    <td style={{ padding: '0.5rem' }}>{result.endAddress}</td>
                    <td style={{ padding: '0.5rem' }}>{result.endAddress - result.startAddress}</td>
                    <td
                      style={{
                        padding: '0.5rem',
                        color: result.allocated ? '#28a745' : '#ff4444',
                        fontWeight: 'bold',
                      }}
                    >
                      {result.allocated ? '✓ Allocated' : '✗ Not Allocated'}
                    </td>
                  </tr>
                ))}
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
            <h3>Memory Statistics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              <div>
                <p>
                  <strong>Total Memory:</strong> {totalMemory} KB
                </p>
                <p>
                  <strong>Total Allocated:</strong> {totalAllocated} KB
                </p>
                <p>
                  <strong>Total Free:</strong> {totalFree} KB
                </p>
              </div>
              <div>
                <p>
                  <strong>Processes Allocated:</strong> {allocatedCount}/{processes.length}
                </p>
                <p>
                  <strong>Allocation Success Rate:</strong> {((allocatedCount / processes.length) * 100).toFixed(2)}%
                </p>
                <p>
                  <strong>Memory Utilization:</strong> {((totalAllocated / totalMemory) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
