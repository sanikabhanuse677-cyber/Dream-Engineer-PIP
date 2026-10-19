import { useEffect, useState } from 'react'
import face from '../assets/pip-face.webp'
import { asset } from '../lib/asset'

const MESSAGES = ['Tucking in the stars…', 'Fluffing the clouds…', 'Winding the music box…', 'Polishing the moon…', 'Waking up Pip…']
const FILES = ['pip-cloud.webp', 'pip-portrait.webp', 'lullaby-box.webp', 'dream-lantern.webp']

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [msg, setMsg] = useState(0)

  useEffect(() => {
    let cancelled = false
    let done = 0
    const total = FILES.length + 1
    const timers = []
    let minDone = false
    let loadDone = false
    const finish = () => {
      if (cancelled || !(minDone && loadDone)) return
      setLeaving(true)
      timers.push(setTimeout(() => !cancelled && onDone(), 650))
    }
    const bump = () => {
      if (cancelled) return
      done += 1
      setPct(Math.min(100, Math.round((done / total) * 100)))
      if (done >= total) {
        loadDone = true
        finish()
      }
    }
    FILES.forEach((f) => {
      const im = new Image()
      im.onload = im.onerror = bump
      im.src = asset(f)
    })
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(bump)
    else bump()
    timers.push(setTimeout(() => ((minDone = true), finish()), 1900))
    // Failsafe: never keep a visitor waiting on a slow network.
    timers.push(setTimeout(() => ((minDone = true), (loadDone = true), finish()), 6500))
    timers.push(setInterval(() => setMsg((m) => (m + 1) % MESSAGES.length), 1100))
    return () => {
      cancelled = true
      timers.forEach((t) => (clearTimeout(t), clearInterval(t)))
    }
  }, [onDone])

  const lit = Math.round((pct / 100) * 5)
  return (
    <div className={`loader ${leaving ? 'is-leaving' : ''}`} role="status" aria-live="polite" aria-label="Loading Pip’s dream world">
      <div className="loader-stars" aria-hidden="true" />
      <div className="loader-card">
        <div className="loader-pip" aria-hidden="true">
          <span className="zzz z1">z</span>
          <span className="zzz z2">Z</span>
          <div className="loader-cloud" />
          <img src={face} alt="" width="104" height="104" />
        </div>
        <p className="loader-msg">{MESSAGES[msg]}</p>
        <div className="loader-stars-row" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={i < lit ? 'on' : ''}>
              ★
            </span>
          ))}
        </div>
        <div className="loader-bar" aria-hidden="true">
          <i style={{ width: `${pct}%` }} />
        </div>
        <p className="loader-pct">{pct}% dreamy</p>
      </div>
    </div>
  )
}
