import Link from 'next/link'
import Head from 'next/head'

export default function Module7(){
  return (
    <>
      <Head><title>Module 7 — Mass Storage Management</title></Head>
      <main style={{fontFamily:'Inter, system-ui, Arial', padding:'2rem', maxWidth:900}}>
        <h1>Module 7: Mass Storage Management</h1>
        <ul>
          <li>Disk structure and scheduling</li>
          <li>RAID levels and trade-offs</li>
          <li>File systems and storage hierarchy</li>
          <li>Backup and recovery basics</li>
        </ul>
        <p>Placeholder content — add diagrams, demos, and quizzes.</p>
        <p><Link href="/">← Back to modules</Link></p>
      </main>
    </>
  )
}
