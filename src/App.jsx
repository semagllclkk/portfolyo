import { useRef, useState } from 'react'
import Navbar            from './components/Navbar'
import Hero              from './components/Hero'
import About             from './components/About'
import Experience        from './components/Experience'
import Works             from './components/Works'
import Skills            from './components/Skills'
import Contact           from './components/Contact'
import Footer            from './components/Footer'

import { useParticles, useCursor } from './hooks/useVisuals'

export default function App() {
  const canvasRef = useRef(null)

  useParticles(canvasRef)
  useCursor()

  // Proje filtresi: Projeler bölümündeki düğmeler ve Beceriler'deki teknolojiler ortak kullanır
  const [filter, setFilter] = useState(null)
  const showTech = (tech) => {
    setFilter({ type: 'tech', value: tech })
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById('works')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <>
      {/* Arka plan gürültü & parçacıklar */}
      <div className="bg-noise" aria-hidden="true" />
      <canvas ref={canvasRef} className="particles-canvas" aria-hidden="true" />

      <Navbar />

      <main>
        <Hero />
        <About />
        <Experience />
        <Works filter={filter} setFilter={setFilter} />
        <Skills onPick={showTech} />
        <Contact />
      </main>

      <Footer />

    </>
  )
}
