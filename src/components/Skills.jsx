import { skills } from '../data'
import { useReveal } from '../hooks/useReveal'

export default function Skills() {
  const ref = useReveal()

  return (
    <section id="skills" className="section" ref={ref}>
      <div className="section-label">— 04</div>

      <div className="skills-layout">
        <div className="skills-left reveal-left">
          <h2 className="section-title">Beceriler<br />& Araçlar</h2>
          <p className="skills-intro">
            Öğrenmeyi hiç bırakmadım,<br />bırakmayacağım da.
          </p>
        </div>

        <div className="skills-right reveal-right">
          {skills.map((group, gi) => (
            <div
              key={group.category}
              className="skill-group reveal-child"
              style={{ '--delay': `${gi * 0.1}s` }}
            >
              <h4 className="skill-group-title">{group.category}</h4>
              <div className="skill-tags">
                {group.items.map(item => (
                  <span key={item} className="skill-tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
