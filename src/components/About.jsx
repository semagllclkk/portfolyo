import { personal, education } from '../data'
import { useReveal } from '../hooks/useReveal'

export default function About() {
  const ref = useReveal()

  return (
    <section id="about" className="section" ref={ref}>
      <div className="about-grid">
        <div className="about-left reveal-left">
          <h2 className="section-title">Hakkımda</h2>
          <div className="accent-line" />
        </div>

        <div className="about-right reveal-right">
          {personal.bio.map((p, i) => (
            <p key={i} className={`about-text${i === 0 ? ' lead' : ''}`}>{p}</p>
          ))}

          {/* Eğitim kartı */}
          <div className="edu-card reveal-scale" style={{'--delay': '.2s'}}>
            <div className="edu-badge">Eğitim</div>
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
        </div>
      </div>
    </section>
  )
}
