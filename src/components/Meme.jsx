import semaPhoto from '../assets/sema.webp'

// Stardew Valley arayüzünden esinlenen pixel "meme" kutuları.
// İçerikler data.js → memes alanından gelir. Türler:
//   levelup  — seviye atlama ekranı
//   item     — eşya açıklaması (tooltip)
//   energy   — gece 02:00 enerji barı
//   calendar — takvim notları
//   npc      — portreli diyalog kutusu
//   image    — kendi meme görselin (public/memes/ altına koy, src ile ver)
export default function Meme({ meme, className = '' }) {
  if (!meme) return null
  const cls = `meme sv-box reveal-scale ${className}`

  switch (meme.kind) {
    case 'levelup':
      return (
        <aside className={`${cls} meme-levelup`}>
          <p className="sv-title">{meme.title}</p>
          <div className="meme-levelup-row">
            <span className="sv-icon" aria-hidden="true">{meme.icon}</span>
            <div>
              <p className="sv-heading">{meme.skill}</p>
              <p className="sv-text">{meme.text}</p>
            </div>
          </div>
          <p className="sv-note">{meme.note}</p>
        </aside>
      )

    case 'item':
      return (
        <aside className={`${cls} meme-item`}>
          <div className="meme-item-head">
            <span className="sv-icon" aria-hidden="true">{meme.icon}</span>
            <div>
              <p className="sv-heading">{meme.name}</p>
              <p className="sv-sub">{meme.category}</p>
            </div>
          </div>
          <p className="sv-text">{meme.text}</p>
          <ul className="meme-item-buffs">
            {meme.buffs.map(b => <li key={b}>{b}</li>)}
          </ul>
          <p className="sv-quality" aria-label={meme.quality}>★ {meme.quality}</p>
        </aside>
      )

    case 'energy':
      return (
        <aside className={`${cls} meme-energy`}>
          <div className="meme-energy-bar" role="img" aria-label={`${meme.label}: ${meme.value}%`}>
            <span className="meme-energy-letter">E</span>
            <div className="meme-energy-track">
              <span style={{ height: `${meme.value}%` }} />
            </div>
          </div>
          <div>
            <p className="sv-title">{meme.time}</p>
            <p className="sv-text">{meme.text}</p>
            <p className="sv-note">{meme.note}</p>
          </div>
        </aside>
      )

    case 'calendar':
      return (
        <aside className={`${cls} meme-calendar`}>
          <p className="sv-title">{meme.title}</p>
          <ul>
            {meme.entries.map(e => (
              <li key={e.day}>
                <span className="meme-calendar-day">{e.day}</span>
                <span className="sv-text">{e.text}</span>
              </li>
            ))}
          </ul>
        </aside>
      )

    case 'npc':
      return (
        <aside className={`${cls} meme-npc`}>
          <p className="sv-text meme-npc-text">{meme.text}</p>
          <figure className="meme-npc-portrait">
            <img src={semaPhoto} alt="" loading="lazy" />
            <figcaption className="sv-nameplate">{meme.speaker}</figcaption>
          </figure>
          <span className="meme-next" aria-hidden="true">▼</span>
        </aside>
      )

    case 'image':
      return (
        <figure className={`${cls} meme-image`}>
          <img src={meme.src} alt={meme.alt} loading="lazy" />
          {meme.caption && <figcaption className="sv-note">{meme.caption}</figcaption>}
        </figure>
      )

    default:
      return null
  }
}
