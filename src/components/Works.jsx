import { projects } from '../data'
import { useReveal } from '../hooks/useReveal'

function ProjectCard({ project, index }) {
  return (
    <article
      className={`work-card${project.featured ? ' featured' : ''} reveal-child`}
      style={{ '--delay': `${index * 0.08}s` }}
    >
      <div className="card-img-area">
        {/* Proje görseli: src/assets/projects/<id>.jpg */}
        {/* <img src={`/assets/projects/${project.id}.jpg`} alt={project.title} /> */}
        <div className="card-img-placeholder">
          <span>{project.title}</span>
        </div>
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
                Canlı ↗
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
      </div>
    </article>
  )
}

export default function Works() {
  const ref = useReveal()
  const featured = projects.filter(p => p.featured)
  const rest = projects.filter(p => !p.featured)

  return (
    <section id="works" className="section" ref={ref}>
      <div className="section-label">— 03</div>
      <h2 className="section-title centered">Projeler</h2>
      <p className="section-sub">Öne çıkan çalışmalardan bazıları</p>

      {/* Featured projeler — tam genişlik */}
      <div className="works-featured">
        {featured.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      {/* Diğer projeler — grid */}
      <div className="works-grid">
        {rest.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i + featured.length} />
        ))}
      </div>
    </section>
  )
}
