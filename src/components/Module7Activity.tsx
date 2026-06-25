import React, { useMemo, useState } from 'react'

type Choice = {
  id: string
  text: string
  isCorrect: boolean
  rationale: string
}

type MultipleChoiceQuestion = {
  id: number
  question: string
  choices: Choice[]
}

type PathGuessQuestion = {
  id: number
  queue: string
  head: number
  path: string
  options: string[]
  answer: string
  rationale: string
}

const multipleChoiceQuestions: MultipleChoiceQuestion[] = [
  {
    id: 1,
    question: 'Which disk scheduling algorithm always selects the pending request closest to the current head position?',
    choices: [
      { id: 'A', text: 'FCFS', isCorrect: false, rationale: 'FCFS follows arrival order, not proximity.' },
      { id: 'B', text: 'SSTF', isCorrect: true, rationale: 'SSTF picks the closest request to minimize seek time.' },
      { id: 'C', text: 'SCAN', isCorrect: false, rationale: 'SCAN moves in one direction, not necessarily to the closest request first.' },
      { id: 'D', text: 'C-SCAN', isCorrect: false, rationale: 'C-SCAN scans in one direction and wraps to the beginning.' },
    ],
  },
  {
    id: 2,
    question: 'What does LOOK do differently compared to SCAN?',
    choices: [
      { id: 'A', text: 'It reverses direction at the last request instead of the disk edge.', isCorrect: true, rationale: 'LOOK stops at the farthest request and reverses without traveling to the physical end.' },
      { id: 'B', text: 'It always serves requests in arrival order.', isCorrect: false, rationale: 'That is FCFS, not LOOK.' },
      { id: 'C', text: 'It jumps directly to the end of the disk after each sweep.', isCorrect: false, rationale: 'That describes C-SCAN, not LOOK.' },
      { id: 'D', text: 'It chooses the longest seek distance first.', isCorrect: false, rationale: 'No common disk algorithm does that; LOOK uses directional sweeping.' },
    ],
  },
  {
    id: 3,
    question: 'Which algorithm produces the most uniform wait times by scanning in one direction and wrapping around?',
    choices: [
      { id: 'A', text: 'FCFS', isCorrect: false, rationale: 'FCFS does not scan in a fixed direction or wrap around.' },
      { id: 'B', text: 'SSTF', isCorrect: false, rationale: 'SSTF selects the nearest request and can starve far requests.' },
      { id: 'C', text: 'C-SCAN', isCorrect: true, rationale: 'C-SCAN scans one way and jumps back to the start, giving more uniform wait times.' },
      { id: 'D', text: 'LOOK', isCorrect: false, rationale: 'LOOK reverses at the last request and does not wrap to the beginning.' },
    ],
  },
  {
    id: 4,
    question: 'What is the main component of disk access time that scheduling algorithms try to minimize?',
    choices: [
      { id: 'A', text: 'Seek time', isCorrect: true, rationale: 'Scheduling algorithms mostly reduce seek time, which is the head movement cost.' },
      { id: 'B', text: 'Transfer time', isCorrect: false, rationale: 'Transfer time is important but usually smaller than seek time for request ordering.' },
      { id: 'C', text: 'Boot time', isCorrect: false, rationale: 'Boot time is not part of request scheduling.' },
      { id: 'D', text: 'Cluster size', isCorrect: false, rationale: 'Cluster size affects allocation, not immediate scheduling order.' },
    ],
  },
  {
    id: 5,
    question: 'Which of these is a cluster in disk terminology?',
    choices: [
      { id: 'A', text: 'A group of sectors allocated together', isCorrect: true, rationale: 'A cluster is a unit of allocation that groups multiple sectors.' },
      { id: 'B', text: 'A single concentric track on one platter', isCorrect: false, rationale: 'That is a track.' },
      { id: 'C', text: 'All tracks under the same arm position', isCorrect: false, rationale: 'That is a cylinder.' },
      { id: 'D', text: 'The delay while waiting for the disk to rotate', isCorrect: false, rationale: 'That is rotational latency.' },
    ],
  },
]

const pathGuessQuestions: PathGuessQuestion[] = [
  {
    id: 1,
    queue: '98, 183, 37, 122, 14, 124, 65, 67',
    head: 53,
    path: '53 → 98 → 183 → 37 → 122 → 14 → 124 → 65 → 67',
    options: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK'],
    answer: 'FCFS',
    rationale: 'The head follows the original arrival order exactly, which is FCFS behavior.'
  },
  {
    id: 2,
    queue: '98, 183, 37, 122, 14, 124, 65, 67',
    head: 53,
    path: '53 → 65 → 67 → 98 → 122 → 124 → 183 → 14 → 37',
    options: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK'],
    answer: 'LOOK',
    rationale: 'The head moves in one direction to the farthest request and then reverses at the last request, which describes LOOK.'
  },
  {
    id: 3,
    queue: '98, 183, 37, 122, 14, 124, 65, 67',
    head: 53,
    path: '53 → 65 → 67 → 98 → 122 → 124 → 183 → 0 → 14 → 37',
    options: ['FCFS', 'SSTF', 'SCAN', 'C-SCAN', 'LOOK'],
    answer: 'SCAN',
    rationale: 'The head continues to the disk edge and then reverses, which is SCAN behavior.'
  },
]

export default function Module7Activity() {
  const [mcAnswers, setMcAnswers] = useState<Record<number, string>>({})
  const [pathAnswers, setPathAnswers] = useState<Record<number, string>>({})

  const mcScore = useMemo(
    () => multipleChoiceQuestions.filter((question) => {
      const selected = mcAnswers[question.id]
      return selected ? question.choices.some((choice) => choice.id === selected && choice.isCorrect) : false
    }).length,
    [mcAnswers],
  )

  const pathScore = useMemo(
    () => pathGuessQuestions.filter((question) => pathAnswers[question.id] === question.answer).length,
    [pathAnswers],
  )

  const totalScore = mcScore + pathScore
  const totalQuestions = multipleChoiceQuestions.length + pathGuessQuestions.length

  const resetQuiz = () => {
    setMcAnswers({})
    setPathAnswers({})
  }

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #d8e2ea', borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0 }}>Module 7 Activity</h2>
          <p style={{ margin: '0.5rem 0 0', color: '#57606a' }}>5 multiple-choice and 3 algorithm-guess questions.</p>
        </div>
        <div style={{ padding: '0.75rem 1rem', background: '#f1f8ff', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: '#57606a' }}>Score</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{totalScore} / {totalQuestions}</div>
          <button
            onClick={resetQuiz}
            style={{ marginTop: '0.75rem', padding: '0.55rem 0.95rem', border: 'none', borderRadius: '8px', background: '#0969da', color: '#fff', cursor: 'pointer' }}
          >
            Reset
          </button>
        </div>
      </div>

      <section style={{ marginTop: '1.5rem' }}>
        <h3>Multiple Choice</h3>
        {multipleChoiceQuestions.map((question) => (
          <div key={question.id} style={{ marginTop: '1rem', padding: '1rem', background: '#f6f8fa', borderRadius: '8px', border: '1px solid #e7edf3' }}>
            <p style={{ margin: '0 0 1rem', fontWeight: '700' }}>{question.id}. {question.question}</p>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {question.choices.map((choice) => {
                const selected = mcAnswers[question.id] === choice.id
                const showCorrect = Boolean(mcAnswers[question.id])
                const isCorrect = choice.isCorrect
                let style = {
                  background: '#fff',
                  border: '1px solid #d0d7de',
                  color: '#24292f',
                }

                if (showCorrect) {
                  if (selected && isCorrect) {
                    style = { background: '#dafbe1', border: '1px solid #1f883d', color: '#1f883d' }
                  } else if (selected && !isCorrect) {
                    style = { background: '#ffebe9', border: '1px solid #cf222e', color: '#cf222e' }
                  } else if (isCorrect) {
                    style = { background: '#f0f6fc', border: '1px solid #c6e3f6', color: '#0969da' }
                  }
                }

                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => setMcAnswers({ ...mcAnswers, [question.id]: choice.id })}
                    disabled={Boolean(mcAnswers[question.id])}
                    style={{
                      textAlign: 'left',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      ...style,
                    }}
                  >
                    <strong>{choice.id}.</strong> {choice.text}
                  </button>
                )
              })}
            </div>
            {mcAnswers[question.id] && (
              <p style={{ margin: '0.75rem 0 0', color: '#57606a' }}>
                {question.choices.find((choice) => choice.id === mcAnswers[question.id])?.rationale}
              </p>
            )}
          </div>
        ))}
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3>Guess the Scheduling Algorithm</h3>
        {pathGuessQuestions.map((question) => (
          <div key={question.id} style={{ marginTop: '1rem', padding: '1rem', background: '#f6f8fa', borderRadius: '8px', border: '1px solid #e7edf3' }}>
            <p style={{ margin: '0 0 0.75rem', fontWeight: '700' }}>Question {question.id}</p>
            <p style={{ margin: '0 0 0.5rem' }}><strong>Request queue:</strong> {question.queue}</p>
            <p style={{ margin: '0 0 0.75rem' }}><strong>Initial head:</strong> {question.head}</p>
            <div style={{ background: '#fff', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #d0d7de', marginBottom: '1rem', fontFamily: 'monospace' }}>
              {question.path}
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {question.options.map((option) => {
                const selected = pathAnswers[question.id] === option
                const showResult = Boolean(pathAnswers[question.id])
                const isCorrect = selected && option === question.answer
                let style = {
                  background: '#fff',
                  border: '1px solid #d0d7de',
                  color: '#24292f',
                }

                if (showResult && selected) {
                  style = option === question.answer
                    ? { background: '#dafbe1', border: '1px solid #1f883d', color: '#1f883d' }
                    : { background: '#ffebe9', border: '1px solid #cf222e', color: '#cf222e' }
                }

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPathAnswers({ ...pathAnswers, [question.id]: option })}
                    disabled={Boolean(pathAnswers[question.id])}
                    style={{
                      textAlign: 'left',
                      padding: '0.85rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      ...style,
                    }}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            {pathAnswers[question.id] && (
              <p style={{ margin: '0.75rem 0 0', color: '#57606a' }}>{question.rationale}</p>
            )}
          </div>
        ))}
      </section>
    </div>
  )
}
