import Link from 'next/link'
import Head from 'next/head'

export default function About() {
  const themeColors = { primary: '#2c3e50', gold: '#f39c12', light: '#f8f9fa', border: '#e6edf3' }
  
  return (
    <>
      <Head>
        <title>About — OS Goat Learning</title>
      </Head>
      <main style={{fontFamily:'Inter, system-ui, Arial', maxWidth:900, margin:'0 auto'}}>
        <div style={{background: `linear-gradient(135deg, ${themeColors.primary} 0%, #34495e 100%)`, padding:'2rem', borderRadius:'8px', marginBottom:'2rem', borderLeft:`5px solid ${themeColors.gold}`}}>
          <h1 style={{color:'#fff', margin:'0 0 0.5rem 0'}}>About OS Goat Learning</h1>
          <p style={{color:'#bbb', margin:0}}>Learn more about our mission and educational platform</p>
        </div>
        
        <h2 style={{color:themeColors.primary, borderBottom:`3px solid ${themeColors.gold}`, paddingBottom:'0.5rem'}}>Our Mission</h2>
        <p>
          OS Goat Learning is a comprehensive, interactive educational platform designed to help students master 
          fundamental Operating Systems concepts. We believe that learning complex OS topics should be accessible, 
          engaging, and supported by visual aids and interactive simulations.
        </p>

        <h2>What We Offer</h2>
        <ul>
          <li><strong>Structured Curriculum:</strong> Four core modules covering CPU Scheduling, Memory Management, Virtual Memory, and Mass Storage Management</li>
          <li><strong>Visual Diagrams:</strong> Clear, illustrative diagrams to help you understand complex concepts</li>
          <li><strong>Interactive Simulators:</strong> Real-time algorithm visualizations to see how scheduling and memory management work</li>
          <li><strong>Practical Examples:</strong> Real-world calculations and scenarios that demonstrate OS principles</li>
        </ul>

        <h2>Why "OS Goat"?</h2>
        <p>
          We chose the goat as our mascot because goats are known for their ability to navigate complex terrain and reach 
          high places. Much like goats scaling mountains, learners using this platform will climb the peaks of OS knowledge!
        </p>

        <h2>Learning Path</h2>
        <ol>
          <li><strong>Module 4: CPU Scheduling</strong> - Start with the fundamentals of process scheduling</li>
          <li><strong>Module 5: Memory Management</strong> - Understand how operating systems manage memory resources</li>
          <li><strong>Module 6: Virtual Memory</strong> - Explore advanced memory techniques and paging</li>
          <li><strong>Module 7: Mass Storage</strong> - Master disk management and I/O scheduling</li>
        </ol>

        <p style={{marginTop:'2rem'}}>
          <Link href="/" style={{color:'#f39c12', textDecoration:'none', fontWeight:'bold'}}>← Back to home</Link>
        </p>
      </main>
    </>
  )
}
