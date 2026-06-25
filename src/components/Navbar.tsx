import Link from 'next/link'

export default function Navbar(){
  return (
    <nav style={{display:'flex',gap:12,alignItems:'center',padding:'1rem 0'}}>
      <Link href="/">Home</Link>
      <Link href="/module4">Module 4</Link>
      <Link href="/module5">Module 5</Link>
      <Link href="/module6">Module 6</Link>
      <Link href="/module7">Module 7</Link>
      <Link href="/quiz">Quiz</Link>
    </nav>
  )
}
