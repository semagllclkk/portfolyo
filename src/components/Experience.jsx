import { useReveal } from '../hooks/useReveal'
import { useLang } from '../i18n'
import Meme from './Meme'

export default function Experience() {
  const ref = useReveal()
  const { c } = useLang()
  const { experience } = c

  return (
    <section id="experience" className="section" ref={ref}>
      <h2 className="section-title">{c.ui.experienceTitle}</h2>

      <div className="exp-list">
        {experience.map((e, i) => (
          <article key={e.id} className="exp-item reveal-child" style={{ '--delay': `${i * 0.1}s` }}>
            <div className="exp-left">
              <span className="exp-type">{e.type}</span>
              <span className="exp-period">{e.period}</span>
            </div>
            <div className="exp-connector">
              <div className="exp-dot" />
              {i < experience.length - 1 && <div className="exp-line" />}
            </div>
            <div className="exp-right">
              <h3 className="exp-title">{e.title}</h3>
              <p className="exp-company">{e.company}</p>
              <p className="exp-desc">{e.description}</p>
              <div className="exp-tags">
                {e.tags.map(t => (
                  <span key={t} className="skill-tag">{t}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="meme-row">
        <Meme meme={c.memes.experienceBundle} />
        <Meme meme={c.memes.experience} />
      </div>
    </section>
  )
}
