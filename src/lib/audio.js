// Tiny Web Audio helper. Nothing plays until the visitor interacts, and everything honours the mute switch.
let ctx = null
let muted = false
let timers = []
const PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]

function ensure() {
  if (muted) return null
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(freq, { when = 0, dur = 0.5, type = 'sine', gain = 0.08, slide = 0 } = {}) {
  const c = ensure()
  if (!c) return
  const t0 = c.currentTime + when
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur)
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.05)
}

export function setMuted(m) {
  muted = m
  if (m) {
    stopLullaby()
    if (ctx && ctx.state === 'running') ctx.suspend()
  } else if (ctx && ctx.state === 'suspended') ctx.resume()
}

export const chime = (i = 0) => tone(PENTA[((i % PENTA.length) + PENTA.length) % PENTA.length], { dur: 0.7, type: 'triangle' })
export const giggle = () => {
  tone(700, { dur: 0.12, slide: 300, gain: 0.06 })
  tone(820, { when: 0.14, dur: 0.12, slide: 320, gain: 0.06 })
  tone(940, { when: 0.28, dur: 0.16, slide: 260, gain: 0.05 })
}
export const buzz = () => tone(110, { dur: 0.25, type: 'sawtooth', gain: 0.04, slide: -30 })
export const success = () => [0, 2, 3, 4, 5].forEach((n, k) => tone(PENTA[n], { when: k * 0.12, dur: 0.9, type: 'triangle', gain: 0.07 }))
export const secretSong = () => [4, 3, 5, 2, 4].forEach((n, k) => tone(PENTA[n], { when: k * 0.16, dur: 0.9, type: 'sine', gain: 0.07 }))

// An original, slow music-box lullaby (pentatonic, so it always sounds gentle).
const LULLABY = [2, 3, 4, 3, 2, 0, 2, 1, 0, 1, 2, 0, 2, 3, 4, 5, 4, 3, 2, 3, 2, 0]
export function stopLullaby() {
  timers.forEach(clearTimeout)
  timers = []
}
export function playLullaby(onEnd) {
  stopLullaby()
  if (!ensure()) {
    onEnd && onEnd()
    return
  }
  LULLABY.forEach((n, k) => {
    timers.push(setTimeout(() => tone(PENTA[n], { dur: 0.9, type: 'triangle', gain: 0.07 }), k * 330))
  })
  timers.push(setTimeout(() => onEnd && onEnd(), LULLABY.length * 330 + 600))
}
