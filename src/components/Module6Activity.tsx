import React, { useState } from 'react'
import PageReplacementSimulator from './PageReplacementSimulator'

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

const quizData: MultipleChoiceQuestion[] = [
  {
    id: 1,
    question: 'Which page replacement algorithm removes the oldest loaded page first?',
    choices: [
      { id: 'A', text: 'LRU', isCorrect: false, rationale: 'LRU removes the least recently used page, not the oldest loaded page.' },
      { id: 'B', text: 'FIFO', isCorrect: true, rationale: 'FIFO evicts the oldest page in memory first.' },
      { id: 'C', text: 'OPT', isCorrect: false, rationale: 'OPT removes the page with the farthest future use, not the oldest loaded page.' },
      { id: 'D', text: 'Second Chance', isCorrect: false, rationale: 'Second Chance is a modified FIFO algorithm that can skip recently used pages.' },
    ],
  },
  {
    id: 2,
    question: 'What does a page fault mean?',
    choices: [
      { id: 'A', text: 'The requested page is already in physical memory.', isCorrect: false, rationale: 'That is a page hit, not a page fault.' },
      { id: 'B', text: 'The requested page is not in physical memory and must be loaded from disk.', isCorrect: true, rationale: 'A page fault occurs when the page must be brought into memory from secondary storage.' },
      { id: 'C', text: 'The CPU cannot translate the logical address.', isCorrect: false, rationale: 'That is an invalid address error, not a page fault.' },
      { id: 'D', text: 'The memory protection bit is cleared.', isCorrect: false, rationale: 'This is a protection violation, not a page fault.' },
    ],
  },
  {
    id: 3,
    question: 'Which algorithm can benefit from knowing future references?',
    choices: [
      { id: 'A', text: 'FIFO', isCorrect: false, rationale: 'FIFO does not use future knowledge; it evicts in arrival order.' },
      { id: 'B', text: 'LRU', isCorrect: false, rationale: 'LRU uses past usage, not future knowledge.' },
      { id: 'C', text: 'OPT', isCorrect: true, rationale: 'OPT uses future page reference knowledge to minimize faults.' },
      { id: 'D', text: 'Second Chance', isCorrect: false, rationale: 'Second Chance uses reference bits, not future knowledge.' },
    ],
  },
  {
    id: 4,
    question: 'What is the main advantage of using virtual memory?',
    choices: [
      { id: 'A', text: 'It eliminates the need for physical RAM.', isCorrect: false, rationale: 'Virtual memory extends RAM but does not replace it.' },
      { id: 'B', text: 'It allows processes to use more memory than physical RAM by swapping pages.', isCorrect: true, rationale: 'Virtual memory enables larger address spaces through paging and swapping.' },
      { id: 'C', text: 'It speeds up disk I/O by avoiding page faults.', isCorrect: false, rationale: 'Virtual memory can cause page faults, which slow down I/O if frequent.' },
      { id: 'D', text: 'It guarantees no page faults will occur.', isCorrect: false, rationale: 'Page faults are still possible in virtual memory systems.' },
    ],
  },
  {
    id: 5,
    question: 'Which structure maps virtual pages to physical frames?',
    choices: [
      { id: 'A', text: 'TLB', isCorrect: false, rationale: 'The TLB caches page table entries, but the page table performs the mapping.' },
      { id: 'B', text: 'Page table', isCorrect: true, rationale: 'The page table maps virtual pages to physical frames.' },
      { id: 'C', text: 'Interrupt vector', isCorrect: false, rationale: 'The interrupt vector handles interrupts, not page mapping.' },
      { id: 'D', text: 'Frame table', isCorrect: false, rationale: 'The frame table tracks frame usage, while the page table does the mapping.' },
    ],
  },
]

export default function Module6Activity() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<Choice | null>(null)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)

  const currentQuestion = quizData[currentQuestionIdx]

  const handleSelectOption = (option: Choice) => {
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
        <h2 style={{ color: '#1f2328' }}>Virtual Memory Activity Complete!</h2>
        <p style={{ fontSize: '1.1rem', color: '#57606a' }}>
          You answered <strong>{score}</strong> out of <strong>{quizData.length}</strong> questions correctly.
        </p>
        <button
          onClick={restartQuiz}
          style={{
            marginTop: '20px',
            padding: '10px 22px',
            backgroundColor: '#0969da',
            color: '#fff',
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
          <h2 style={{ margin: 0, color: '#1f2328', fontSize: '1.25rem' }}>Virtual Memory Activity</h2>
          <p style={{ margin: '0.5rem 0 0', color: '#57606a' }}>Answer the quiz and then explore the page replacement simulator below.</p>
        </div>
        <span style={{ color: '#57606a', fontWeight: 'bold' }}>
          Question {currentQuestionIdx + 1} of {quizData.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#e8f1ff', color: '#0969da', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '10px' }}>
            Virtual Memory Quiz
          </div>
          <h3 style={{ margin: 0, color: '#24292f', fontSize: '1.1rem', lineHeight: '1.5' }}>{currentQuestion.question}</h3>
        </div>

        <div style={{ backgroundColor: '#f6f8fa', border: '1px solid #d0d7de', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f0f3f6', padding: '10px 14px', fontWeight: 'bold', borderBottom: '1px solid #d0d7de', fontSize: '0.9rem', color: '#57606a' }}>
            Activity Summary
          </div>
          <div style={{ padding: '14px' }}>
            <p style={{ margin: '0 0 8px', color: '#24292f' }}><strong>Total questions:</strong> {quizData.length}</p>
            <p style={{ margin: '0 0 8px', color: '#24292f' }}><strong>Current score:</strong> {score}</p>
            <p style={{ margin: 0, color: '#57606a' }}>Use the simulator to compare how page replacement decisions affect memory performance.</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {currentQuestion.choices.map((option) => {
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
                transition: 'all 0.15s ease',
              }}
            >
              <strong style={{ marginRight: '12px' }}>{option.id}.</strong>
              {option.text}
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
            <p style={{ margin: '8px 0 0', color: '#57606a' }}>{selectedOption.rationale}</p>
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

      <div style={{ marginTop: '2rem' }}>
        <PageReplacementSimulator />
      </div>
    </div>
  )
}
