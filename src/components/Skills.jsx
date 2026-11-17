import { useReveal } from '../hooks/useReveal'
import { useLang } from '../i18n'

export default function Skills({ onPick }) {
  const ref = useReveal()
  const { c } = useLang()
  const { skills, projects } = c

  const usedIn = name => projects.filter(p => p.tags.includes(name)).length

  return (
    <section id="skills" className="section" ref={ref}>

      <div className="skills-layout">
        <div className="skills-left reveal-left">
          <h2 className="section-title">{c.ui.skillsTitle[0]}<br />{c.ui.skillsTitle[1]}</h2>
          <p className="skills-intro">{c.ui.skillsIntro}</p>
        </div>

        <div className="skills-right reveal-right">
          {skills.map((group, gi) => (
            <div
              key={group.category}
              className="skill-group reveal-child"
              style={{ '--delay': `${gi * 0.08}s` }}
            >
              <h3 className="skill-group-title">{group.category}</h3>
              <div className="skill-tags">
                {group.items.map(item => {
                  const n = usedIn(item)
                  return n ? (
                    <button
                      key={item}
                      type="button"
                      className="skill-tag linked"
                      aria-label={c.ui.skillShow(item, n)}
                      onClick={() => onPick(item)}
                    >
                      {item}<span className="skill-n" aria-hidden="true">{n}</span>
                    </button>
                  ) : (
                    <span key={item} className="skill-tag">{item}</span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
