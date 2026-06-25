import Link from 'next/link'
import Head from 'next/head'

export default function Contributors() {
  const themeColors = { primary: '#2c3e50', gold: '#f39c12', light: '#f8f9fa', border: '#e6edf3' }
  
  return (
    <>
      <Head>
        <title>Contributors — GoatOS Learning</title>
      </Head>
      <main style={{fontFamily:'Inter, system-ui, Arial', maxWidth:900, margin:'0 auto'}}>
        <div style={{background: `linear-gradient(135deg, ${themeColors.primary} 0%, #34495e 100%)`, padding:'2rem', borderRadius:'8px', marginBottom:'2rem', borderLeft:`5px solid ${themeColors.gold}`}}>
          <h1 style={{color:'#fff', margin:'0 0 0.5rem 0'}}>Contributors & Credits</h1>
          <p style={{color:'#bbb', margin:0}}>Meet the team of GoatOS Learning</p>
        </div>
        
        <h2 style={{color:themeColors.primary, borderBottom:`3px solid ${themeColors.gold}`, paddingBottom:'0.5rem'}}>Development Team</h2>
        <p>
          GoatOS Learning is built as a collaborative educational project. This platform brings together 
          educators, students, and software engineers dedicated to making Operating Systems concepts more accessible.
        </p>

        <h2>Content Contributors</h2>
        <p>
          Thank you to everyone who has contributed to the development of course materials, diagrams, 
          explanations, and interactive components that make this learning platform effective.
        </p>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem', margin:'1.5rem 0'}}>
          {[
            { name: 'John Matthew D. Javeniar', role: 'Project Lead / Frontend Developer', image: '/images/Picture 1.png' },
            { name: 'Niel Matthew T. Briones', role: 'Backend Developer / Tester', image: '/images/Picture 2.jpg' },
            { name: 'Jomark Glenn C. Maguad', role: 'Backend Developer', image: '/images/Picture 3.png' },
            { name: 'Liam Kyle C. Yasoña', role: 'Frontend Developer / Documentation Writer', image: '/images/Picture 4.jpg' }
          ].map((contributor, index) => (
            <div key={index} style={{background:'#fff', padding:'1.25rem', borderRadius:'12px', border:`1px solid ${themeColors.border}`, boxShadow:'0 6px 18px rgba(0,0,0,0.08)'}}>
              <img src={contributor.image} alt={contributor.name} style={{width:72, height:72, borderRadius:'50%', objectFit:'cover', display:'block', margin:'0 auto 1rem auto', border:'3px solid #f39c12'}} />
              <h3 style={{fontSize:'1.05rem', margin:'0 0 0.5rem 0', textAlign:'center', color:themeColors.primary}}>{contributor.name}</h3>
              <p style={{fontSize:'0.95rem', color:'#555', textAlign:'center', margin:0}}>{contributor.role}</p>
            </div>
          ))}
        </div>

        <h2>Acknowledgments</h2>
        <ul>
          <li>Built with <strong>Next.js</strong> and <strong>React</strong></li>
          <li>Inspired by classic Operating Systems textbooks and educational resources</li>
          <li>Community feedback and suggestions help continuously improve the platform</li>
        </ul>

        <h2>How to Contribute</h2>
        <p>
          We welcome contributions from educators, students, and developers! If you'd like to contribute:
        </p>
        <ul>
          <li>Improve existing content and explanations</li>
          <li>Add new visualizations and diagrams</li>
          <li>Create additional interactive simulators</li>
          <li>Suggest improvements or report issues</li>
          <li>Help with code and platform development</li>
        </ul>

        <p style={{marginTop:'2rem', padding:'1rem', background:'#f0f4ff', borderRadius:'4px'}}>
          <strong>Have ideas or feedback?</strong> Check the project repository for contribution guidelines 
          and open issues where you can help make this platform better for everyone learning Operating Systems.
        </p>

        <p style={{marginTop:'2rem'}}>
          <Link href="/" style={{color:'#f39c12', textDecoration:'none', fontWeight:'bold'}}>← Back to home</Link>
        </p>
      </main>
    </>
  )
}
