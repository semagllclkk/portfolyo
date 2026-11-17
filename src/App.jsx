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

  // Projeler bölümündeki tür filtresi
  const [filter, setFilter] = useState(null)

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
        <Skills />
        <Contact />
      </main>

      <Footer />

    </>
  )
}
