import Link from 'next/link'
import Head from 'next/head'
import DiskSchedulingSimulator from '../src/components/DiskSchedulingSimulator'
import Module7Activity from '../src/components/Module7Activity'

export default function Module7(){
  const themeColors = { primary: '#2c3e50', gold: '#f39c12', light: '#f8f9fa', border: '#e6edf3' }
  
  return (
    <>
      <Head><title>Module 7 — Mass Storage Management</title></Head>
      <main style={{fontFamily:'Inter, system-ui, Arial', padding:'2rem', maxWidth:1200}}>
        <div style={{background: `linear-gradient(135deg, ${themeColors.primary} 0%, #34495e 100%)`, padding:'2rem', borderRadius:'8px', marginBottom:'2rem', borderLeft:`5px solid ${themeColors.gold}`}}>
          <h1 style={{color:'#fff', margin:'0 0 0.5rem 0'}}>Module 7: Mass Storage Management</h1>
          <p style={{color:'#bbb', margin:0}}>Learn disk structure, I/O scheduling, and storage management</p>
        </div>

        <h2 style={{color:themeColors.primary, borderBottom:`3px solid ${themeColors.gold}`, paddingBottom:'0.5rem'}}>1. Mass-Storage &amp; Disk Structure</h2>
        <p>By the end of this module, you should be able to:</p>
        <ul>
          <li>Discuss the physical and logical structure of a disk.</li>
          <li>Explain how the OS manages disk space and allocation methods.</li>
          <li>Define and differentiate primary disk scheduling algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK).</li>
          <li>Understand disk formatting, booting, and bad-block handling.</li>
        </ul>

        <h2>1. Mass-Storage &amp; Disk Structure</h2>
        <h3>Introduction</h3>
        <p>The primary requirement of secondary storage is the ability to store vast amounts of data <strong>permanently</strong>.</p>
        <ul>
          <li><strong>Magnetic Tape:</strong> Early sequential media; slow for random access.</li>
          <li><strong>Magnetic Disks:</strong> Provide the bulk of secondary storage for modern systems.</li>
        </ul>

        <h3>Physical Composition</h3>
        <p>A magnetic disk system consists of several platters, a spindle, read/write heads, and an arm assembly.</p>
        <div style={{textAlign:'center', margin:'1.5rem 0'}}>
          <img src="/images/disk-structure.png" alt="Disk Structure Diagram" style={{maxWidth:'100%', height:'auto', borderRadius:'4px'}} />
        </div>

        <h3>Logical Geometry</h3>
        <ul>
          <li><strong>Tracks:</strong> Concentric rings on a platter surface.</li>
          <li><strong>Sectors:</strong> Subdivisions of a track.</li>
          <li><strong>Cylinder:</strong> All tracks aligned under the arm position.</li>
          <li><strong>Cluster:</strong> Group of sectors for allocation efficiency.</li>
        </ul>

        <h3>Performance Parameters</h3>
        <p>Access time = Seek time + Rotational latency + Transfer time.</p>
        <p>Design note: Movable-head systems have one head per surface and are cheaper than fixed-head designs.</p>

        <h2>2. Disk Scheduling Algorithms</h2>
        <p>Optimize disk I/O by ordering requests in the device queue.</p>
        <h3>The Benchmark Baseline</h3>
        <p><strong>Queue:</strong> 98, 183, 37, 122, 14, 124, 65, 67</p>
        <p><strong>Current Head Position:</strong> 53</p>

        <h3>1. First-Come, First-Served (FCFS)</h3>
        <p>Serve requests in arrival order.</p>
        <pre style={{background:'#f6f8fa', padding:'0.5rem', fontFamily:'monospace'}}>{`53 -> 98 = 45
98 -> 183 = 85
183 -> 37 = 146
37 -> 122 = 85
122 -> 14 = 108
14 -> 124 = 110
124 -> 65 = 59
65 -> 67 = 2
Total = 640 tracks`}</pre>
        <div style={{textAlign:'center', margin:'1rem 0'}}>
          <img src="/images/disk algorithm fcfs graph.png" alt="FCFS Algorithm Graph" style={{maxWidth:'60%', height:'auto', borderRadius:'4px'}} />
        </div>

        <h3>2. Shortest Seek Time First (SSTF)</h3>
        <pre style={{background:'#f6f8fa', padding:'0.5rem', fontFamily:'monospace'}}>{`53 -> 65 = 12
65 -> 67 = 2
67 -> 37 = 30
37 -> 14 = 23
14 -> 98 = 84
98 -> 122 = 24
122 -> 124 = 2
124 -> 183 = 59
Total = 236 tracks`}</pre>
        <div style={{textAlign:'center', margin:'1rem 0'}}>
          <img src="/images/disk algorithm ssjt graph.png" alt="SSTF Algorithm Graph" style={{maxWidth:'60%', height:'auto', borderRadius:'4px'}} />
        </div>

        <h3>3. SCAN (Elevator)</h3>
        <p>Head sweeps toward an end then reverses.</p>
        <pre style={{background:'#f6f8fa', padding:'0.5rem', fontFamily:'monospace'}}>{`53 -> 37 = 16
37 -> 14 = 23
14 -> 0 = 14
0 -> 65 = 65
65 -> 67 = 2
67 -> 98 = 31
98 -> 122 = 24
122 -> 124 = 2
124 -> 183 = 59
Total = 236 tracks`}</pre>
        <div style={{textAlign:'center', margin:'1rem 0'}}>
          <img src="/images/disk algorithm scan graph.png" alt="SCAN Algorithm Graph" style={{maxWidth:'60%', height:'auto', borderRadius:'4px'}} />
        </div>

        <h3>4. C-SCAN (Circular SCAN)</h3>
        <p>Head sweeps one way, wraps to start without servicing on return.</p>
        <pre style={{background:'#f6f8fa', padding:'0.5rem', fontFamily:'monospace'}}>{`53 -> 65 = 12
65 -> 67 = 2
67 -> 98 = 31
98 -> 122 = 24
122 -> 124 = 2
124 -> 183 = 59
183 -> 0 = 183 (wrap)
0 -> 14 = 14
14 -> 37 = 23
Total = 350 tracks`}</pre>
        <div style={{textAlign:'center', margin:'1rem 0'}}>
          <img src="/images/disk algorithm c-scan graph.png" alt="C-SCAN Algorithm Graph" style={{maxWidth:'60%', height:'auto', borderRadius:'4px'}} />
        </div>

        <h3>5. LOOK</h3>
        <p>Like SCAN but reverses at last request.</p>
        <pre style={{background:'#f6f8fa', padding:'0.5rem', fontFamily:'monospace'}}>{`53 -> 65 = 12
65 -> 67 = 2
67 -> 98 = 31
98 -> 122 = 24
122 -> 124 = 2
124 -> 183 = 59
183 -> 14 = 169
14 -> 37 = 23
Total = 322 tracks`}</pre>
        <div style={{textAlign:'center', margin:'1rem 0'}}>
          <img src="/images/disk algorithm look graph.png" alt="LOOK Algorithm Graph" style={{maxWidth:'60%', height:'auto', borderRadius:'4px'}} />
        </div>
        <h2>Summary Comparison</h2>
        <p>Totals: FCFS = 640; SSTF = 236; SCAN = 236; C-SCAN = 350; LOOK = 322.</p>
        <p>SCAN &amp; C-SCAN suit heavy loads; FCFS is fine for very low queue lengths.</p>
        <DiskSchedulingSimulator />
        <h2>Interactive Activity</h2>
        <p>Explore disk scheduling behavior with the simulator and answer applied questions.</p>
        <Module7Activity />

        <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', marginTop:'2rem'}}>
          <Link href="/quiz" style={{display:'inline-block', padding:'0.75rem 1.2rem', borderRadius:'8px', background:'#0969da', color:'#fff', textDecoration:'none'}}>Take the Quiz</Link>
          <Link href="/" style={{display:'inline-block', padding:'0.75rem 1.2rem', borderRadius:'8px', border:'1px solid #0969da', color:'#0969da', textDecoration:'none'}}>← Back to modules</Link>
        </div>
      </main>
    </>
  )
}