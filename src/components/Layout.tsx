import React from 'react'
import Navbar from './Navbar'

export default function Layout({children}:{children:React.ReactNode}){
  return (
    <div style={{fontFamily:'Inter, system-ui, Arial', minHeight:'100vh', display:'flex', flexDirection:'column'}}>
      <header>
        <Navbar />
      </header>
      <main style={{flex:1, padding:'2rem', maxWidth:1000, margin:'0 auto', width:'100%'}}>
        {children}
      </main>
      <footer style={{borderTop:'3px solid #f39c12', background:'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', padding:'2rem', textAlign:'center', marginTop:'auto'}}>
        <div style={{maxWidth:1000, margin:'0 auto'}}>
          <p style={{margin:'0 0 0.5rem 0', color:'#fff', fontWeight:'500'}}>🐐 OS Goat Learning — Collaborative Operating Systems Educational Project</p>
          <small style={{color:'#bbb'}}>Master CPU Scheduling, Memory Management, Virtual Memory & Disk Management</small>
        </div>
      </footer>
    </div>
  )
}
