import { useState, useEffect, useRef } from 'react'
import { useLang } from '../i18n'
import Meme from './Meme'
import memeImage from '../assets/meme.webp'
import memeLightImage from '../assets/meme-light.webp'

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
  const onDoneRef = useRef(onDone)
  useEffect(() => { onDoneRef.current = onDone })

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), startDelay)
    return () => clearTimeout(t)
  }, [startDelay])

  useEffect(() => {
    if (!started) return
    if (idxRef.current >= text.length) { setDone(true); onDoneRef.current?.(); return }
    const interval = setInterval(() => {
      idxRef.current += 1
      setDisplayed(text.slice(0, idxRef.current))
      if (idxRef.current >= text.length) {
        clearInterval(interval)
        setDone(true)
        onDoneRef.current?.()
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
function RpgLines({ lines }) {
  const [phase, setPhase] = useState(0) // 0=bekle, 1=isim, 2=bolum, 3=durum

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
  const { lang, c } = useLang()
  const { personal } = c

  return (
    <section id="hero" className="hero">
      <div className="hero-bg-glow" />

      {/* SOL — İçerik */}
      <div className="hero-content">
        <p className="hero-eyebrow">{c.ui.eyebrow}</p>

        <h1 className="hero-name">
          <span className="name-pixel">{personal.nameFirst}</span>
          <span className="name-pixel name-pixel-last">{personal.nameLast}</span>
        </h1>

        <p className="hero-role">
          {personal.roleLead}{' '}
          <span className="hero-role-highlight">{personal.roleHighlight}</span>
        </p>

        <div className="hero-divider" />

        <p className="hero-tagline">{personal.tagline}</p>

        <div className="hero-cta">
          <a href="#works" className="btn-primary">{c.ui.ctaProjects}</a>
          <a href="#contact" className="btn-ghost">{c.ui.ctaContact}</a>
          <a href={personal.cv} className="btn-ghost btn-cv" download="Sema-Gul-Celik-CV.pdf">
            {c.ui.ctaCv} <span aria-hidden="true">↓</span>
          </a>
        </div>

        <div className="hero-socials">
          <a href={personal.contact.github} target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label="GitHub">GitHub</a>
          <span className="social-dot">·</span>
          <a href={personal.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label="LinkedIn">LinkedIn</a>
          <span className="social-dot">·</span>
          <a href={personal.contact.medium} target="_blank" rel="noopener noreferrer" className="hero-social-link" aria-label="Medium">Medium</a>
        </div>

        <Meme meme={c.memes.heroToast} className="meme-hero-toast" reveal={false} />
      </div>

      {/* SAĞ — RPG Karakter Kartı */}
      <div className="hero-visual">
        <div className="hero-card-wrap">
          <Meme meme={c.memes.hero} className="meme-hero-hud" reveal={false} />
          <div className="rpg-card">
            {/* Piksel köşe süslemeleri */}
            <span className="rpg-corner rpg-corner-tl" />
            <span className="rpg-corner rpg-corner-tr" />
            <span className="rpg-corner rpg-corner-bl" />
            <span className="rpg-corner rpg-corner-br" />

            {/* Üst başlık şeridi */}
            <div className="rpg-card-header">
              <span className="rpg-card-label">{c.ui.rpgHeader}</span>
              <span className="rpg-blink">●</span>
            </div>

            {/* Karakter görseli */}
            <div className="rpg-portrait">
              <img
                key={isLight ? 'light' : 'dark'}
                src={isLight ? memeLightImage : memeImage}
                alt={c.ui.memeAlt}
                className="rpg-portrait-img"
              />
              <div className="rpg-portrait-glow" />
            </div>

            {/* Bilgi satırları */}
            {/* Dil değişince satırlar baştan yazılsın */}
            <RpgLines key={lang} lines={c.ui.rpgLines} />
          </div>
        </div>
      </div>

    </section>
  )
}
