import { useState, useEffect } from 'react'
import { personal } from '../data'
import memeImage      from '../assets/meme.png'
import memeLightImage from '../assets/meme-light.png'

// "Yazılım Geliştirici & Yapay Zeka Meraklısı" → ikinci kısmı pembe vurgula
function AnimatedRole({ text }) {
  const sep = text.indexOf('&')
  if (sep === -1) return <p className="hero-role">{text}</p>
  const before = text.slice(0, sep + 1).trim()
  const after  = text.slice(sep + 1).trim()

  return (
    <p className="hero-role">
      {before}{' '}
      <span className="hero-role-highlight">{after}</span>
    </p>
  )
}

// data-theme değişikliklerini izleyen hook
function useTheme() {
  const [isLight, setIsLight] = useState(
    () => document.documentElement.getAttribute('data-theme') === 'light'
  )

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsLight(document.documentElement.getAttribute('data-theme') === 'light')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  return isLight
}

export default function Hero() {
  const isLight = useTheme()

  return (
    <section id="hero" className="hero">
      <div className="hero-bg-glow" />

      <div className="hero-content">
        <p className="hero-eyebrow">Merhaba, ben</p>

        <h1 className="hero-name">
          <span className="name-regular">{personal.nameFirst}</span>
          <span className="name-italic">{personal.nameLast}</span>
        </h1>

        <AnimatedRole text={personal.role} />

        <div className="hero-divider" />

        <p className="hero-tagline">{personal.tagline}</p>

        <div className="hero-cta">
          <a href="#works" className="btn-primary">Projeleri Gör</a>
          <a href="#contact" className="btn-ghost">İletişime Geç</a>
        </div>

        <div className="hero-socials">
          <a
            href={personal.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-link"
            aria-label="GitHub"
          >
            GitHub
          </a>
          <span className="social-dot">·</span>
          <a
            href={personal.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-link"
            aria-label="LinkedIn"
          >
            LinkedIn
          </a>
          <span className="social-dot">·</span>
          <a
            href={personal.contact.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-social-link"
            aria-label="Medium"
          >
            Medium
          </a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-meme-wrapper">
          <img
            key={isLight ? 'light' : 'dark'}
            src={isLight ? memeLightImage : memeImage}
            alt="it works on my machine — shipping to prod anyway"
            className={`hero-meme${isLight ? ' hero-meme-light' : ''}`}
          />
          <div className="meme-glow" />
        </div>
      </div>

      <div className="scroll-hint">
        <div className="scroll-line" />
        <span>Kaydır</span>
      </div>
    </section>
  )
}
