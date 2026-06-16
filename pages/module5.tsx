import Link from 'next/link'
import Head from 'next/head'

export default function Module5(){
  return (
    <>
      <Head><title>Module 5 — Memory Management</title></Head>
      <main style={{fontFamily:'Inter, system-ui, Arial', padding:'2rem', maxWidth:900}}>
        <h1>Module 5: Memory Management</h1>
        <ul>
          <li>Contiguous and non-contiguous allocation</li>
          <li>Paging and segmentation</li>
          <li>Fragmentation</li>
          <li>Memory allocation algorithms</li>
        </ul>
        <p>Placeholder content — add slides, diagrams, and exercises.</p>
        <p><Link href="/">← Back to modules</Link></p>
      </main>
    </>
  )
}
