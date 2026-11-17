import { useReveal } from '../hooks/useReveal'
import { useLang } from '../i18n'
import semaPhoto from '../assets/sema.webp'

export default function About() {
  const ref = useReveal()
  const { c } = useLang()
  const { personal } = c

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
          </div>
        </div>

        {/* Sağ sütun — içerik */}
        <div className="about-right reveal-right">
          {personal.bio.map((p, i) => (
            <p key={i} className={`about-text${i === 0 ? ' lead' : ''}`}>{p}</p>
          ))}

          <dl className="fact-sheet reveal-scale" style={{'--delay': '.2s'}}>
            {personal.facts.map(f => (
              <div key={f.label} className="fact-row">
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
