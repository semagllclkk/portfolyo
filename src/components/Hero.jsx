import { personal } from '../data'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero-bg-glow" />

      <div className="hero-content">
        <p className="hero-eyebrow">Merhaba, ben</p>

        <h1 className="hero-name">
          <span className="name-regular">{personal.nameFirst}</span>
          <span className="name-italic">{personal.nameLast}</span>
        </h1>

        <p className="hero-role">{personal.role}</p>

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
            src="/src/assets/meme.png"
            alt="it works on my machine — shipping to prod anyway"
            className="hero-meme"
            draggable="false"
          />
          <div className="meme-glow" />
        </div>
        <div className="floating-tag tag-a">İş tekliflerine açığım</div>
        <div className="floating-tag tag-b">✦</div>
      </div>

      <div className="scroll-hint">
        <div className="scroll-line" />
        <span>Kaydır</span>
      </div>
    </section>
  )
}
