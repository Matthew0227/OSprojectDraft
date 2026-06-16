import Link from 'next/link'
import Head from 'next/head'
import GanttChartSimulator from '../src/components/GanttChartSimulator'

export default function Module4(){
  return (
    <>
      <Head><title>Module 4 — CPU Scheduling</title></Head>
      <main style={{fontFamily:'Inter, system-ui, Arial', padding:'2rem', maxWidth:1200}}>
        <h1>Module 4: CPU Scheduling</h1>
        <p>Topics:</p>
        <ul>
          <li>CPU scheduling basics</li>
          <li>Scheduling criteria</li>
          <li>Scheduling algorithms: FCFS, SJF, RR, Priority</li>
          <li>Multilevel queues and feedback</li>
        </ul>
        <h2>Learning material</h2>
        <p>Placeholder content — add lecture notes, examples, and quizzes here.</p>
        
        <h2>Interactive Simulator</h2>
        <p>Use the simulator below to understand CPU scheduling with FCFS (First-Come-First-Serve) algorithm:</p>
        <GanttChartSimulator />
        
        <p style={{marginTop:'2rem'}}><Link href="/">← Back to modules</Link></p>
      </main>
    </>
  )
}
