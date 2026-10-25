import { useReveal } from '../hooks/useReveal'
import { useLang } from '../i18n'
import Meme from './Meme'
import semaPhoto from '../assets/sema.webp'

export default function About() {
  const ref = useReveal()
  const { c } = useLang()
  const { personal, education } = c

  return (
    <section id="about" className="section" ref={ref}>
      <div className="about-grid">

        {/* Sol sütun — başlık + fotoğraf */}
        <div className="about-left reveal-left">
          <h2 className="section-title">{c.ui.aboutTitle}</h2>

          {/* Fotoğraf kartı */}
          <div className="about-photo-wrap">
            <div className="about-photo-border">
              <img
                src={semaPhoto}
                alt="Sema Gül Çelik"
                className="about-photo"
              />
            </div>
            <div className="about-photo-glow" />
          </div>
        </div>

        {/* Sağ sütun — içerik */}
        <div className="about-right reveal-right">
          {personal.bio.map((p, i) => (
            <p key={i} className={`about-text${i === 0 ? ' lead' : ''}`}>{p}</p>
          ))}

          {/* Eğitim kartı */}
          <div className="edu-card reveal-scale" style={{'--delay': '.2s'}}>
            <div className="edu-badge">{education.badge}</div>
            <div className="edu-body">
              <h3 className="edu-degree">{education.degree}</h3>
              <p className="edu-uni">{education.university} — {education.city}</p>
              <p className="edu-period">{education.period}</p>
            </div>
          </div>

          <div className="about-stats">
            {personal.stats.map((s, i) => (
              <div key={i} className="stat-item">
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>

          <Meme meme={c.memes.about} className="meme-about" />
        </div>
      </div>
    </section>
  )
}
