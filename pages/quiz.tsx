import Head from 'next/head'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import GanttChartSimulator from '../src/components/GanttChartSimulator'
import MemorySimulator from '../src/components/MemorySimulator'
import PageReplacementSimulator from '../src/components/PageReplacementSimulator'
import DiskSchedulingSimulator from '../src/components/DiskSchedulingSimulator'

type Choice = {
  id: string
  text: string
  isCorrect: boolean
  rationale: string
}

type Question = {
  id: number
  question: string
  choices: Choice[]
}

type TrueFalseQuestion = {
  id: number
  question: string
  answer: boolean
  rationale: string
}

const questions: Question[] = [
  {
    id: 1,
    question: 'Which CPU scheduling algorithm is nonpreemptive and runs processes in arrival order?',
    choices: [
      { id: 'A', text: 'Round Robin', isCorrect: false, rationale: 'Round Robin is preemptive and uses time slices.' },
      { id: 'B', text: 'First-Come, First-Served (FCFS)', isCorrect: true, rationale: 'FCFS runs processes in arrival order without preemption.' },
      { id: 'C', text: 'Shortest Job First (SJF)', isCorrect: false, rationale: 'SJF chooses the shortest job first, not arrival order.' },
      { id: 'D', text: 'Priority Scheduling', isCorrect: false, rationale: 'Priority scheduling selects based on priority values.' },
    ],
  },
  {
    id: 2,
    question: 'In paging, what structure maps virtual pages to physical frames?',
    choices: [
      { id: 'A', text: 'Translation Lookaside Buffer (TLB)', isCorrect: false, rationale: 'The TLB caches page table entries, but the page table performs the mapping.' },
      { id: 'B', text: 'Page Table', isCorrect: true, rationale: 'The page table maps virtual page numbers to frame numbers.' },
      { id: 'C', text: 'Interrupt Vector', isCorrect: false, rationale: 'The interrupt vector handles interrupts, not page mapping.' },
      { id: 'D', text: 'Swap File', isCorrect: false, rationale: 'The swap file stores pages, but does not map addresses.' },
    ],
  },
  {
    id: 3,
    question: 'Which page replacement algorithm chooses the page not used for the longest time in the future?',
    choices: [
      { id: 'A', text: 'LRU', isCorrect: false, rationale: 'LRU uses past access history, not future information.' },
      { id: 'B', text: 'OPT / MIN', isCorrect: true, rationale: 'OPT uses future reference information to choose the best page to evict.' },
      { id: 'C', text: 'FIFO', isCorrect: false, rationale: 'FIFO evicts the oldest page in memory.' },
      { id: 'D', text: 'Second Chance', isCorrect: false, rationale: 'Second Chance is a practical approximation of FIFO with reference bits.' },
    ],
  },
  {
    id: 4,
    question: 'Which disk scheduling algorithm wraps from one end back to the beginning without servicing requests on the return sweep?',
    choices: [
      { id: 'A', text: 'SCAN', isCorrect: false, rationale: 'SCAN reverses direction at the disk end and services requests on the return sweep.' },
      { id: 'B', text: 'C-SCAN', isCorrect: true, rationale: 'C-SCAN wraps back to the start and only services requests in one direction.' },
      { id: 'C', text: 'SSTF', isCorrect: false, rationale: 'SSTF always chooses the closest request regardless of direction.' },
      { id: 'D', text: 'LOOK', isCorrect: false, rationale: 'LOOK reverses at the last request rather than the disk end.' },
    ],
  },
  {
    id: 5,
    question: 'What is a cluster in disk storage?',
    choices: [
      { id: 'A', text: 'The smallest addressable unit on disk', isCorrect: false, rationale: 'A cluster is larger than a sector and groups sectors together.' },
      { id: 'B', text: 'A group of sectors allocated together', isCorrect: true, rationale: 'A cluster is a set of sectors allocated as a unit by the file system.' },
      { id: 'C', text: 'A set of tracks over all platters', isCorrect: false, rationale: 'That describes a cylinder.' },
      { id: 'D', text: 'A set of bytes in main memory', isCorrect: false, rationale: 'Clusters refer to disk storage, not main memory.' },
    ],
  },
  {
    id: 6,
    question: 'In the context of memory allocation, which algorithm chooses the smallest block that is still large enough for the process?',
    choices: [
      { id: 'A', text: 'First Fit', isCorrect: false, rationale: 'First Fit chooses the first sufficient block, not the smallest.' },
      { id: 'B', text: 'Worst Fit', isCorrect: false, rationale: 'Worst Fit chooses the largest available block.' },
      { id: 'C', text: 'Best Fit', isCorrect: true, rationale: 'Best Fit selects the smallest block that fits the process.' },
      { id: 'D', text: 'Next Fit', isCorrect: false, rationale: 'Next Fit continues from the last allocation point.' },
    ],
  },
  {
    id: 7,
    question: 'Which CPU scheduling policy can help avoid starvation by giving each process a time slice?',
    choices: [
      { id: 'A', text: 'Round Robin', isCorrect: true, rationale: 'Round Robin uses time slices and rotates processes fairly.' },
      { id: 'B', text: 'FIFO', isCorrect: false, rationale: 'FIFO can cause long waiting times for later processes.' },
      { id: 'C', text: 'SJF', isCorrect: false, rationale: 'SJF may starve longer jobs.' },
      { id: 'D', text: 'Priority Scheduling', isCorrect: false, rationale: 'Priority scheduling may starve low-priority processes.' },
    ],
  },
  {
    id: 8,
    question: 'What is the primary purpose of the translation lookaside buffer (TLB)?',
    choices: [
      { id: 'A', text: 'To store recently used physical frames', isCorrect: false, rationale: 'The TLB stores page table entries, not physical frames.' },
      { id: 'B', text: 'To cache recent virtual-to-physical page translations', isCorrect: true, rationale: 'The TLB speeds up address translation by caching page table entries.' },
      { id: 'C', text: 'To hold process priorities', isCorrect: false, rationale: 'Process priorities are not stored in the TLB.' },
      { id: 'D', text: 'To track disk sector locations', isCorrect: false, rationale: 'Disk sector tracking is unrelated to the TLB.' },
    ],
  },
  {
    id: 9,
    question: 'Which disk scheduling algorithm may cause starvation for requests far from the current head location?',
    choices: [
      { id: 'A', text: 'SSTF', isCorrect: true, rationale: 'SSTF can repeatedly choose nearby requests and starve distant ones.' },
      { id: 'B', text: 'FCFS', isCorrect: false, rationale: 'FCFS serves requests in order and does not starve specific requests.' },
      { id: 'C', text: 'C-SCAN', isCorrect: false, rationale: 'C-SCAN treats requests fairly in one direction.' },
      { id: 'D', text: 'LOOK', isCorrect: false, rationale: 'LOOK services in order along a sweep, which is fairer than SSTF.' },
    ],
  },
  {
    id: 10,
    question: 'Which memory allocation strategy can possibly leave many small unusable holes?',
    choices: [
      { id: 'A', text: 'Paging', isCorrect: false, rationale: 'Paging eliminates external fragmentation by using fixed-size pages.' },
      { id: 'B', text: 'Segmentation', isCorrect: false, rationale: 'Segmentation can cause fragmentation, but the question asks specifically for small holes.' },
      { id: 'C', text: 'Dynamic partitioning', isCorrect: true, rationale: 'Dynamic partitioning can create many small external fragments over time.' },
      { id: 'D', text: 'Cluster allocation', isCorrect: false, rationale: 'Cluster allocation is a disk-file storage concept, not memory holes.' },
    ],
  },
]

const trueFalseQuestions: TrueFalseQuestion[] = [
  {
    id: 1,
    question: 'SJF scheduling always minimizes average waiting time over all possible schedules.',
    answer: false,
    rationale: 'SJF minimizes average waiting time among nonpreemptive schedules for a given set of jobs, but it cannot guarantee optimality under preemption or changing arrivals.'
  },
  {
    id: 2,
    question: 'In virtual memory, a page fault occurs when a referenced page is not currently in physical memory.',
    answer: true,
    rationale: 'That is the definition of a page fault.'
  },
  {
    id: 3,
    question: 'FCFS disk scheduling always produces the minimum possible head movement.',
    answer: false,
    rationale: 'FCFS does not optimize head movement, so it can produce significantly larger seeks than other algorithms.'
  },
  {
    id: 4,
    question: 'Round Robin is a preemptive CPU scheduling algorithm.',
    answer: true,
    rationale: 'Round Robin preempts processes after each time quantum.'
  },
  {
    id: 5,
    question: 'A page table is used to map logical addresses to disk sectors directly.',
    answer: false,
    rationale: 'A page table maps virtual pages to physical frames, not directly to disk sectors.'
  },
  {
    id: 6,
    question: 'Paging eliminates internal fragmentation entirely.',
    answer: false,
    rationale: 'Paging removes external fragmentation but can still have internal fragmentation inside pages.'
  },
  {
    id: 7,
    question: 'Thrashing occurs when the system spends more time swapping pages than executing processes.',
    answer: true,
    rationale: 'Thrashing is caused by excessive page faults and swapping activity that reduce useful CPU work.'
  },
  {
    id: 8,
    question: 'The TLB is only useful in systems without virtual memory.',
    answer: false,
    rationale: 'The TLB is specifically used to speed up virtual-to-physical address translations in virtual memory systems.'
  },
  {
    id: 9,
    question: 'In the context of disk scheduling, SSTF may starve requests that are far from the current head.',
    answer: true,
    rationale: 'SSTF repeatedly services the nearest request, which can leave distant requests waiting a long time.'
  },
  {
    id: 10,
    question: 'A process can be in the Ready state while waiting for I/O completion.',
    answer: false,
    rationale: 'A process waiting for I/O is in the Waiting/Blocked state, not the Ready state.'
  },
]

export default function QuizPage() {
  const [mcAnswers, setMcAnswers] = useState<Record<number, string>>({})
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean>>({})

  const mcScore = useMemo(
    () => questions.filter((q) => {
      const selected = mcAnswers[q.id]
      return selected ? q.choices.some((choice) => choice.id === selected && choice.isCorrect) : false
    }).length,
    [mcAnswers],
  )

  const tfScore = useMemo(
    () => trueFalseQuestions.filter((q) => tfAnswers[q.id] === q.answer).length,
    [tfAnswers],
  )

  const totalScore = mcScore + tfScore
  const totalQuestions = questions.length + trueFalseQuestions.length

  const resetAnswers = () => {
    setMcAnswers({})
    setTfAnswers({})
  }

  return (
    <>
      <Head>
        <title>OS Learning — Quiz</title>
      </Head>
      <main style={{ fontFamily: 'Inter, system-ui, Arial', padding: '2rem', maxWidth: 1000 }}>
        <h1>OS Quiz — Interactive Learning</h1>
        <p>This page combines a longer quiz with input-driven simulator activities for CPU scheduling, memory management, page replacement, and disk scheduling.</p>

        <div style={{ margin: '1.5rem 0', padding: '1rem', borderRadius: '10px', border: '1px solid #d8e2ea', background: '#f6f8fa' }}>
          <strong>Score:</strong> {totalScore} / {totalQuestions}
          <button
            onClick={resetAnswers}
            style={{ marginLeft: '1rem', padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', background: '#0969da', color: '#fff', cursor: 'pointer' }}
          >
            Reset Answers
          </button>
        </div>

        <section style={{ marginBottom: '2rem' }}>
          <h2>Multiple Choice (10 questions)</h2>
          {questions.map((question) => (
            <div key={question.id} style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '10px', border: '1px solid #e6edf3' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{question.id}. {question.question}</div>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {question.choices.map((choice) => {
                  const selected = mcAnswers[question.id] === choice.id
                  const showCorrect = Boolean(mcAnswers[question.id])
                  let buttonStyle = {
                    textAlign: 'left',
                    padding: '0.9rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #d0d7de',
                    backgroundColor: '#ffffff',
                    color: '#24292f',
                    cursor: 'pointer',
                  } as React.CSSProperties

                  if (showCorrect) {
                    if (selected && choice.isCorrect) {
                      buttonStyle = { ...buttonStyle, backgroundColor: '#dafbe1', borderColor: '#1f883d', color: '#1f883d' }
                    } else if (selected && !choice.isCorrect) {
                      buttonStyle = { ...buttonStyle, backgroundColor: '#ffebe9', borderColor: '#cf222e', color: '#cf222e' }
                    } else if (choice.isCorrect) {
                      buttonStyle = { ...buttonStyle, backgroundColor: '#f0f6fc', borderColor: '#c6e3f6', color: '#0969da' }
                    }
                  }

                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => setMcAnswers({ ...mcAnswers, [question.id]: choice.id })}
                      disabled={Boolean(mcAnswers[question.id])}
                      style={buttonStyle}
                    >
                      <strong>{choice.id}.</strong> {choice.text}
                    </button>
                  )
                })}
              </div>
              {mcAnswers[question.id] && (
                <p style={{ marginTop: '0.75rem', color: '#57606a' }}>
                  {question.choices.find((choice) => choice.id === mcAnswers[question.id])?.rationale}
                </p>
              )}
            </div>
          ))}
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>True or False (10 questions)</h2>
          {trueFalseQuestions.map((question) => (
            <div key={question.id} style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '10px', border: '1px solid #e6edf3' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.75rem' }}>{question.id}. {question.question}</div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {['True', 'False'].map((label) => {
                  const value = label === 'True'
                  const selected = tfAnswers[question.id] === value
                  const showResult = typeof tfAnswers[question.id] === 'boolean'
                  let buttonStyle = {
                    flex: 1,
                    padding: '0.9rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #d0d7de',
                    backgroundColor: '#ffffff',
                    color: '#24292f',
                    cursor: 'pointer',
                  } as React.CSSProperties

                  if (showResult && selected) {
                    buttonStyle = value === question.answer
                      ? { ...buttonStyle, backgroundColor: '#dafbe1', borderColor: '#1f883d', color: '#1f883d' }
                      : { ...buttonStyle, backgroundColor: '#ffebe9', borderColor: '#cf222e', color: '#cf222e' }
                  }

                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setTfAnswers({ ...tfAnswers, [question.id]: value })}
                      disabled={typeof tfAnswers[question.id] === 'boolean'}
                      style={buttonStyle}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              {typeof tfAnswers[question.id] === 'boolean' && (
                <p style={{ marginTop: '0.75rem', color: '#57606a' }}>{question.rationale}</p>
              )}
            </div>
          ))}
        </section>
        <p><Link href="/">← Back to home</Link></p>
      </main>
    </>
  )
}
