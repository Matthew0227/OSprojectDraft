import React, { useMemo, useState } from 'react'
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

const multipleChoiceQuestions: MultipleChoiceQuestion[] = [
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
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const score = useMemo(
    () => multipleChoiceQuestions.filter((question) => {
      const selected = answers[question.id]
      return selected ? question.choices.some((choice) => choice.id === selected && choice.isCorrect) : false
    }).length,
    [answers],
  )

  const resetActivity = () => setAnswers({})

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#fff', border: '1px solid #d8e2ea', borderRadius: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ margin: 0 }}>Module 6 Activity</h2>
          <p style={{ margin: '0.5rem 0 0', color: '#57606a' }}>5 multiple-choice questions and an interactive page replacement simulator.</p>
        </div>
        <div style={{ padding: '0.75rem 1rem', background: '#f1f8ff', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: '#57606a' }}>Score</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{score} / {multipleChoiceQuestions.length}</div>
          <button
            onClick={resetActivity}
            style={{ marginTop: '0.75rem', padding: '0.55rem 0.95rem', border: 'none', borderRadius: '8px', background: '#0969da', color: '#fff', cursor: 'pointer' }}
          >
            Reset
          </button>
        </div>
      </div>

      {multipleChoiceQuestions.map((question) => (
        <div key={question.id} style={{ marginTop: '1rem', padding: '1rem', background: '#f6f8fa', borderRadius: '8px', border: '1px solid #e7edf3' }}>
          <p style={{ margin: '0 0 1rem', fontWeight: '700' }}>{question.id}. {question.question}</p>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {question.choices.map((choice) => {
              const selected = answers[question.id] === choice.id
              const showCorrect = Boolean(answers[question.id])
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
                  onClick={() => setAnswers({ ...answers, [question.id]: choice.id })}
                  disabled={Boolean(answers[question.id])}
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
          {answers[question.id] && (
            <p style={{ margin: '0.75rem 0 0', color: '#57606a' }}>
              {question.choices.find((choice) => choice.id === answers[question.id])?.rationale}
            </p>
          )}
        </div>
      ))}

      <div style={{ marginTop: '2rem' }}>
        <PageReplacementSimulator />
      </div>
    </div>
  )
}
