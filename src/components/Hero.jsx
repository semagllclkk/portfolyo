import { useState, useEffect, useRef } from 'react'
import { personal } from '../data'
import memeImage from '../assets/meme.png'
import memeLightImage from '../assets/meme-light.png'

// data-theme izleyici
function useTheme() {
  const [isLight, setIsLight] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'light'
  )
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    )
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return isLight
}

// Tek satır typewriter
function TypewriterLine({ text, startDelay = 0, speed = 45, onDone }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const idxRef = useRef(0)

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(t)
  }, [startDelay])

  useEffect(() => {
    if (!started) return
    if (idxRef.current >= text.length) { setDone(true); onDone?.(); return }
    const interval = setInterval(() => {
      idxRef.current += 1
      setDisplayed(text.slice(0, idxRef.current))
      if (idxRef.current >= text.length) {
        clearInterval(interval)
        setDone(true)
        onDone?.()
      }
    }, speed)
    return () => clearInterval(interval)
  }, [started, text, speed])

  return (
    <span>
      {displayed}
      {!done && <span className="rpg-caret">▮</span>}
    </span>
  )
}

// RPG info satırı — bir önceki bitmeden başlamaz
function RpgLines() {
  const [phase, setPhase] = useState(0) // 0=bekle, 1=isim, 2=bolum, 3=durum

  const lines = [
    { label: 'İSİM', value: 'Sema Gül Çelik' },
    { label: 'BÖLÜM', value: 'Bilgisayar Mühendisliği' },
    { label: 'DURUM', value: 'İş Tekliflerine Açık' },
  ]

  useEffect(() => {
    // Kısa bir başlangıç gecikmesi
    const t = setTimeout(() => setPhase(1), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="rpg-lines">
      {lines.map((line, i) => (
        <div key={line.label} className={`rpg-line${phase > i ? ' rpg-line-visible' : ''}`}>
          <span className="rpg-label">{line.label}</span>
          <span className="rpg-separator">›</span>
          <span className={`rpg-value${i === 2 ? ' rpg-value-status' : ''}`}>
            {phase === i + 1 ? (
              <TypewriterLine
                text={line.value}
                speed={i === 0 ? 60 : i === 1 ? 45 : 50}
                onDone={() => setPhase(p => p + 1)}
              />
            ) : phase > i + 1 ? (
              line.value
            ) : null}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function Hero() {
  const isLight = useTheme()

  return (
    <section id="hero" className="hero">
      <div className="hero-bg-glow" />

      {/* SOL — İçerik */}
      <div className="hero-content">
        <p className="hero-eyebrow">Merhaba, ben</p>

        <h1 className="hero-name">
          <span className="name-pixel">{personal.nameFirst}</span>
          <span className="name-pixel name-pixel-last">{personal.nameLast}</span>
        </h1>

        <p className="hero-role">
          Yazılım Geliştirici &{' '}
          <span className="hero-role-highlight">Yapay Zeka Meraklısı</span>
        </p>

        <div className="hero-divider" />

        <p className="hero-tagline">{personal.tagline}</p>

        <div className="hero-cta">
          <a href="#works" className="btn-primary">Projeleri Gör</a>
          <a href="#contact" className="btn-ghost">İletişime Geç</a>
        </div>

        <div className="hero-socials">
          <a href={personal.contact.github} target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label="GitHub">GitHub</a>
          <span className="social-dot">·</span>
          <a href={personal.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label="LinkedIn">LinkedIn</a>
          <span className="social-dot">·</span>
          <a href={personal.contact.medium} target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label="Medium">Medium</a>
        </div>
      </div>

      {/* SAĞ — RPG Karakter Kartı */}
      <div className="hero-visual">
        <div className="rpg-card">
          {/* Piksel köşe süslemeleri */}
          <span className="rpg-corner rpg-corner-tl" />
          <span className="rpg-corner rpg-corner-tr" />
          <span className="rpg-corner rpg-corner-bl" />
          <span className="rpg-corner rpg-corner-br" />

          {/* Üst başlık şeridi */}
          <div className="rpg-card-header">
            <span className="rpg-card-label">KARAKTER BİLGİSİ</span>
            <span className="rpg-blink">●</span>
          </div>

          {/* Karakter görseli */}
          <div className="rpg-portrait">
            <img
              key={isLight ? 'light' : 'dark'}
              src={isLight ? memeLightImage : memeImage}
              alt="Karakter görseli"
              className="rpg-portrait-img"
            />
            <div className="rpg-portrait-glow" />
          </div>

          {/* Bilgi satırları */}
          <RpgLines />
        </div>
      </div>

    </section>
  )
}
