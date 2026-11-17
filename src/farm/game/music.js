// ── ÇİFTLİK MÜZİĞİ ──────────────────────────────────────────────────────────
// Bu site için yazılmış özgün, 8 ölçülük sakin bir döngü (Fa majör, 92 bpm).
// Ses dosyası yok: notalar Web Audio ile tarayıcıda çalınır.
//   arp: telli çalgı gibi kısa tınlayan akor notaları · bass: yumuşak bas
//   lead: ezgi · shaker: çok hafif ritim

const BPM = 92
const STEP = 60 / BPM / 2          // sekizlik nota süresi (sn)
const BAR = 8                      // ölçü başına sekizlik
export const LOOP_SECONDS = STEP * BAR * 8

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12)

// Ölçü başına akor: [arpej notaları, bas]
const CHORDS = [
  [[53, 57, 60, 65], 41], // Fa
  [[52, 55, 60, 64], 40], // Do/Mi
  [[50, 53, 57, 62], 38], // Re minör
  [[53, 58, 62, 65], 34], // Si bemol
  [[53, 57, 60, 65], 41], // Fa
  [[52, 55, 60, 64], 36], // Do
  [[53, 58, 62, 65], 34], // Si bemol
  [[52, 55, 60, 67], 36], // Do
]
const ARP = [0, 1, 2, 1, 3, 1, 2, 1]

// Ezgi: [nota, süre (sekizlik)]; 0 = sus
const LEAD = [
  [69, 2], [72, 2], [69, 1], [67, 1], [65, 2],
  [67, 3], [64, 1], [67, 2], [72, 2],
  [69, 2], [65, 2], [62, 2], [65, 2],
  [74, 3], [72, 1], [70, 2], [0, 2],
  [69, 2], [72, 2], [77, 3], [72, 1],
  [76, 2], [74, 2], [72, 2], [67, 2],
  [70, 2], [74, 2], [72, 1], [70, 1], [69, 2],
  [67, 4], [64, 2], [67, 2],
]

function tone(ctx, out, { type, freq, at, attack, hold, release, gain }) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(0.0001, at)
  g.gain.linearRampToValueAtTime(gain, at + attack)
  g.gain.setValueAtTime(gain, at + attack + hold)
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + hold + release)
  osc.connect(g).connect(out)
  osc.start(at)
  osc.stop(at + attack + hold + release + 0.05)
}

// Bir döngünün tüm notalarını `t0` anından başlayarak zamanlar
export function scheduleLoop(ctx, out, noise, t0) {
  CHORDS.forEach(([notes, bass], bar) => {
    const tb = t0 + bar * BAR * STEP
    ARP.forEach((n, i) => tone(ctx, out.arp, {
      type: 'triangle', freq: hz(notes[n]), at: tb + i * STEP, attack: 0.006, hold: 0.02, release: 0.55, gain: i % 4 === 0 ? 0.2 : 0.14,
    }))
    for (const [beat, note] of [[0, bass], [4, bass + 7]]) tone(ctx, out.bass, {
      type: 'sine', freq: hz(note), at: tb + beat * STEP, attack: 0.02, hold: STEP * 1.5, release: 0.5, gain: 0.3,
    })
    // Shaker: zayıf vuruşlarda kısa, kısık gürültü
    for (const i of [2, 6, 7]) {
      const src = ctx.createBufferSource()
      const g = ctx.createGain()
      const at = tb + i * STEP
      src.buffer = noise
      g.gain.setValueAtTime(i === 7 ? 0.025 : 0.045, at)
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.07)
      src.connect(g).connect(out.shaker)
      src.start(at)
      src.stop(at + 0.09)
    }
  })
  let step = 0
  for (const [note, len] of LEAD) {
    if (note) tone(ctx, out.lead, {
      type: 'sine', freq: hz(note), at: t0 + step * STEP, attack: 0.03, hold: Math.max(0.05, len * STEP - 0.12), release: 0.35, gain: 0.2,
    })
    step += len
  }
}

// Çalgı kanalları: süzgeçler, hafif yankı ve ana ses
export function buildMixer(ctx, volume = 0.5) {
  const master = ctx.createGain()
  master.gain.value = volume
  master.connect(ctx.destination)
  const echo = ctx.createDelay(1)
  const feedback = ctx.createGain()
  const wet = ctx.createGain()
  echo.delayTime.value = STEP * 1.5
  feedback.gain.value = 0.28
  wet.gain.value = 0.22
  echo.connect(feedback).connect(echo)
  echo.connect(wet).connect(master)
  const channel = (cutoff, type = 'lowpass', send = true) => {
    const f = ctx.createBiquadFilter()
    f.type = type
    f.frequency.value = cutoff
    f.connect(master)
    if (send) f.connect(echo)
    return f
  }
  const noise = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return {
    master, noise,
    out: { arp: channel(1900), lead: channel(2600), bass: channel(420, 'lowpass', false), shaker: channel(6500, 'highpass', false) },
  }
}

// Çalar: ilk kullanıcı hareketinde başlar (tarayıcılar öncesinde sese izin vermez)
export function createMusic() {
  let ctx = null, mixer = null, timer = 0, nextLoop = 0, on = false
  const VOLUME = 0.5

  function pump() {
    // Bir sonraki döngüyü, bitmesine 1 sn kala sıraya al
    while (nextLoop < ctx.currentTime + 1) {
      scheduleLoop(ctx, mixer.out, mixer.noise, nextLoop)
      nextLoop += LOOP_SECONDS
    }
  }
  function start() {
    if (on) return
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    on = true
    ctx = new AC()
    mixer = buildMixer(ctx, 0.0001)
    mixer.master.gain.exponentialRampToValueAtTime(VOLUME, ctx.currentTime + 1.5)
    nextLoop = ctx.currentTime + 0.1
    pump()
    timer = setInterval(pump, 400)
    ctx.resume?.()
  }
  function stop(fade = 0.4) {
    if (!on) return
    on = false
    clearInterval(timer)
    const old = ctx
    try {
      mixer.master.gain.cancelScheduledValues(old.currentTime)
      mixer.master.gain.setValueAtTime(Math.max(0.0001, mixer.master.gain.value), old.currentTime)
      mixer.master.gain.exponentialRampToValueAtTime(0.0001, old.currentTime + fade)
    } catch { /* bağlam zaten kapanmış */ }
    setTimeout(() => old.close().catch(() => {}), fade * 1000 + 80)
    ctx = mixer = null
  }
  // Sekme arka plandayken sus
  const onVisibility = () => {
    if (!ctx) return
    if (document.hidden) ctx.suspend()
    else ctx.resume()
  }
  document.addEventListener('visibilitychange', onVisibility)

  return {
    start, stop,
    get playing() { return on },
    dispose() { stop(0.05); document.removeEventListener('visibilitychange', onVisibility) },
  }
}
