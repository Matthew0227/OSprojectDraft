'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar(){
  const [showModulesDropdown, setShowModulesDropdown] = useState(false)

  const primaryBlue = '#1e40af'
  const primaryGold = '#f39c12'
  const darkCharcoal = '#2c3e50'
  const lightGray = '#f8f9fa'

  return (
    <nav style={{
      display:'flex',
      justifyContent:'space-between',
      alignItems:'center',
      padding:'1rem 2rem',
      background: `linear-gradient(135deg, ${darkCharcoal} 0%, #34495e 100%)`,
      borderBottom: `3px solid ${primaryGold}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Logo & Site Title */}
      <Link href="/" style={{display:'flex', alignItems:'center', gap:'0.75rem', textDecoration:'none', color:'inherit'}}>
        <img src="/images/Goat logo.png" alt="OS Goat Logo" style={{height:45, width:'auto', filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'}} />
        <span style={{fontSize:'1.3rem', fontWeight:'bold', color:'#fff', letterSpacing:'0.5px', textShadow:'0 1px 3px rgba(0,0,0,0.3)'}}>OS Goat</span>
      </Link>

      {/* Navigation Links */}
      <div style={{display:'flex', gap:'2rem', alignItems:'center', flex:1, justifyContent:'flex-end'}}>
        <Link href="/" style={{
          textDecoration:'none',
          color:'#fff',
          cursor:'pointer',
          fontSize:'1rem',
          fontWeight:'500',
          padding:'0.5rem 1rem',
          borderRadius:'4px',
          transition:'all 0.3s ease',
          border:'2px solid transparent'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(243, 156, 18, 0.2)'
          e.currentTarget.style.borderColor = primaryGold
        }} onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'transparent'
        }}>
          Home
        </Link>

        {/* Modules Dropdown */}
        <div style={{position:'relative'}}>
          <button 
            onClick={() => setShowModulesDropdown(!showModulesDropdown)}
            style={{
              background:'rgba(243, 156, 18, 0.2)',
              border:`2px solid ${primaryGold}`,
              color:'#fff',
              cursor:'pointer',
              fontSize:'1rem',
              fontWeight:'500',
              padding:'0.5rem 1rem',
              borderRadius:'4px',
              transition:'all 0.3s ease',
              display:'flex',
              alignItems:'center',
              gap:'0.5rem'
            }} onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(243, 156, 18, 0.35)'
            }} onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(243, 156, 18, 0.2)'
            }}
          >
            Modules
            <span style={{fontSize:'0.75rem'}}>▼</span>
          </button>
          {showModulesDropdown && (
            <div style={{
              position:'absolute',
              top:'calc(100% + 0.5rem)',
              right:0,
              background:'#fff',
              border:`2px solid ${primaryGold}`,
              borderRadius:'6px',
              boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
              padding:'0.5rem 0',
              minWidth:'240px',
              zIndex:10
            }}>
              <Link href="/module4" style={{display:'block', padding:'0.75rem 1rem', textDecoration:'none', color:darkCharcoal, borderBottom:`1px solid ${lightGray}`, transition:'all 0.2s ease'}} onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(30, 64, 175, 0.1)'
                e.currentTarget.style.color = primaryBlue
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = darkCharcoal
              }}>
                <strong>Module 4:</strong> CPU Scheduling
              </Link>
              <Link href="/module5" style={{display:'block', padding:'0.75rem 1rem', textDecoration:'none', color:darkCharcoal, borderBottom:`1px solid ${lightGray}`, transition:'all 0.2s ease'}} onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(30, 64, 175, 0.1)'
                e.currentTarget.style.color = primaryBlue
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = darkCharcoal
              }}>
                <strong>Module 5:</strong> Memory Management
              </Link>
              <Link href="/module6" style={{display:'block', padding:'0.75rem 1rem', textDecoration:'none', color:darkCharcoal, borderBottom:`1px solid ${lightGray}`, transition:'all 0.2s ease'}} onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(30, 64, 175, 0.1)'
                e.currentTarget.style.color = primaryBlue
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = darkCharcoal
              }}>
                <strong>Module 6:</strong> Virtual Memory
              </Link>
              <Link href="/module7" style={{display:'block', padding:'0.75rem 1rem', textDecoration:'none', color:darkCharcoal, transition:'all 0.2s ease'}} onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(30, 64, 175, 0.1)'
                e.currentTarget.style.color = primaryBlue
              }} onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = darkCharcoal
              }}>
                <strong>Module 7:</strong> Mass Storage
              </Link>
            </div>
          )}
        </div>

        <Link href="/about" style={{
          textDecoration:'none',
          color:'#fff',
          cursor:'pointer',
          fontSize:'1rem',
          fontWeight:'500',
          padding:'0.5rem 1rem',
          borderRadius:'4px',
          transition:'all 0.3s ease',
          border:'2px solid transparent'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(243, 156, 18, 0.2)'
          e.currentTarget.style.borderColor = primaryGold
        }} onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'transparent'
        }}>
          About
        </Link>

        <Link href="/contributors" style={{
          textDecoration:'none',
          color:'#fff',
          cursor:'pointer',
          fontSize:'1rem',
          fontWeight:'500',
          padding:'0.5rem 1rem',
          borderRadius:'4px',
          transition:'all 0.3s ease',
          border:'2px solid transparent'
        }} onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(243, 156, 18, 0.2)'
          e.currentTarget.style.borderColor = primaryGold
        }} onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.borderColor = 'transparent'
        }}>
          Contributors
        </Link>
      </div>
    </nav>
  )
}
