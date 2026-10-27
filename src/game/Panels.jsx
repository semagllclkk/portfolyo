import { useEffect, useRef, useState } from 'react'
import semaPhoto from '../assets/sema.webp'
import PixelIcon, { PixelText } from '../components/PixelIcon'
import { cropSprite } from './art'
import { framesFor } from './frames'

const cropUrls = {}
const cropUrl = (i) => (cropUrls[i] ??= cropSprite(i).img.toDataURL())

function CropIcon({ i, size = 40 }) {
  return <img className="crop-img" src={cropUrl(i)} width={size} height={size} alt="" />
}

// Stardew tarzı ahşap çerçeveli pencere; Esc ve arka plana tıklama kapatır
function Window({ title, onClose, closeLabel, wide, className = '', children }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.querySelector('.win-close')?.focus({ preventScroll: true })
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="win-backdrop" onPointerDown={e => e.target === e.currentTarget && onClose()}>
      <section ref={ref} className={`win ui-box${wide ? ' win-wide' : ''} ${className}`} role="dialog" aria-modal="true" aria-label={title}>
        <header className="win-head">
          <h2 className="win-title">{title}</h2>
          <button type="button" className="win-close" onClick={onClose} aria-label={closeLabel}>×</button>
        </header>
        <div className="win-body">{children}</div>
      </section>
    </div>
  )
}

function About({ c }) {
  const p = c.personal, g = c.game.profile, e = c.education
  return (
    <div className="profile">
      <div className="profile-card">
        <p className="profile-name">{p.name}</p>
        <div className="portrait"><img src={semaPhoto} alt={c.ui.memeAlt} /></div>
        <div className="hearts" role="img" aria-label={`${g.friendship}: 8/10`}>
          {Array.from({ length: 10 }, (_, i) => (
            <PixelIcon key={i} name="heart" size={18} className={i < 8 ? '' : 'heart-empty'} />
          ))}
        </div>
        <div className="xpbar" aria-hidden="true"><span /></div>
        <dl className="fields">
          <div><dt>{g.class}:</dt><dd>{g.classValue}</dd></div>
          <div><dt>{g.trait}:</dt><dd>{g.traitValue}</dd></div>
          <div><dt>{g.perk}:</dt><dd>{g.perkValue}</dd></div>
          <div>
            <dt>{g.needs}:</dt>
            <dd className="needs">
              {g.needsList.map((n, i) => (
                <span key={n} title={n}>
                  <PixelIcon name={i ? 'bug' : 'coffee'} size={24} title={n} />
                  <PixelIcon name="check" size={12} className="need-check" />
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
      <div className="profile-text">
        <p className="lead">{p.roleLead} <em>{p.roleHighlight}</em></p>
        {p.bio.map(b => <p key={b}>{b}</p>)}
        <div className="edu">
          <PixelIcon name="cap" size={32} />
          <div>
            <p className="edu-badge">{e.badge}</p>
            <p className="edu-degree">{e.degree}</p>
            <p className="edu-meta">{e.university} · {e.city} · {e.period}</p>
          </div>
        </div>
        <ul className="stats" aria-label={g.stats}>
          {p.stats.map(s => <li key={s.label}><b>{s.value}</b><span>{s.label}</span></li>)}
        </ul>
      </div>
    </div>
  )
}

function Experience({ c }) {
  const q = c.game.quests, lv = c.memes.experience
  return (
    <>
      <p className="win-sub">{q.sub}</p>
      <div className="quests">
        {c.experience.map((e, i) => (
          <article className="quest" key={e.id} style={{ '--tilt': `${[-1, 0.8, -0.4][i % 3]}deg` }}>
            <span className="quest-pin" aria-hidden="true" />
            <p className="quest-meta">{e.type} · {e.period}</p>
            <h3>{e.title}</h3>
            <p className="quest-company">{e.company}</p>
            <p>{e.description}</p>
            {e.tags && <p className="quest-reward"><b>{q.reward}:</b> {e.tags.join(' · ')}</p>}
            <p className="quest-done"><PixelIcon name="check" size={16} /> {q.done}</p>
          </article>
        ))}
      </div>
      <div className="toast">
        <PixelIcon name={lv.icon} size={32} />
        <div>
          <p><b>{lv.title}</b> {lv.skill}</p>
          <p className="toast-note">{lv.text} {lv.note}</p>
        </div>
      </div>
    </>
  )
}

function Projects({ c, index, onSelect }) {
  const f = c.game.field
  const list = c.projects
  if (index == null) {
    return (
      <>
        <p className="win-sub">{f.sub}</p>
        <ul className="seeds">
          {list.map((pr, i) => (
            <li key={pr.id}>
              <button type="button" className="seed" onClick={() => onSelect(i)}>
                <CropIcon i={i} />
                <span className="seed-title">{pr.title}{pr.featured && <PixelIcon name="star" size={14} className="pixel-icon-inline" title={f.featured} />}</span>
                <span className="seed-sub">{pr.subtitle}</span>
              </button>
            </li>
          ))}
        </ul>
      </>
    )
  }
  const pr = list[index]
  const go = (d) => onSelect((index + d + list.length) % list.length)
  return (
    <div className="project">
      <p className="harvest"><CropIcon i={index} size={32} /> {f.harvest}</p>
      {pr.photo && (
        <div className="project-photo" style={{ background: pr.photoBg ?? '#2b1a10' }}>
          <img src={pr.photo} alt={pr.title} style={{ objectFit: pr.photoFit ?? 'cover' }} />
        </div>
      )}
      <h3 className="project-title">{pr.title}</h3>
      <p className="project-sub">{pr.subtitle}</p>
      <p>{pr.description}</p>
      <ul className="tags">{pr.tags.map(t => <li key={t}>{t}</li>)}</ul>
      <div className="project-links">
        {pr.github && <a className="ui-btn ui-btn-wide" href={pr.github} target="_blank" rel="noreferrer">{f.code} ↗</a>}
        {pr.live && <a className="ui-btn ui-btn-wide ui-btn-gold" href={pr.live} target="_blank" rel="noreferrer">{f.live} ↗</a>}
      </div>
      <nav className="project-nav">
        <button type="button" className="link-btn" onClick={() => onSelect(null)}>{f.back}</button>
        <span>
          <button type="button" className="ui-btn" onClick={() => go(-1)} aria-label={f.prev}>‹</button>
          <span className="project-count">{index + 1} / {list.length}</span>
          <button type="button" className="ui-btn" onClick={() => go(1)} aria-label={f.next}>›</button>
        </span>
      </nav>
    </div>
  )
}

function Skills({ c }) {
  const ch = c.game.chest, en = c.memes.skills
  const total = c.skills.reduce((n, s) => n + s.items.length, 0)
  return (
    <>
      <p className="win-sub">{ch.sub} · {total} {ch.items}</p>
      {c.skills.map(s => (
        <section className="inv-row" key={s.category}>
          <h3>{s.category}</h3>
          <ul className="inv">{s.items.map(it => <li className="inv-slot" key={it}>{it}</li>)}</ul>
        </section>
      ))}
      <div className="toast energy">
        <div className="energy-bar" aria-hidden="true"><span style={{ height: `${en.value}%` }} /></div>
        <div>
          <p><b>{en.label}</b> · {en.time}</p>
          <p>{en.text}</p>
          <p className="toast-note">{en.note}</p>
        </div>
      </div>
    </>
  )
}

function Contact({ c }) {
  const m = c.game.mail, ct = c.personal.contact
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard?.writeText(ct.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }).catch(() => {})
  }
  const links = [
    ['GitHub', ct.github, 'laptop'],
    ['LinkedIn', ct.linkedin, 'scroll'],
    ['Medium', ct.medium, 'coffee'],
  ]
  return (
    <div className="letter">
      <p className="letter-greet">{m.greeting}</p>
      <p>{m.text}</p>
      <ul className="letter-links">
        <li>
          <PixelIcon name="letter" size={24} />
          <a href={`mailto:${ct.email}`}>{ct.email}</a>
          <button type="button" className="ui-btn ui-btn-wide" onClick={copy}>{copied ? m.copied : m.copy}</button>
        </li>
        {links.map(([label, href, icon]) => (
          <li key={label}>
            <PixelIcon name={icon} size={24} />
            <a href={href} target="_blank" rel="noreferrer">{label} ↗</a>
          </li>
        ))}
      </ul>
      <p className="letter-sign"><PixelText text={`${m.sign} ♥`} /></p>
    </div>
  )
}

function Cv({ c }) {
  const b = c.game.bin, sh = c.memes.contactShipping
  return (
    <>
      <p>{b.text}</p>
      <table className="ship">
        <tbody>
          {sh.rows.map(r => (
            <tr key={r.item}>
              <td><PixelIcon name={r.icon} size={24} /></td>
              <td>{r.item}</td>
              <td className="ship-price">{r.price}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr><td /><td>{sh.totalLabel}</td><td className="ship-price"><PixelText text={sh.total} /></td></tr>
        </tfoot>
      </table>
      <a className="ui-btn ui-btn-wide ui-btn-gold big-btn" href={c.personal.cv} download>{b.button} ↓</a>
    </>
  )
}

const previewUrls = {}
const previewUrl = (look) => (previewUrls[look] ??= framesFor(look)[0][0].img.toDataURL())

// Oyuncu karakteri: kız ya da erkek çiftçi
function CharacterPicker({ c, look, onLook }) {
  const w = c.game.welcome
  return (
    <fieldset className="picker">
      <legend>{w.pick}</legend>
      {[['playerGirl', w.girl], ['player', w.boy]].map(([key, label]) => (
        <label key={key} className={`pick${look === key ? ' is-active' : ''}`}>
          <input type="radio" name="look" id={`look-${key}`} value={key} checked={look === key} onChange={() => onLook(key)} />
          <img src={previewUrl(key)} width={54} height={81} alt="" />
          <span>{label}</span>
        </label>
      ))}
    </fieldset>
  )
}

function Welcome({ c, onClose, look, onLook }) {
  const w = c.game.welcome
  return (
    <>
      <p>{w.text}</p>
      <CharacterPicker c={c} look={look} onLook={onLook} />
      <table className="controls">
        <tbody>
          {w.controls.map(([k, v]) => <tr key={k}><td><kbd>{k}</kbd></td><td>{v}</td></tr>)}
        </tbody>
      </table>
      <p className="win-sub">{w.tip}</p>
      <button type="button" className="ui-btn ui-btn-wide ui-btn-gold big-btn" onClick={onClose}>{w.start}</button>
    </>
  )
}

const FISH_ICONS = ['bug', 'ladybug', 'bug', 'merge', 'ladybug', 'crate']

function Fish({ c }) {
  const f = c.game.fish
  const [i, setI] = useState(() => Math.floor(Math.random() * f.catches.length))
  const fish = f.catches[i]
  const again = () => setI(n => (n + 1 + Math.floor(Math.random() * (f.catches.length - 1))) % f.catches.length)
  return (
    <div className="catch">
      <span className="catch-icon"><PixelIcon name={FISH_ICONS[i]} size={48} /></span>
      <p className="catch-name">{fish.name}</p>
      <p className="catch-rarity"><PixelText text={fish.rarity} /></p>
      <p>{fish.note}</p>
      <button type="button" className="ui-btn ui-btn-wide" onClick={again}>{f.again}</button>
    </div>
  )
}

// Sema ile diyalog: daktilo efektiyle yazılan metin ve seçenekler
function Dialogue({ c, onClose, onOpen }) {
  const n = c.game.npc
  const [shown, setShown] = useState(0)
  const text = n.greeting
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(text.length); return }
    setShown(0)
    const t = setInterval(() => setShown(s => (s >= text.length ? (clearInterval(t), s) : s + 2)), 28)
    return () => clearInterval(t)
  }, [text])
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.querySelector('button')?.focus({ preventScroll: true })
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  const done = shown >= text.length
  return (
    <div className="win-backdrop dialogue-backdrop" onPointerDown={e => e.target === e.currentTarget && onClose()}>
      <section ref={ref} className="dialogue ui-box" role="dialog" aria-modal="true" aria-label={n.name}>
        <div className="dialogue-text" onClick={() => setShown(text.length)}>
          <p aria-live="polite">{text.slice(0, shown)}<span className="sr-only">{text.slice(shown)}</span></p>
          <ul className={`choices${done ? ' is-ready' : ''}`}>
            {Object.entries(n.choices).map(([k, label]) => (
              <li key={k}>
                <button type="button" onClick={() => (k === 'bye' ? onClose() : onOpen({ kind: k }))}>▸ {label}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="dialogue-portrait">
          <img src={semaPhoto} alt="" />
          <p className="dialogue-name">{n.name}</p>
        </div>
      </section>
    </div>
  )
}

export default function Panels({ c, panel, onClose, onOpen, look, onLook }) {
  const g = c.game
  if (panel.kind === 'npc') return <Dialogue c={c} onClose={onClose} onOpen={onOpen} />
  const common = { onClose, closeLabel: g.close }
  switch (panel.kind) {
    case 'about':
      return <Window {...common} title={g.places.about} wide><About c={c} /></Window>
    case 'experience':
      return <Window {...common} title={g.quests.title} wide><Experience c={c} /></Window>
    case 'projects':
    case 'project':
      return (
        <Window {...common} title={g.field.title} wide>
          <Projects c={c} index={panel.kind === 'project' ? panel.index : null}
            onSelect={i => onOpen(i == null ? { kind: 'projects' } : { kind: 'project', index: i })} />
        </Window>
      )
    case 'skills':
      return <Window {...common} title={g.chest.title} wide><Skills c={c} /></Window>
    case 'contact':
      return <Window {...common} title={g.mail.title}><Contact c={c} /></Window>
    case 'cv':
      return <Window {...common} title={g.bin.title}><Cv c={c} /></Window>
    case 'fish':
      return <Window {...common} title={g.fish.title}><Fish c={c} /></Window>
    default:
      return <Window {...common} title={g.welcome.title}><Welcome c={c} onClose={onClose} look={look} onLook={onLook} /></Window>
  }
}
