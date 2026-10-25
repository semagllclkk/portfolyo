import { useReveal } from '../hooks/useReveal'
import { useLang } from '../i18n'
import Meme from './Meme'

export default function Skills() {
  const ref = useReveal()
  const { c } = useLang()
  const { skills } = c

  return (
    <section id="skills" className="section" ref={ref}>

      <div className="skills-layout">
        <div className="skills-left reveal-left">
          <h2 className="section-title">{c.ui.skillsTitle[0]}<br />{c.ui.skillsTitle[1]}</h2>
          <p className="skills-intro">
            {c.ui.skillsIntro[0]}<br />{c.ui.skillsIntro[1]}
          </p>
          <Meme meme={c.memes.skills} className="meme-skills" />
          <Meme meme={c.memes.skillsCatch} className="meme-skills" />
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
