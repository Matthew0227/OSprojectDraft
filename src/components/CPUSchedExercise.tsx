import React, { useState } from 'react';

// Define types for the quiz structure
interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface ProcessInput {
  process: string;
  arrival: number;
  burst: number;
  priority?: number; // Optional priority field added for Priority Scheduling
}

interface Question {
  id: number;
  text: string;
  algorithm: string;
  scenario: ProcessInput[];
  options: AnswerOption[];
}

const quizData: Question[] = [
  {
    id: 1,
    text: "Load the processes below. What is the Average Waiting Time for this set?",
    algorithm: "First-Come, First-Served (FCFS)",
    scenario: [
      { process: "P1", arrival: 0, burst: 24 },
      { process: "P2", arrival: 1, burst: 3 },
      { process: "P3", arrival: 2, burst: 3 }
    ],
    options: [
      { id: 'A', text: "3.0 ms", isCorrect: false },
      { id: 'B', text: "16.0 ms", isCorrect: true },
      { id: 'C', text: "17.0 ms", isCorrect: false },
      { id: 'D', text: "27.0 ms", isCorrect: false }
    ]
  },
  {
    id: 2,
    text: "Clear your simulator and load this new set. Under this non-preemptive algorithm, which process is the SECOND one to finish its execution?",
    algorithm: "Shortest Job First (SJF - Non-Preemptive)",
    scenario: [
      { process: "P1", arrival: 0, burst: 6 },
      { process: "P2", arrival: 1, burst: 8 },
      { process: "P3", arrival: 2, burst: 7 },
      { process: "P4", arrival: 3, burst: 3 }
    ],
    options: [
      { id: 'A', text: "P1", isCorrect: false },
      { id: 'B', text: "P2", isCorrect: false },
      { id: 'C', text: "P3", isCorrect: false },
      { id: 'D', text: "P4", isCorrect: true }
    ]
  },
  {
    id: 3,
    text: "Load this scenario into Priority Scheduling with Preemptive UNCHECKED. Assuming lower numbers indicate a higher priority, at what exact time does P2 finish execution?",
    algorithm: "Priority Scheduling (Non-Preemptive)",
    scenario: [
      { process: "P1", arrival: 0, burst: 10, priority: 3 },
      { process: "P2", arrival: 1, burst: 2, priority: 1 },
      { process: "P3", arrival: 2, burst: 4, priority: 2 }
    ],
    options: [
      { id: 'A', text: "Time 3", isCorrect: false },
      { id: 'B', text: "Time 10", isCorrect: false },
      { id: 'C', text: "Time 12", isCorrect: true },
      { id: 'D', text: "Time 16", isCorrect: false }
    ]
  },
  {
    id: 4,
    text: "Set your simulator to Round Robin and ensure the Time Quantum (q) is set to 2. What is the Turnaround Time for process P2?",
    algorithm: "Round Robin (RR) - Quantum = 2",
    scenario: [
      { process: "P1", arrival: 0, burst: 5 },
      { process: "P2", arrival: 0, burst: 4 },
      { process: "P3", arrival: 0, burst: 3 }
    ],
    options: [
      { id: 'A', text: "4 ms", isCorrect: false },
      { id: 'B', text: "8 ms", isCorrect: false },
      { id: 'C', text: "10 ms", isCorrect: true },
      { id: 'D', text: "12 ms", isCorrect: false }
    ]
  },
  {
    id: 5,
    text: "Load this final set and turn Preemptive ON for Priority Scheduling (lower numbers = higher priority). What is the total Turnaround Time for process P1 after being interrupted?",
    algorithm: "Priority Scheduling (Preemptive)",
    scenario: [
      { process: "P1", arrival: 0, burst: 8, priority: 3 },
      { process: "P2", arrival: 1, burst: 3, priority: 1 },
      { process: "P3", arrival: 2, burst: 4, priority: 2 }
    ],
    options: [
      { id: 'A', text: "8 ms", isCorrect: false },
      { id: 'B', text: "11 ms", isCorrect: false },
      { id: 'C', text: "15 ms", isCorrect: true },
      { id: 'D', text: "16 ms", isCorrect: false }
    ]
  }
];

export default function Module4Quiz() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<AnswerOption | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizData[currentQuestionIdx];

  // Determine if the current question's scenario uses the priority field
  const hasPriorityColumn = currentQuestion.scenario.some(proc => proc.priority !== undefined);

  const handleSelectOption = (option: AnswerOption) => {
    if (selectedOption) return; 
    
    setSelectedOption(option);
    if (option.isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx + 1 < quizData.length) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedOption(null);
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <div style={{ padding: '2rem', backgroundColor: '#f6f8fa', borderRadius: '8px', border: '1px solid #d0d7de', textAlign: 'center' }}>
        <h2 style={{ color: '#1f2328' }}>Simulator Exercise Complete!</h2>
        <p style={{ fontSize: '1.2rem', color: '#57606a' }}>
          You scored <strong style={{ color: score > 3 ? '#1f883d' : '#cf222e' }}>{score}</strong> out of {quizData.length}
        </p>
        <button
          onClick={restartQuiz}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#0969da',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Retake Exercise
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #d0d7de' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e6edf3', paddingBottom: '10px' }}>
        <h2 style={{ margin: 0, color: '#1f2328', fontSize: '1.25rem' }}>CPU Scheduling Exercise</h2>
        <span style={{ color: '#57606a', fontWeight: 'bold' }}>
          Scenario {currentQuestionIdx + 1} of {quizData.length}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Left Side: Instructions */}
        <div>
          <div style={{ display: 'inline-block', padding: '6px 12px', backgroundColor: '#e1eefc', color: '#0969da', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '10px' }}>
            Algorithm: {currentQuestion.algorithm}
          </div>
          <h3 style={{ color: '#24292f', fontSize: '1.1rem', lineHeight: '1.5', marginTop: '0' }}>
            {currentQuestion.text}
          </h3>
        </div>

        {/* Right Side: Simulator Inputs Table */}
        <div style={{ backgroundColor: '#f6f8fa', border: '1px solid #d0d7de', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#f0f3f6', padding: '8px 12px', fontWeight: 'bold', borderBottom: '1px solid #d0d7de', fontSize: '0.9rem', color: '#57606a' }}>
            Simulator Inputs
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #d0d7de' }}>
                <th style={{ padding: '8px' }}>Process</th>
                <th style={{ padding: '8px' }}>Arrival Time</th>
                <th style={{ padding: '8px' }}>Burst Time</th>
                {hasPriorityColumn && <th style={{ padding: '8px' }}>Priority</th>}
              </tr>
            </thead>
            <tbody>
              {currentQuestion.scenario.map((proc, i) => (
                <tr key={i} style={{ borderBottom: i === currentQuestion.scenario.length - 1 ? 'none' : '1px solid #e6edf3' }}>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>{proc.process}</td>
                  <td style={{ padding: '8px' }}>{proc.arrival}</td>
                  <td style={{ padding: '8px' }}>{proc.burst}</td>
                  {hasPriorityColumn && <td style={{ padding: '8px', fontWeight: 'bold', color: '#0969da' }}>{proc.priority ?? '-'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Answer Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {currentQuestion.options.map((option) => {
          let bgColor = '#ffffff';
          let borderColor = '#d0d7de';
          let textColor = '#24292f';

          if (selectedOption) {
            if (option.isCorrect) {
              bgColor = '#dafbe1';
              borderColor = '#1f883d';
              textColor = '#1f883d';
            } else if (selectedOption.id === option.id && !option.isCorrect) {
              bgColor = '#ffebe9';
              borderColor = '#cf222e';
              textColor = '#cf222e';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelectOption(option)}
              disabled={selectedOption !== null}
              style={{
                textAlign: 'left',
                padding: '12px 16px',
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                borderRadius: '6px',
                color: textColor,
                fontSize: '1rem',
                cursor: selectedOption ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <strong style={{ marginRight: '10px' }}>{option.id}.</strong> {option.text}
            </button>
          );
        })}
      </div>

      {/* Feedback & Next Button */}
      {selectedOption && (
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: selectedOption.isCorrect ? '#dafbe1' : '#ffebe9', borderRadius: '6px', border: `1px solid ${selectedOption.isCorrect ? '#c3e6cb' : '#f9cbd0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, color: selectedOption.isCorrect ? '#1f883d' : '#cf222e' }}>
            {selectedOption.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </h4>
          
          <button
            onClick={handleNext}
            style={{
              padding: '8px 20px',
              backgroundColor: '#24292f',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {currentQuestionIdx + 1 === quizData.length ? 'See Results' : 'Next Scenario ➔'}
          </button>
        </div>
      )}
    </div>
  );
}