import Link from 'next/link'
import Head from 'next/head'
import PageReplacementSimulator from '../src/components/PageReplacementSimulator'
import Module6Activity from '../src/components/Module6Activity'

export default function Module6(){
  const themeColors = { primary: '#2c3e50', gold: '#f39c12', light: '#f8f9fa', border: '#e6edf3' }

  return (
    <>
      <Head><title>Module 6 — Virtual Memory</title></Head>
      <main style={{fontFamily:'Inter, system-ui, Arial', padding:'2rem', maxWidth:1200}}>
        <div style={{background: `linear-gradient(135deg, ${themeColors.primary} 0%, #34495e 100%)`, padding:'2rem', borderRadius:'8px', marginBottom:'2rem', borderLeft:`5px solid ${themeColors.gold}`}}>
          <h1 style={{color:'#fff', margin:'0 0 0.5rem 0'}}>Module 6: Virtual Memory</h1>
          <p style={{color:'#bbb', margin:0}}>Explore virtual memory, demand paging, and replacement algorithms</p>
        </div>

        <h2 style={{color:themeColors.primary, borderBottom:`3px solid ${themeColors.gold}`, paddingBottom:'0.5rem'}}>1. Review of Memory Management</h2>
        <p>Before diving into Virtual Memory, review core requirements and hardware constraints of standard memory management.</p>
        <h3>What is Required in Memory Management?</h3>
        <ul>
          <li><strong>Simultaneous Processes:</strong> Keep multiple processes in memory to optimize CPU utilization.</li>
          <li><strong>Contiguity Constraint:</strong> Traditional management requires an entire process to be loaded into physical memory before execution.</li>
        </ul>

        <h3>Address Mapping: Logical vs. Physical Memory</h3>
        <p>The CPU generates logical addresses that are dynamically mapped to physical addresses in hardware.</p>
        <div style={{textAlign:'center', margin:'1rem 0'}}>
          <img src="/images/address mapping illustration.png" alt="Address Mapping Illustration" style={{maxWidth:'60%', height:'auto', borderRadius:'4px'}} />
        </div>

        <p><strong>Base and Limit Registers:</strong> Protect processes using a base (relocation) register and a limit register. If logical address &lt; limit, add base to get the physical address; otherwise trap.</p>
        <p><strong>Paging Hardware:</strong> Breaks logical memory into pages (p) with offsets (d), translating page numbers into frames (f) via a Page Table.</p>

        <h2 style={{color:themeColors.primary, borderBottom:`3px solid ${themeColors.gold}`, paddingBottom:'0.5rem'}}>2. Introduction to Virtual Memory</h2>
        <h3>What is Virtual Memory?</h3>
        <p>Virtual Memory separates user logical memory from physical memory. Only parts of a program need be in memory for execution, saving RAM and increasing multiprogramming.</p>
        <h3>Key Characteristics &amp; Benefits</h3>
        <ul>
          <li>Massive virtual address spaces larger than physical memory.</li>
          <li>Increased multiprogramming and throughput.</li>
          <li>Reduced I/O overhead for swapping.</li>
          <li>Efficient shared memory between processes.</li>
        </ul>

        <h2 style={{color:themeColors.primary, borderBottom:`3px solid ${themeColors.gold}`, paddingBottom:'0.5rem'}}>3. Demand Paging</h2>
        <p>Demand Paging brings a page into physical memory only when it is needed.</p>
        <h3>The Lazy Pager</h3>
        <p>Lazy pager swaps in pages on reference rather than preloading an entire process.</p>
        <h3>Valid-Invalid Bit Scheme</h3>
        <ul>
          <li><strong>Valid (V):</strong> Page is present in physical memory.</li>
          <li><strong>Invalid (I):</strong> Page is either illegal or resides on disk.</li>
        </ul>
        <h3>Handling a Page Fault</h3>
        <ol>
          <li>Hardware detects invalid bit and traps to the OS.</li>
          <li>OS checks whether reference is valid or illegal.</li>
          <li>OS finds a free frame and reads the page from secondary storage into it.</li>
          <li>OS updates the page table (mark Valid) and restarts the instruction.</li>
        </ol>
        <p><strong>Pure Demand Paging:</strong> Process starts with no pages in memory; it faults until working set loads.</p>

        <h3>Performance &amp; Effective Access Time (EAT)</h3>
        <p>EAT depends on page fault rate p (0 ≤ p ≤ 1). Formula:</p>
        <p><strong>EAT = (1 - p) × ma + p × page fault service time</strong></p>
        <h4>Example</h4>
        <p>Given: ma = 5 microseconds; page fault service time = 10,000 microseconds (10 ms); p = 0.2.</p>
        <p>Calculation: EAT = (1 - 0.2) × 5 + 0.2 × 10000 = 4 + 2000 = 2004 microseconds.</p>

        <h2 style={{color:themeColors.primary, borderBottom:`3px solid ${themeColors.gold}`, paddingBottom:'0.5rem'}}>4. Page Replacement Algorithms (PRA)</h2>
        <p>When no free frames exist, choose a victim page to replace using a Page Replacement Algorithm.</p>
        <h3>Summary of Major Algorithms</h3>
        <ul>
          <li><strong>FIFO:</strong> Replace oldest page. Simple, suffers from Belady's Anomaly.</li>
          <li><strong>Optimal (OPT/MIN):</strong> Replace page not needed for longest time. Best but requires future knowledge.</li>
          <li><strong>LRU:</strong> Replace least recently used page. Effective; needs hardware support or approximations.</li>
          <li><strong>LRU Approximation (Second Chance / Clock):</strong> Use reference bit to grant second chances in a circular queue.</li>
          <li><strong>Enhanced Second Chance:</strong> Use (Reference, Dirty) bits to form 4 classes for replacement preference.</li>
          <li><strong>Counting-Based (LFU / MFU):</strong> Replace based on frequency counts (least or most frequently used).</li>
        </ul>

        <h2 style={{color:themeColors.primary, borderBottom:`3px solid ${themeColors.gold}`, paddingBottom:'0.5rem'}}>5. Page Replacement Simulator</h2>
        <p>Use the interactive simulator below to experiment with page references, frames, and replacement policies.</p>

        <h2 style={{color:themeColors.primary, borderBottom:`3px solid ${themeColors.gold}`, paddingBottom:'0.5rem'}}>6. Frame Allocation</h2>
        <p>Frames are finite; OS must allocate fairly between processes.</p>
        <ul>
          <li><strong>Minimum Allocation:</strong> Set by architecture.</li>
          <li><strong>Maximum Allocation:</strong> Limited by physical memory.</li>
          <li><strong>Balancing Act:</strong> Too few frames raises page-fault rates and cripples performance.</li>
        </ul>
        <h2 style={{color:themeColors.primary, borderBottom:`3px solid ${themeColors.gold}`, paddingBottom:'0.5rem'}}>Interactive Activity</h2>
        <p>Practice page replacement and get instant feedback on your choices.</p>        <Module6Activity />
        <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', marginTop:'2rem'}}>
          <Link href="/quiz" style={{display:'inline-block', padding:'0.75rem 1.2rem', borderRadius:'8px', background:'#0969da', color:'#fff', textDecoration:'none'}}>Take the Quiz</Link>
          <Link href="/" style={{display:'inline-block', padding:'0.75rem 1.2rem', borderRadius:'8px', border:'1px solid #0969da', color:'#0969da', textDecoration:'none'}}>← Back to modules</Link>
        </div>
      </main>
    </>
  )
}
