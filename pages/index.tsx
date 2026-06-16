import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>OS Learning — Modules</title>
      </Head>
      <main style={{fontFamily:'Inter, system-ui, Arial', padding: '2rem', maxWidth: 900}}>
        <h1>Operating Systems — Learning Modules</h1>
        <p>Select a module to view topics and learning material.</p>
        <ul>
          <li><Link href="/module4">Module 4: CPU Scheduling</Link></li>
          <li><Link href="/module5">Module 5: Memory Management</Link></li>
          <li><Link href="/module6">Module 6: Virtual Memory</Link></li>
          <li><Link href="/module7">Module 7: Mass Storage Management</Link></li>
        </ul>
      </main>
    </>
  )
}
