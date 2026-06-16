import React from 'react'
import Navbar from './Navbar'

export default function Layout({children}:{children:React.ReactNode}){
  return (
    <div style={{fontFamily:'Inter, system-ui, Arial', padding:'2rem', maxWidth:1000, margin:'0 auto'}}>
      <header>
        <Navbar />
        <hr />
      </header>
      <main>{children}</main>
      <footer style={{marginTop:40, borderTop:'1px solid #e6edf3', paddingTop:12}}>
        <small>OS Learning — Collaborative project</small>
      </footer>
    </div>
  )
}
