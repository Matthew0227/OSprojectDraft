import Link from 'next/link'
import Head from 'next/head'

export default function Module4(){
  return (
    <>
      <Head><title>Module 4 — CPU Scheduling</title></Head>
      <main style={{fontFamily:'Inter, system-ui, Arial', padding:'2rem', maxWidth:900}}>
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
        <p><Link href="/">← Back to modules</Link></p>
      </main>
    </>
  )
}
