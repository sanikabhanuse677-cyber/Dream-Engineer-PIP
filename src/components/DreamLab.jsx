import { useEffect, useRef, useState } from 'react'
import { INGREDIENTS, RECIPES } from '../data/story'
import { asset } from '../lib/asset'
import { chime, success, playLullaby, stopLullaby } from '../lib/audio'

const gear = (r, teeth = 8) => {
  let d = ''
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2
    const rr = i % 2 ? r * 0.8 : r
    d += `${i ? 'L' : 'M'}${(Math.cos(a) * rr).toFixed(1)},${(Math.sin(a) * rr).toFixed(1)}`
  }
  return d + 'Z'
}
const keyFor = (a, b) => [a, b].sort().join('+')

export default function DreamLab({ reduced }) {
  const [picked, setPicked] = useState([])
  const [phase, setPhase] = useState('idle') // idle | running | done
  const [result, setResult] = useState(null)
  const [music, setMusic] = useState(false)
  const timer = useRef(null)

  useEffect(
    () => () => {
      clearTimeout(timer.current)
      stopLullaby()
    },
    [],
  )

  const toggle = (id, i) => {
    if (phase === 'running') return
    chime(i)
    setPhase('idle')
    setResult(null)
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length === 2 ? [p[1], id] : [...p, id]))
  }
  const brew = () => {
    if (picked.length < 2 || phase === 'running') return
    setPhase('running')
    chime(4)
    timer.current = setTimeout(
      () => {
        setResult(RECIPES[keyFor(picked[0], picked[1])])
        setPhase('done')
        success()
      },
      reduced ? 300 : 1800,
    )
  }
  const clean = () => {
    clearTimeout(timer.current)
    setPicked([])
    setPhase('idle')
    setResult(null)
  }
  const tune = () => {
    if (music) {
      stopLullaby()
      setMusic(false)
    } else {
      setMusic(true)
      playLullaby(() => setMusic(false))
    }
  }
  const col = (id) => INGREDIENTS.find((x) => x.id === id)?.color
  const [cA, cB] = [col(picked[0]) || '#4a3fb0', col(picked[1]) || '#4a3fb0']
  const liquid = result ? result.colors : picked.length === 2 ? [cA, cB] : ['#4a3fb0', '#6d4fd6']

  return (
    <div className={`lab ${phase}`}>
      <div className="lab-bg" aria-hidden="true" />
      <div className="lab-top">
        <button type="button" className={`lab-prop lamp ${music ? 'lit' : ''}`} onClick={tune} aria-pressed={music} aria-label={music ? 'Stop the lullaby tuner' : 'Play the lullaby tuner'}>
          <img src={asset('lullaby-box.webp')} alt="" width="64" height="58" />
          <span>{music ? 'Tuning…' : 'Lullaby tuner'}</span>
        </button>
        <div className="lab-prop lamp-static" aria-hidden="true">
          <img src={asset('dream-lantern.webp')} alt="" width="58" height="52" />
        </div>
        <div className="blueprint-tag" aria-hidden="true">
          BLUEPRINT №7 · dream mixer
        </div>
      </div>

      <svg className="machine" viewBox="0 0 340 180" role="img" aria-label={`Dream mixing machine. ${phase === 'running' ? 'It is brewing.' : phase === 'done' ? 'It finished a dream.' : 'It is waiting for two ingredients.'}`}>
        <defs>
          <linearGradient id="liq" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={liquid[0]} />
            <stop offset="1" stopColor={liquid[1]} />
          </linearGradient>
          <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity=".35" />
            <stop offset=".3" stopColor="#fff" stopOpacity=".05" />
            <stop offset="1" stopColor="#fff" stopOpacity=".2" />
          </linearGradient>
        </defs>
        <path d="M58 44 V82 H126" className="pipe" />
        <path d="M282 44 V82 H214" className="pipe" />
        <path d="M30 14 H86 L74 44 H42 Z" fill={cA} className="hopper" />
        <path d="M254 14 H310 L298 44 H266 Z" fill={cB} className="hopper" />
        <rect x="120" y="54" width="100" height="108" rx="26" fill="#1b1660" stroke="#b9a7ff" strokeWidth="3" />
        <rect x="126" y={phase === 'idle' && !result ? 120 : 76} width="88" height={phase === 'idle' && !result ? 36 : 80} rx="20" fill="url(#liq)" className="liquid" />
        <rect x="124" y="58" width="92" height="100" rx="24" fill="url(#glass)" />
        {phase === 'running' &&
          [0, 1, 2, 3].map((i) => <circle key={i} cx={146 + i * 16} cy="140" r="5" fill="#fff" opacity=".7" className="bubble" style={{ animationDelay: `${i * 0.25}s` }} />)}
        <g transform="translate(70 128)">
          <g className="gear g1">
            <path d={gear(26)} fill="#6d4fd6" stroke="#cfe3ff" strokeWidth="2" />
            <circle r="8" fill="#1b1660" />
          </g>
        </g>
        <g transform="translate(272 132)">
          <g className="gear g2">
            <path d={gear(20, 7)} fill="#ff9fcf" stroke="#fff" strokeWidth="2" />
            <circle r="6" fill="#1b1660" />
          </g>
        </g>
        <circle cx="170" cy="34" r="9" className="bulb" />
      </svg>

      <div className="ing-row" role="group" aria-label="Pick two ingredients">
        {INGREDIENTS.map((ing, i) => (
          <button key={ing.id} type="button" className={`ing ${picked.includes(ing.id) ? 'on' : ''}`} aria-pressed={picked.includes(ing.id)} onClick={() => toggle(ing.id, i)} style={{ '--ing': ing.color }}>
            <span aria-hidden="true">{ing.icon}</span>
            {ing.label}
          </button>
        ))}
      </div>
      <div className="lab-actions">
        <button type="button" className="btn btn-primary" onClick={brew} disabled={picked.length < 2 || phase === 'running'}>
          {phase === 'running' ? 'Brewing…' : 'Start the machine'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={clean} disabled={!picked.length && phase === 'idle'}>
          Clean up
        </button>
      </div>
      <p className="lab-out" aria-live="polite">
        {result ? (
          <>
            <strong>🫧 {result.name}</strong> <span>{result.note}</span>
          </>
        ) : phase === 'running' ? (
          'Gears whirring…'
        ) : (
          `Pick two ingredients (${picked.length}/2), then start the machine.`
        )}
      </p>
    </div>
  )
}
