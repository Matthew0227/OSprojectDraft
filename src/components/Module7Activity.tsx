import React, { useState } from 'react'

type AnswerOption = {
  id: string
  text: string
  isCorrect: boolean
}

type QuestionDetails = {
  queue: string
  head: number
  path: string
}

type Question = {
  id: number
  text: string
  details?: QuestionDetails
  options: AnswerOption[]
  rationale: string
}

const quizData: Question[] = [
  {
    id: 1,
    text: 'Which disk scheduling algorithm always selects the pending request closest to the current head position?',
    options: [
      { id: 'A', text: 'FCFS', isCorrect: false },
      { id: 'B', text: 'SSTF', isCorrect: true },
      { id: 'C', text: 'SCAN', isCorrect: false },
      { id: 'D', text: 'C-SCAN', isCorrect: false },
    ],
    rationale: 'SSTF picks the closest request first to minimize head movement.',
  },
  {
    id: 2,
    text: 'What does LOOK do differently compared to SCAN?',
    options: [
      { id: 'A', text: 'It reverses direction at the last request instead of the disk edge.', isCorrect: true },
      { id: 'B', text: 'It always serves requests in arrival order.', isCorrect: false },
      { id: 'C', text: 'It jumps directly to the end of the disk after each sweep.', isCorrect: false },
      { id: 'D', text: 'It chooses the longest seek distance first.', isCorrect: false },
    ],
    rationale: 'LOOK reverses at the last pending request rather than at the physical disk edge.',
  },
  {
    id: 3,
    text: 'Which algorithm produces the most uniform wait times by scanning in one direction and wrapping around?',
    options: [
      { id: 'A', text: 'FCFS', isCorrect: false },
      { id: 'B', text: 'SSTF', isCorrect: false },
      { id: 'C', text: 'C-SCAN', isCorrect: true },
      { id: 'D', text: 'LOOK', isCorrect: false },
    ],
    rationale: 'C-SCAN scans one way and wraps back to the start for more uniform wait times.',
  },
  {
    id: 4,
    text: 'What is the main component of disk access time that scheduling algorithms try to minimize?',
    options: [
      { id: 'A', text: 'Seek time', isCorrect: true },
      { id: 'B', text: 'Transfer time', isCorrect: false },
      { id: 'C', text: 'Boot time', isCorrect: false },
      { id: 'D', text: 'Cluster size', isCorrect: false },
    ],
    rationale: 'Seek time is the dominant component that scheduling algorithms aim to reduce.',
  },
  {
    id: 5,
    text: 'Which of these is a cluster in disk terminology?',
    options: [
      { id: 'A', text: 'A group of sectors allocated together', isCorrect: true },
      { id: 'B', text: 'A single concentric track on one platter', isCorrect: false },
      { id: 'C', text: 'All tracks under the same arm position', isCorrect: false },
      { id: 'D', text: 'The delay while waiting for the disk to rotate', isCorrect: false },
    ],
    rationale: 'A cluster is a set of sectors allocated together as a single unit.',
  },
  {
    id: 6,
    text: 'Based on the request path below, which scheduling algorithm is shown?',
    details: {
      queue: '98, 183, 37, 122, 14, 124, 65, 67',
      head: 53,
      path: '53 → 98 → 183 → 37 → 122 → 14 → 124 → 65 → 67',
    },
    options: [
      { id: 'A', text: 'FCFS', isCorrect: true },
      { id: 'B', text: 'SSTF', isCorrect: false },
      { id: 'C', text: 'SCAN', isCorrect: false },
      { id: 'D', text: 'LOOK', isCorrect: false },
      { id: 'E', text: 'C-SCAN', isCorrect: false },
    ],
    rationale: 'The head follows the original arrival order exactly, which is FCFS.',
  },
  {
    id: 7,
    text: 'Based on the path below, which algorithm is this?',
    details: {
      queue: '98, 183, 37, 122, 14, 124, 65, 67',
      head: 53,
      path: '53 → 65 → 67 → 98 → 122 → 124 → 183 → 14 → 37',
    },
    options: [
      { id: 'A', text: 'LOOK', isCorrect: true },
      { id: 'B', text: 'SSTF', isCorrect: false },
      { id: 'C', text: 'C-SCAN', isCorrect: false },
      { id: 'D', text: 'FCFS', isCorrect: false },
      { id: 'E', text: 'SCAN', isCorrect: false },
    ],
    rationale: 'The head reverses at the last request rather than the disk edge, which matches LOOK.',
  },
  {
    id: 8,
    text: 'Based on this path, which algorithm is shown?',
    details: {
      queue: '98, 183, 37, 122, 14, 124, 65, 67',
      head: 53,
      path: '53 → 65 → 67 → 98 → 122 → 124 → 183 → 0 → 14 → 37',
    },
    options: [
      { id: 'A', text: 'SCAN', isCorrect: true },
      { id: 'B', text: 'SSTF', isCorrect: false },
      { id: 'C', text: 'LOOK', isCorrect: false },
      { id: 'D', text: 'C-SCAN', isCorrect: false },
      { id: 'E', text: 'FCFS', isCorrect: false },
    ],
    rationale: 'The head continues to the disk edge and then reverses, which describes SCAN.',
  },
]

export default function Module7Activity() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<AnswerOption | null>(null)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = quizData[currentQuestionIdx]

  const handleSelectOption = (option: AnswerOption) => {
    if (selectedOption) return
    setSelectedOption(option)
    if (option.isCorrect) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIdx + 1 < quizData.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
      setSelectedOption(null)
    } else {
      setShowResults(true)
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIdx(0)
    setSelectedOption(null)
    setScore(0)
    setShowResults(false)
  }

  if (showResults) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#f6f8fa', borderRadius: '8px', border: '1px solid #d0d7de', textAlign: 'center' }}>
        <h2 style={{ color: '#1f2328' }}>Disk Scheduling Activity Complete!</h2>
        <p style={{ fontSize: '1.2rem', color: '#57606a' }}>
          You scored <strong style={{ color: score > 5 ? '#1f883d' : '#cf222e' }}>{score}</strong> out of {quizData.length}
        </p>
        <button
          onClick={restartQuiz}
          style={{
            marginTop: '20px',
            padding: '10px 22px',
            backgroundColor: '#0969da',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Retake Activity
        </button>
      </div>
    )
  }

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #d0d7de' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e6edf3', paddingBottom: '10px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1f2328', fontSize: '1.25rem' }}>Disk Scheduling Activity</h2>
          <p style={{ margin: '0.5rem 0 0', color: '#57606a' }}>Work through each scenario and choose the best answer.</p>
        </div>
        <span style={{ color: '#57606a', fontWeight: 'bold' }}>
          Question {currentQuestionIdx + 1} of {quizData.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#e8f1ff', color: '#0969da', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '10px' }}>
            Disk Scheduling Quiz
          </div>
          <h3 style={{ margin: 0, color: '#24292f', fontSize: '1.1rem', lineHeight: '1.5' }}>{currentQuestion.text}</h3>
          {currentQuestion.details && (
            <div style={{ marginTop: '16px', padding: '14px', backgroundColor: '#f6f8fa', borderRadius: '8px', border: '1px solid #d0d7de' }}>
              <p style={{ margin: '0 0 8px', fontWeight: '700', color: '#24292f' }}>Request Details</p>
              <p style={{ margin: '0 0 6px', color: '#57606a' }}><strong>Queue:</strong> {currentQuestion.details.queue}</p>
              <p style={{ margin: '0 0 6px', color: '#57606a' }}><strong>Initial head:</strong> {currentQuestion.details.head}</p>
              <div style={{ marginTop: '10px', padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #d0d7de', fontFamily: 'monospace', color: '#24292f' }}>
                {currentQuestion.details.path}
              </div>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: '#f6f8fa', border: '1px solid #d0d7de', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f0f3f6', padding: '10px 14px', fontWeight: 'bold', borderBottom: '1px solid #d0d7de', fontSize: '0.9rem', color: '#57606a' }}>
            Activity Summary
          </div>
          <div style={{ padding: '14px' }}>
            <p style={{ margin: '0 0 8px', color: '#24292f' }}><strong>Total questions:</strong> {quizData.length}</p>
            <p style={{ margin: '0 0 8px', color: '#24292f' }}><strong>Correct so far:</strong> {score}</p>
            <p style={{ margin: 0, color: '#57606a' }}>Practice reading disk head paths and matching them to the right algorithm.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {currentQuestion.options.map((option) => {
          let bgColor = '#ffffff'
          let borderColor = '#d0d7de'
          let textColor = '#24292f'

          if (selectedOption) {
            if (option.isCorrect) {
              bgColor = '#dafbe1'
              borderColor = '#1f883d'
              textColor = '#1f883d'
            } else if (selectedOption.id === option.id && !option.isCorrect) {
              bgColor = '#ffebe9'
              borderColor = '#cf222e'
              textColor = '#cf222e'
            }
          }

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectOption(option)}
              disabled={Boolean(selectedOption)}
              style={{
                textAlign: 'left',
                padding: '14px 18px',
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '8px',
                color: textColor,
                fontSize: '1rem',
                cursor: selectedOption ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <strong style={{ marginRight: '12px' }}>{option.id}.</strong> {option.text}
            </button>
          )
        })}
      </div>

      {selectedOption && (
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: selectedOption.isCorrect ? '#dafbe1' : '#ffebe9', borderRadius: '6px', border: `1px solid ${selectedOption.isCorrect ? '#c3e6cb' : '#f9cbd0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, color: selectedOption.isCorrect ? '#1f883d' : '#cf222e' }}>
              {selectedOption.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </h4>
            <p style={{ margin: '8px 0 0', color: '#57606a' }}>{currentQuestion.rationale}</p>
          </div>
          <button
            onClick={handleNext}
            style={{
              padding: '10px 20px',
              backgroundColor: '#24292f',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {currentQuestionIdx + 1 === quizData.length ? 'See Results' : 'Next Question'}
          </button>
        </div>
      )}
    </div>
  )
}
