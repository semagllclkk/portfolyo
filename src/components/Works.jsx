import { useReveal } from '../hooks/useReveal'
import { useLang } from '../i18n'
import Meme from './Meme'

function ProjectCard({ project, index, liveLabel }) {
  return (
    <article
      className={`work-card${project.featured ? ' featured' : ''} reveal-child`}
      style={{ '--delay': `${index * 0.08}s` }}
    >
      <div
        className={`card-img-area${project.photoFit === 'contain' ? ' is-logo' : ''}`}
        style={project.photoBg ? { background: project.photoBg } : undefined}
      >
        {project.photo ? (
          <img src={project.photo} alt={project.title} loading="lazy" />
        ) : (
          <div className="card-img-placeholder">
            <span>{project.title}</span>
          </div>
        )}
        <div className="card-overlay">
          <div className="card-actions">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="card-action-btn"
              >
                GitHub ↗
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="card-action-btn primary"
              >
                {liveLabel} ↗
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="card-info">
        <div className="card-meta">
          <div className="card-tags-row">
            {project.tags.slice(0, 3).map(t => (
              <span key={t} className="card-tag">{t}</span>
            ))}
          </div>
        </div>
        <h3 className="card-title">{project.title}</h3>
        <p className="card-subtitle">{project.subtitle}</p>
        <p className="card-desc">{project.description}</p>
        {(project.github || project.live) && (
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
        )}
      </div>
    </article>
  )
}

export default function Works() {
  const ref = useReveal()
  const { c } = useLang()
  const { projects } = c
  const featured = projects.filter(p => p.featured)
  const rest = projects.filter(p => !p.featured)

  return (
    <section id="works" className="section" ref={ref}>
      <h2 className="section-title centered">{c.ui.worksTitle}</h2>
      <p className="section-sub">{c.ui.worksSub}</p>

      <Meme meme={c.memes.works} className="meme-works" />

      {/* Featured projeler — tam genişlik */}
      <div className="works-featured">
        {featured.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} liveLabel={c.ui.live} />
        ))}
      </div>

      {/* Diğer projeler — grid */}
      <div className="works-grid">
        {rest.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i + featured.length} liveLabel={c.ui.live} />
        ))}
      </div>

      <Meme meme={c.memes.worksMail} className="meme-mail-pos" />
    </section>
  )
}
