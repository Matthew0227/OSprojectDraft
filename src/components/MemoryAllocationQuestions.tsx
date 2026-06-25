import React, { useState } from 'react';

// Define types for the quiz structure
interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  rationale: string;
}

interface Question {
  id: number;
  text: string;
  options: AnswerOption[];
}

const quizData: Question[] = [
  {
    id: 1,
    text: "Q1) At Time 0, the system attempts to load the jobs in order. What is the size of the remaining available memory hole at the end of the physical memory after the initial successful allocations?",
    options: [
      { id: 'A', text: "16K", isCorrect: false, rationale: "" },
      { id: 'B', text: "26K", isCorrect: true, rationale: "The OS takes 40K, leaving 216K. Job 1 (60K), Job 2 (100K), and Job 3 (30K) are loaded, using 190K. 216K - 190K leaves a 26K hole." },
      { id: 'C', text: "40K", isCorrect: false, rationale: "" },
      { id: 'D', text: "0K", isCorrect: false, rationale: "" }
    ]
  },
  {
    id: 2,
    text: "Q2) At Time 1, Job 1 (burst time = 1) finishes and releases its 60K of memory. Iff WITHOUT compaction, which of the following describes the resulting allocation for the waiting jobs (Job 4: 70K, Job 5: 50K)?",
    options: [
      { id: 'A', text: "Job 4 is allocated to memory because it is next in the queue.", isCorrect: false, rationale: "" },
      { id: 'B', text: "Both Job 4 and Job 5 are allocated to memory.", isCorrect: false, rationale: "" },
      { id: 'C', text: "Neither job can be allocated until Job 2 finishes.", isCorrect: false, rationale: "" },
      { id: 'D', text: "Job 5 is allocated to the new 60K hole, while Job 4 remains in the queue.", isCorrect: true, rationale: "Job 4 experiences external fragmentation and is skipped. Job 5 only needs 50K, so it successfully fits into the freed 60K hole." }
    ]
  },
  {
    id: 3,
    text: "Q3) Still looking at Time 1 (after Job 1 releases 60K), what is the reason Job 4 fails to load in the system without compaction?",
    options: [
      { id: 'A', text: "It suffers from external fragmentation.", isCorrect: true, rationale: "The total free memory is 86K (60K from Job 1 + 26K remaining at the end), which is technically enough for the 70K job, but the space is not contiguous." },
      { id: 'B', text: "It suffers from internal fragmentation.", isCorrect: false, rationale: "" },
      { id: 'C', text: "Job 5 has a higher priority.", isCorrect: false, rationale: "" },
      { id: 'D', text: "The OS restricts memory access during Time 1.", isCorrect: false, rationale: "" }
    ]
  },
  {
    id: 4,
    text: "Q4) Now assume the system uses COMPACTION. At Time 1, after Job 1 finishes, the OS immediately compacts the memory. What is the size of the single contiguous free memory hole created before loading the next job?",
    options: [
      { id: 'A', text: "60K", isCorrect: false, rationale: "" },
      { id: 'B', text: "70K", isCorrect: false, rationale: "" },
      { id: 'C', text: "86K", isCorrect: true, rationale: "Compaction merges the 60K hole (Job 1) and the 26K hole (at the end of memory) into an 86K block." },
      { id: 'D', text: "116K", isCorrect: false, rationale: "" }
    ]
  },
  {
    id: 5,
    text: "Q5) In the system WITH compaction, after the memory is consolidated into a single large hole at Time 1, what is the resulting state of the input queue?",
    options: [
      { id: 'A', text: "Job 4 is loaded, and Job 5 remains in the queue.", isCorrect: true, rationale: "Job 4 (70K) takes up space in the 86K hole, leaving only 16K. Job 5 (50K) cannot fit in the remaining 16K and must wait." },
      { id: 'B', text: "Both Job 4 and Job 5 are loaded.", isCorrect: false, rationale: "" },
      { id: 'C', text: "Job 5 is loaded, and Job 4 remains in the queue.", isCorrect: false, rationale: "" },
      { id: 'D', text: "Neither job is loaded because compaction locks the queue.", isCorrect: false, rationale: "" }
    ]
  }
];

export default function Module5Quiz() {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<AnswerOption | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quizData[currentQuestionIdx];

  const handleSelectOption = (option: AnswerOption) => {
    // Prevent changing answer after selection
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
        <h2 style={{ color: '#1f2328' }}>Quiz Complete!</h2>
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
          Retake Quiz
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #d0d7de' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #e6edf3', paddingBottom: '10px' }}>
        <h2 style={{ margin: 0, color: '#1f2328', fontSize: '1.25rem' }}>Quiz</h2>
        <span style={{ color: '#57606a', fontWeight: 'bold' }}>
          Question {currentQuestionIdx + 1} of {quizData.length}
        </span>
      </div>

      {/* Scenario Context Box */}
      <div style={{ backgroundColor: '#f6f8fa', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #0969da', marginBottom: '20px', fontSize: '0.9rem', color: '#24292f' }}>
        <strong>Parameters:</strong><br/>
        • Waiting Queue (arrived T=0): J1(60K), J2(100K), J3(30K), J4(70K), J5(50K)<br/>
        • Burst Time = Job ID (e.g., Job 1 runs for 1 burst time)<br/>
        • First-Fit
      </div>

      <h3 style={{ color: '#24292f', fontSize: '1.1rem', marginBottom: '20px', lineHeight: '1.5' }}>
        {currentQuestion.text}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {currentQuestion.options.map((option) => {
          let bgColor = '#ffffff';
          let borderColor = '#d0d7de';
          let textColor = '#24292f';

          // Apply styles if the user has selected an answer
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
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: selectedOption.isCorrect ? '#dafbe1' : '#ffebe9', borderRadius: '6px', border: `1px solid ${selectedOption.isCorrect ? '#c3e6cb' : '#f9cbd0'}` }}>
          <h4 style={{ margin: '0 0 8px 0', color: selectedOption.isCorrect ? '#1f883d' : '#cf222e' }}>
            {selectedOption.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </h4>
          <p style={{ margin: 0, color: '#24292f', fontSize: '0.95rem', lineHeight: '1.4' }}>
            {selectedOption.rationale}
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
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
              {currentQuestionIdx + 1 === quizData.length ? 'See Results' : 'Next Question ➔'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}