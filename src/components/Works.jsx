import { useReveal } from '../hooks/useReveal'
import { useLang } from '../i18n'
import { projectKinds } from '../data'
import ProjectCover from './ProjectCover'

function ProjectCard({ project, index, liveLabel, hidden, activeTech }) {
  return (
    <article
      className={`work-card${project.featured ? ' featured' : ''} reveal-child`}
      style={{ '--delay': `${index * 0.06}s` }}
      hidden={hidden}
    >
      <div
        className={`card-img-area${project.photoFit === 'contain' ? ' is-logo' : ''}`}
        style={project.photoBg ? { background: project.photoBg } : undefined}
      >
        {project.photo ? (
          <img src={project.photo} alt={project.title} loading="lazy" />
        ) : (
          <ProjectCover type={project.cover} />
        )}
      </div>

      <div className="card-info">
        <h3 className="card-title">{project.title}</h3>
        <p className="card-subtitle">{project.subtitle}</p>
        <p className="card-desc">{project.description}</p>
        <div className="card-foot">
          <ul className="card-tags-row">
            {project.tags.map(t => (
              <li key={t} className={`card-tag${t === activeTech ? ' on' : ''}`}>{t}</li>
            ))}
          </ul>
          <div className="card-links">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="card-link">
                GitHub ↗
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="card-link">
                {liveLabel} ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

// filter: null | { type: 'kind' | 'tech', value }
export default function Works({ filter, setFilter }) {
  const ref = useReveal()
  const { c } = useLang()
  const projects = [...c.projects].sort((a, b) => b.featured - a.featured)

  const matches = p =>
    !filter ||
    (filter.type === 'kind' ? p.kinds.includes(filter.value) : p.tags.includes(filter.value))
  const shown = projects.filter(matches).length

  return (
    <section id="works" className="section" ref={ref}>
      <div className="works-head">
        <h2 className="section-title">{c.ui.worksTitle}</h2>

        <div className="works-filter" role="group" aria-label={c.ui.filterLabel}>
          <button
            type="button"
            className={`filter-btn${!filter ? ' on' : ''}`}
            aria-pressed={!filter}
            onClick={() => setFilter(null)}
          >
            {c.ui.filterAll} <span className="filter-n">{projects.length}</span>
          </button>
          {projectKinds.map(k => {
            const on = filter?.type === 'kind' && filter.value === k
            return (
              <button
                key={k}
                type="button"
                className={`filter-btn${on ? ' on' : ''}`}
                aria-pressed={on}
                onClick={() => setFilter(on ? null : { type: 'kind', value: k })}
              >
                {c.ui.kinds[k]}{' '}
                <span className="filter-n">{projects.filter(p => p.kinds.includes(k)).length}</span>
              </button>
            )
          })}
          {filter?.type === 'tech' && (
            <button
              type="button"
              className="filter-btn on tech"
              aria-label={`${filter.value}: ${c.ui.filterClear}`}
              onClick={() => setFilter(null)}
            >
              {filter.value} <span className="filter-n">{shown}</span> <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>
      </div>

      <div className="works-grid">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={i}
            liveLabel={c.ui.live}
            hidden={!matches(p)}
            activeTech={filter?.type === 'tech' ? filter.value : null}
          />
        ))}
      </div>
    </section>
  )
}
