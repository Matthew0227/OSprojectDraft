import React, { useEffect, useMemo, useState } from 'react'

type ReplacementAlgorithm = 'FIFO' | 'LRU' | 'OPT' | 'SecondChance'

interface SimulationStep {
  reference: number
  frames: Array<number | null>
  fault: boolean
  evicted: number | null
}

const parseReferenceString = (value: string) => {
  return value
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map(Number)
}

const parseFrameValues = (values: string[]) => {
  return values.map((value) => {
    const trimmed = value.trim()
    return trimmed === '' ? null : Number(trimmed)
  })
}

const initializeFrames = (initialFrames: Array<number | null>, frameCount: number) => {
  const frames: Array<number | null> = Array(frameCount).fill(null)
  for (let index = 0; index < frameCount; index += 1) {
    frames[index] = initialFrames[index] ?? null
  }
  return frames
}

const simulateFIFO = (
  reference: number[],
  frameCount: number,
  initialFrames: Array<number | null>,
): SimulationStep[] => {
  const frames = initializeFrames(initialFrames, frameCount)
  const queue: number[] = frames.filter((page): page is number => page !== null)
  const history: SimulationStep[] = []

  for (const page of reference) {
    const hit = frames.includes(page)
    let evicted: number | null = null

    if (!hit) {
      if (frames.includes(null)) {
        const freeIndex = frames.indexOf(null)
        if (freeIndex !== -1) {
          frames[freeIndex] = page
          queue.push(page)
        }
      } else {
        const victim = queue.shift()!
        const victimIndex = frames.indexOf(victim)
        if (victimIndex !== -1) {
          frames[victimIndex] = page
          evicted = victim
          queue.push(page)
        }
      }
    }

    history.push({ reference: page, frames: [...frames], fault: !hit, evicted })
  }

  return history
}

const simulateLRU = (
  reference: number[],
  frameCount: number,
  initialFrames: Array<number | null>,
): SimulationStep[] => {
  const frames = initializeFrames(initialFrames, frameCount)
  const lastUsed = new Map<number, number>()
  frames.forEach((page) => {
    if (page !== null && !lastUsed.has(page)) {
      lastUsed.set(page, -1)
    }
  })

  const history: SimulationStep[] = []

  for (let step = 0; step < reference.length; step += 1) {
    const page = reference[step]
    const hit = frames.includes(page)
    let evicted: number | null = null

    if (!hit) {
      if (frames.includes(null)) {
        const freeIndex = frames.indexOf(null)
        frames[freeIndex] = page
      } else {
        let lruPage: number | null = null
        let minTime = Infinity
        for (const framePage of frames) {
          if (framePage !== null) {
            const time = lastUsed.get(framePage) ?? -1
            if (time < minTime) {
              minTime = time
              lruPage = framePage
            }
          }
        }
        if (lruPage !== null) {
          const victimIndex = frames.indexOf(lruPage)
          evicted = lruPage
          frames[victimIndex] = page
        }
      }
    }

    lastUsed.set(page, step)
    history.push({ reference: page, frames: [...frames], fault: !hit, evicted })
  }

  return history
}

const simulateOPT = (
  reference: number[],
  frameCount: number,
  initialFrames: Array<number | null>,
): SimulationStep[] => {
  const frames = initializeFrames(initialFrames, frameCount)
  const history: SimulationStep[] = []

  for (let step = 0; step < reference.length; step += 1) {
    const page = reference[step]
    const hit = frames.includes(page)
    let evicted: number | null = null

    if (!hit) {
      if (frames.includes(null)) {
        const freeIndex = frames.indexOf(null)
        frames[freeIndex] = page
      } else {
        let victimPage: number | null = null
        let farthestUse = -1
        for (const framePage of frames) {
          if (framePage === null) continue
          const nextUse = reference.slice(step + 1).indexOf(framePage)
          if (nextUse === -1) {
            victimPage = framePage
            farthestUse = Infinity
            break
          }
          if (nextUse > farthestUse) {
            farthestUse = nextUse
            victimPage = framePage
          }
        }

        if (victimPage !== null) {
          const victimIndex = frames.indexOf(victimPage)
          evicted = victimPage
          frames[victimIndex] = page
        }
      }
    }

    history.push({ reference: page, frames: [...frames], fault: !hit, evicted })
  }

  return history
}

const simulateSecondChance = (
  reference: number[],
  frameCount: number,
  initialFrames: Array<number | null>,
): SimulationStep[] => {
  const frames = initializeFrames(initialFrames, frameCount)
  const refBits = Array(frameCount).fill(0)
  let pointer = 0
  const history: SimulationStep[] = []

  for (const page of reference) {
    const hit = frames.includes(page)
    let evicted: number | null = null

    if (hit) {
      const hitIndex = frames.indexOf(page)
      if (hitIndex !== -1) refBits[hitIndex] = 1
    } else {
      if (frames.includes(null)) {
        const freeIndex = frames.indexOf(null)
        if (freeIndex !== -1) {
          frames[freeIndex] = page
          refBits[freeIndex] = 0
        }
      } else {
        while (true) {
          if (refBits[pointer] === 0) {
            evicted = frames[pointer]
            frames[pointer] = page
            refBits[pointer] = 0
            pointer = (pointer + 1) % frameCount
            break
          }
          refBits[pointer] = 0
          pointer = (pointer + 1) % frameCount
        }
      }
    }

    history.push({ reference: page, frames: [...frames], fault: !hit, evicted })
  }

  return history
}

const algorithmMap: Record<
  ReplacementAlgorithm,
  (reference: number[], frameCount: number, initialFrames: Array<number | null>) => SimulationStep[]
> = {
  FIFO: simulateFIFO,
  LRU: simulateLRU,
  OPT: simulateOPT,
  SecondChance: simulateSecondChance,
}

export default function PageReplacementSimulator() {
  const [referenceString, setReferenceString] = useState('7,0,1,2,0,3,0,4,2,3,0,3,2')
  const [frameCount, setFrameCount] = useState(3)
  const [algorithm, setAlgorithm] = useState<ReplacementAlgorithm>('FIFO')
  const [currentStep, setCurrentStep] = useState(0)
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline')
  const [initialFrameValues, setInitialFrameValues] = useState<string[]>(Array(frameCount).fill(''))

  useEffect(() => {
    setInitialFrameValues((previous) => {
      const next = Array(frameCount).fill('')
      previous.slice(0, frameCount).forEach((value, index) => {
        next[index] = value ?? ''
      })
      return next
    })
  }, [frameCount])

  const reference = useMemo(() => parseReferenceString(referenceString), [referenceString])
  const initialFrames = useMemo(() => parseFrameValues(initialFrameValues), [initialFrameValues])

  const history = useMemo(() => {
    if (reference.length === 0 || frameCount < 1) return []
    return algorithmMap[algorithm](reference, frameCount, initialFrames)
  }, [reference, algorithm, frameCount, initialFrames])

  const pageFaults = history.filter((step) => step.fault).length

  useEffect(() => {
    setCurrentStep(0)
  }, [referenceString, algorithm, frameCount, initialFrameValues.join(',')])

  const current = history[currentStep] ?? null

  return (
    <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #e6edf3', borderRadius: '6px' }}>
      <h2>Page Replacement Simulator</h2>
      <p>Simulate how a page replacement algorithm manages frames with an interactive timeline and step controls.</p>

      <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <label>Reference String (comma or space separated)</label>
          <input
            value={referenceString}
            onChange={(e) => setReferenceString(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d0d0d0', width: '100%' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'grid', gap: '0.5rem', minWidth: '180px' }}>
            <label>Number of Frames</label>
            <input
              type="number"
              min={1}
              value={frameCount}
              onChange={(e) => setFrameCount(Math.max(1, Number(e.target.value)))}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d0d0d0' }}
            />
          </div>

          <div style={{ display: 'grid', gap: '0.5rem', minWidth: '180px' }}>
            <label>Replacement Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as ReplacementAlgorithm)}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d0d0d0' }}
            >
              <option value="FIFO">FIFO</option>
              <option value="LRU">LRU</option>
              <option value="OPT">Optimal (OPT)</option>
              <option value="SecondChance">Second Chance</option>
            </select>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem', minWidth: '180px' }}>
            <label>View Mode</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'timeline' | 'table')}
              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d0d0d0' }}
            >
              <option value="timeline">Timeline</option>
              <option value="table">Table</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.5rem' }}>
          <label>Initial Frame Contents</label>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(frameCount, 6)}, minmax(0, 1fr))`, gap: '0.5rem' }}>
            {Array.from({ length: frameCount }, (_, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Frame ${index + 1}`}
                value={initialFrameValues[index] ?? ''}
                onChange={(e) => {
                  const next = [...initialFrameValues]
                  next[index] = e.target.value
                  setInitialFrameValues(next)
                }}
                style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d0d0d0' }}
              />
            ))}
          </div>
          <small>Leave a cell blank for an empty frame.</small>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ padding: '1rem', background: '#f6f8fa', borderRadius: '6px' }}>
          <strong>Page Faults:</strong> {pageFaults} / {reference.length}
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Fault rate:</strong>{' '}
            {reference.length > 0 ? ((pageFaults / reference.length) * 100).toFixed(1) : '0'}%
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            type="button"
            disabled={!current || currentStep === 0}
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #d0d0d0', background: '#ffffff', cursor: 'pointer' }}
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!current || currentStep >= history.length - 1}
            onClick={() => setCurrentStep((prev) => Math.min(history.length - 1, prev + 1))}
            style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #d0d0d0', background: '#ffffff', cursor: 'pointer' }}
          >
            Next
          </button>
          <div style={{ minWidth: 120, textAlign: 'right' }}>
            <strong>Step:</strong> {history.length > 0 ? currentStep + 1 : 0}/{history.length}
          </div>
        </div>
      </div>

      {viewMode === 'timeline' ? (
        <>
          <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(reference.length, 1)}, 58px)`, gap: '6px', marginBottom: '6px' }}>
              {reference.map((page, index) => (
                <div
                  key={`ref-${index}`}
                  style={{
                    minHeight: 44,
                    borderRadius: 8,
                    border: index === currentStep ? '2px solid #b31b1b' : '1px solid #d0d0d0',
                    background: index === currentStep ? '#d93025' : '#ffffff',
                    color: index === currentStep ? '#ffffff' : '#111',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    boxShadow: index === currentStep ? '0 0 0 2px rgba(217, 48, 37, 0.2)' : undefined,
                  }}
                >
                  {page}
                </div>
              ))}
            </div>

            {Array.from({ length: frameCount }, (_, frameIdx) => (
              <div key={`frame-row-${frameIdx}`} style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max(reference.length, 1)}, 58px)`, gap: '6px', marginBottom: '6px' }}>
                {history.map((step, index) => (
                  <div
                    key={`frame-${frameIdx}-${index}`}
                    style={{
                      minHeight: 44,
                      borderRadius: 8,
                      border: '1px solid #d0d0d0',
                      background: index === currentStep ? '#e9f2ff' : '#ffffff',
                      color: '#111',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {step.frames[frameIdx] === null ? '' : step.frames[frameIdx]}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {current && (
            <div style={{ padding: '1rem', background: '#f6f8fa', borderRadius: '6px', marginTop: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: '1rem' }}>
                <div>
                  <strong>Current reference:</strong>
                  <div style={{ marginTop: 4 }}>{current.reference}</div>
                </div>
                <div>
                  <strong>Page fault:</strong>
                  <div style={{ marginTop: 4, color: current.fault ? '#d93025' : '#188038' }}>{current.fault ? 'Yes' : 'No'}</div>
                </div>
                <div>
                  <strong>Page hit:</strong>
                  <div style={{ marginTop: 4, color: current.fault ? '#d93025' : '#188038' }}>{current.fault ? 'No' : 'Yes'}</div>
                </div>
                <div>
                  <strong>Evicted page:</strong>
                  <div style={{ marginTop: 4 }}>{current.evicted ?? '-'}</div>
                </div>
                <div>
                  <strong>Frame contents:</strong>
                  <div style={{ marginTop: 4, display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {current.frames.map((frame, idx) => (
                      <span
                        key={`current-frame-${idx}`}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: 6,
                          background: '#ffffff',
                          border: '1px solid #d0d0d0',
                        }}
                      >
                        {frame === null ? '-' : frame}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #d0d0d0' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Step</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Reference</th>
                {Array.from({ length: frameCount }, (_, index) => (
                  <th key={index} style={{ padding: '0.75rem', textAlign: 'left' }}>Frame {index + 1}</th>
                ))}
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Fault</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Evicted</th>
              </tr>
            </thead>
            <tbody>
              {history.map((step, index) => (
                <tr
                  key={index}
                  style={{
                    borderBottom: '1px solid #e6edf3',
                    background: index === currentStep ? '#f0f7ff' : 'transparent',
                  }}
                >
                  <td style={{ padding: '0.75rem' }}>{index + 1}</td>
                  <td style={{ padding: '0.75rem' }}>{step.reference}</td>
                  {step.frames.map((frame, frameIndex) => (
                    <td key={frameIndex} style={{ padding: '0.75rem' }}>{frame === null ? '-' : frame}</td>
                  ))}
                  <td style={{ padding: '0.75rem', color: step.fault ? '#d93025' : '#188038' }}>{step.fault ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '0.75rem' }}>{step.evicted ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f6f8fa', borderRadius: '6px' }}>
        <h3 style={{ marginTop: 0 }}>Interactive Notes</h3>
        <p style={{ margin: 0 }}>
          The simulator calculates frame contents automatically from the chosen algorithm and reference string. Using initial frame values is supported, but editing the frame state once the simulation begins is intentionally not included to keep the algorithm behavior clear.
        </p>
      </div>
    </div>
  )
}
