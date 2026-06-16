import Link from 'next/link'
import Head from 'next/head'

export default function Module6(){
  return (
    <>
      <Head><title>Module 6 — Virtual Memory</title></Head>
      <main style={{fontFamily:'Inter, system-ui, Arial', padding:'2rem', maxWidth:900}}>
        <h1>Module 6: Virtual Memory</h1>
        <ul>
          <li>Concepts of virtual memory</li>
          <li>Page tables and multi-level tables</li>
          <li>Page replacement algorithms</li>
          <li>Thrashing and working set model</li>
        </ul>
        <p>Placeholder content — add examples and exercises.</p>
        <p><Link href="/">← Back to modules</Link></p>
      </main>
    </>
  )
}
