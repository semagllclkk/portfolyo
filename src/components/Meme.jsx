// RPG temalı küçük "meme" kutuları: başarım bildirimi, diyalog kutusu, yan görev.
// İçerikler data.js içindeki `memes` alanından gelir.
export default function Meme({ meme, className = '' }) {
  if (!meme) return null

  if (meme.kind === 'achievement') {
    return (
      <aside className={`meme meme-achievement reveal-scale ${className}`}>
        <span className="meme-trophy" aria-hidden="true">🏆</span>
        <div>
          <p className="meme-title">{meme.title}</p>
          <p className="meme-text">{meme.text}</p>
          {meme.sub && <p className="meme-sub">{meme.sub}</p>}
        </div>
      </aside>
    )
  }

  if (meme.kind === 'quest') {
    return (
      <aside className={`meme meme-quest reveal-scale ${className}`}>
        <p className="meme-title">{meme.title}</p>
        <p className="meme-text">{meme.text}</p>
        <div className="meme-bar" role="progressbar" aria-valuenow={meme.progress} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${meme.progress}%` }} />
        </div>
        <p className="meme-sub">{meme.progress}% · {meme.status}</p>
      </aside>
    )
  }

  // dialog
  return (
    <aside className={`meme meme-dialog reveal-scale ${className}`}>
      <p className="meme-speaker">{meme.speaker}</p>
      <p className="meme-text">{meme.text}</p>
      <span className="meme-next" aria-hidden="true">▼</span>
    </aside>
  )
}
