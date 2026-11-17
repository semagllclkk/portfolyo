import { Fragment } from 'react'
import { ICONS, PALETTE } from './pixelIcons'

// 16x16 ızgarayı SVG'ye çevirir; aynı renkteki yan yana pikseller tek <rect> olur
function toRects(grid) {
  const rects = []
  grid.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const ch = row[x]
      let w = 1
      while (row[x + w] === ch) w++
      if (ch !== '.') rects.push({ x, y, w, fill: PALETTE[ch] })
      x += w
    }
  })
  return rects
}

const cache = {}

export default function PixelIcon({ name, size = 32, className = '', title }) {
  const grid = ICONS[name]
  if (!grid) return null
  const rects = (cache[name] ??= toRects(grid))
  return (
    <svg
      className={`pixel-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {rects.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.fill} />)}
    </svg>
  )
}

// Metindeki ♥ ★ ✗ işaretlerini satır içi pixel ikonlarla değiştirir
const GLYPHS = { '♥': 'heart', '★': 'star', '✗': 'cross' }

export function PixelText({ text }) {
  const parts = String(text).split(/([♥★✗])/)
  return parts.map((p, i) =>
    GLYPHS[p]
      ? <PixelIcon key={i} name={GLYPHS[p]} size={16} className="pixel-icon-inline" title={p} />
      : <Fragment key={i}>{p}</Fragment>
  )
}
