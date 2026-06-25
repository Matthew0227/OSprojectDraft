import Link from 'next/link'
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>GoatOS Learning — Operating Systems Modules</title>
      </Head>
      <main style={{fontFamily:'Inter, system-ui, Arial'}}>
        <div style={{background: `linear-gradient(135deg, #2c3e50 0%, #34495e 100%)`, padding:'2rem', borderRadius:'8px', marginTop:'2rem', borderLeft:`5px solid #f39c12`}}>
          <h2 style={{fontSize:'1.25rem', fontWeight:'bold', margin:'0 0 1rem 0', color:'#fff'}}>Welcome to GoatOS Learning</h2>
          <p style={{fontSize:'1.1rem', color:'#bbb', margin:0}}>Master core Operating Systems concepts through interactive modules, diagrams, and visualizations.</p>
        </div>

        <h2 style={{marginTop:'2rem', marginBottom:'1.5rem', color:'#2c3e50', borderBottom:'3px solid #f39c12', paddingBottom:'0.5rem'}}>Learning Modules</h2>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1.5rem'}}>
          <Link href="/module4" style={{textDecoration:'none', color:'inherit', padding:'1.5rem', border:'1px solid #e6edf3', borderRadius:'8px', background:'#fff', cursor:'pointer', transition:'all 0.3s', borderTop:`4px solid #f39c12`}} onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(44, 62, 80, 0.15)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }} onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            <div style={{display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'1.25rem', fontWeight:'bold', marginBottom:'0.5rem'}}>
              <img src="/images/module icon.png" alt="Module Icon" style={{height:'2rem', width:'auto'}} />
              Module 4: CPU Scheduling
            </div>
            <p style={{color:'#666', margin:0}}>Learn FCFS, SJF, Round Robin, Priority Scheduling, and more advanced algorithms.</p>
          </Link>
          <Link href="/module5" style={{textDecoration:'none', color:'inherit', padding:'1.5rem', border:'1px solid #e6edf3', borderRadius:'8px', background:'#fff', cursor:'pointer', transition:'all 0.3s', borderTop:`4px solid #f39c12`}} onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(44, 62, 80, 0.15)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }} onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            <div style={{display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'1.25rem', fontWeight:'bold', marginBottom:'0.5rem'}}>
              <img src="/images/module icon.png" alt="Module Icon" style={{height:'2rem', width:'auto'}} />
              Module 5: Memory Management
            </div>
            <p style={{color:'#666', margin:0}}>Understand address binding, paging, swapping, and memory allocation strategies.</p>
          </Link>
          <Link href="/module6" style={{textDecoration:'none', color:'inherit', padding:'1.5rem', border:'1px solid #e6edf3', borderRadius:'8px', background:'#fff', cursor:'pointer', transition:'all 0.3s', borderTop:`4px solid #f39c12`}} onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(44, 62, 80, 0.15)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }} onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            <div style={{display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'1.25rem', fontWeight:'bold', marginBottom:'0.5rem'}}>
              <img src="/images/module icon.png" alt="Module Icon" style={{height:'2rem', width:'auto'}} />
              Module 6: Virtual Memory
            </div>
            <p style={{color:'#666', margin:0}}>Explore demand paging, page replacement algorithms, and frame allocation.</p>
          </Link>
          <Link href="/module7" style={{textDecoration:'none', color:'inherit', padding:'1.5rem', border:'1px solid #e6edf3', borderRadius:'8px', background:'#fff', cursor:'pointer', transition:'all 0.3s', borderTop:`4px solid #f39c12`}} onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(44, 62, 80, 0.15)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }} onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}>
            <div style={{display:'flex', alignItems:'center', gap:'0.75rem', fontSize:'1.25rem', fontWeight:'bold', marginBottom:'0.5rem'}}>
              <img src="/images/module icon.png" alt="Module Icon" style={{height:'2rem', width:'auto'}} />
              Module 7: Mass Storage Management
            </div>
            <p style={{color:'#666', margin:0}}>Master disk structure, disk scheduling algorithms, and I/O management.</p>
          </Link>
        </div>

        <div style={{marginTop:'3rem', padding:'2rem', background:'linear-gradient(135deg, #2c3e50 0%, #3f240d 100%)', borderRadius:'8px', borderLeft:'4px solid #2c3e50'}}>
          <h3 style={{marginTop:0, color:'#fff'}}>How to Use This Platform</h3>
          <ul style={{color:'#fff'}}>
            <li>Select a module from above or use the Modules dropdown in the navigation</li>
            <li>Each module contains comprehensive lessons with diagrams and visualizations</li>
            <li>Interactive simulators help you understand algorithm behavior in real-time</li>
            <li>Progress through concepts sequentially for best learning outcomes</li>
          </ul>
        </div>
      </main>
    </>
  )
}
