import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { PROJECTS } from '../data/story'
import { chime, success } from '../lib/audio'
import { asset } from '../lib/asset'

/* ================= flavors / helpers ================= */
const FLAVORS = [
  { name: 'Strawberry', c1: '#ffc2e4', c2: '#ff7eb6' },
  { name: 'Blueberry', c1: '#c3d0ff', c2: '#7c8cff' },
  { name: 'Mint', c1: '#c4f7e3', c2: '#5fdcae' },
  { name: 'Lemon', c1: '#fff3b0', c2: '#ffd34d' },
]
const BLOBS = Array.from({ length: 10 }, (_, i) => i)

/* ================= PREVIEW ART (each is its own tiny interactive) ================= */
function CandyArt({ f, big = false }) {
  const st = { '--c1': f.c1, '--c2': f.c2 }
  return (
    <svg viewBox="0 0 200 150" className="art candy-art" style={st} aria-hidden="true">
      <rect width="200" height="150" fill="#6a4fd0" opacity=".0" />
      <g className="drift">
        <g style={{ fill: 'var(--c1)' }}>
          <circle cx="40" cy="38" r="16" /><circle cx="60" cy="30" r="20" /><circle cx="84" cy="40" r="15" /><rect x="26" y="38" width="72" height="16" rx="8" />
        </g>
      </g>
      <g className="drift d2">
        <g style={{ fill: 'var(--c2)' }} opacity=".9">
          <circle cx="132" cy="24" r="12" /><circle cx="150" cy="20" r="15" /><circle cx="170" cy="28" r="11" /><rect x="120" y="26" width="62" height="12" rx="6" />
        </g>
      </g>
      <g className="bob">
        <path d="M44 100 Q60 140 100 144 Q140 140 156 100 Z" fill="#7a5fd8" />
        <ellipse cx="100" cy="100" rx="58" ry="14" style={{ fill: 'var(--c1)' }} />
        <rect x="88" y="62" width="24" height="36" rx="5" fill="#fff0f8" />
        <path d="M84 64 L100 36 L116 64 Z" style={{ fill: 'var(--c2)' }} />
        <circle cx="100" cy="76" r="5" fill="#ffd98a" />
        <circle cx="68" cy="90" r="9" style={{ fill: 'var(--c2)' }} /><circle cx="134" cy="90" r="7" fill="#b9a7ff" />
        {[[52, 110], [80, 118], [118, 118], [146, 110], [100, 130]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="8" height="3" rx="1.5" fill="#fff" opacity=".8" transform={`rotate(${i * 40} ${x} ${y})`} />
        ))}
      </g>
      {big && <text x="100" y="12" textAnchor="middle" fontSize="9" fill="#fff" opacity=".8">sweet weather</text>}
    </svg>
  )
}

function MoonArt({ lit }) {
  const plants = [[52, 108], [100, 100], [148, 108]]
  return (
    <svg viewBox="0 0 200 150" className="art moon-art" aria-hidden="true">
      <circle cx="160" cy="30" r="16" fill="#e7efff" />
      <circle cx="166" cy="26" r="14" fill="#2a2a82" />
      {[[30, 24], [70, 14], [120, 34], [180, 70], [20, 70]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill="#fff" className="pulse-soft" style={{ animationDelay: `${i * 0.5}s` }} />)}
      {lit >= 3 && <path className="found-star" d="M100 40l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1z" fill="#ffe29a" />}
      <g className="bob">
        <path d="M30 118 Q60 150 100 150 Q140 150 170 118 Z" fill="#4a3fb0" />
        <ellipse cx="100" cy="118" rx="70" ry="14" fill="#7a6ff0" />
        {plants.map(([x, y], i) => (
          <g key={i}>
            <path d={`M${x} ${y + 8} Q${x - 6} ${y - 14} ${x} ${y - 30}`} stroke="#9ff0d0" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx={x} cy={y - 32} r={i < lit ? 18 : 8} fill="#9ff0d0" opacity={i < lit ? 0.35 : 0.1} className="plant-glow" />
            <circle cx={x} cy={y - 32} r="7" fill={i < lit ? '#d9fff0' : '#3c8f78'} className="plant-bulb" />
          </g>
        ))}
      </g>
    </svg>
  )
}

function RepairArt({ fixed }) {
  return (
    <svg viewBox="0 0 200 150" className={`art repair-art ${fixed ? 'fixed' : ''}`} aria-hidden="true">
      <g className="nm">
        <path d="M20 90 Q14 60 40 56 Q54 40 70 56 Q92 58 86 86 Q92 112 62 112 Q40 122 28 108 Q16 104 20 90Z" fill="#2a1f66" stroke="#7d5fd0" strokeWidth="2" />
        <circle cx="42" cy="82" r="5" fill="#ffb3d9" /><circle cx="64" cy="82" r="5" fill="#ffb3d9" />
        <path d="M44 98 Q53 92 62 98" stroke="#ffb3d9" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M26 56 l-6 -10 M52 46 l0 -12 M78 54 l8 -10" stroke="#7d5fd0" strokeWidth="3" strokeLinecap="round" />
      </g>
      <rect x="84" y="56" width="52" height="64" rx="12" fill="#1b1660" stroke="#b9a7ff" strokeWidth="3" />
      <rect x="94" y="68" width="32" height="22" rx="6" fill={fixed ? '#ffe29a' : '#3a2f9a'} className="m-window" />
      <g transform="translate(110 106)"><g className="gear"><path d="M0 -9 L3 -6 L8 -6 L7 -2 L10 2 L6 5 L6 9 L1 8 L-3 10 L-5 6 L-9 5 L-8 0 L-10 -4 L-6 -6 L-4 -10Z" fill="#ff9fcf" /></g></g>
      <path className="star-out" d="M164 76l6 13 14 2-10 10 3 14-13-7-13 7 3-14-10-10 14-2z" fill="#ffe29a" stroke="#fff7d1" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
}

/* ================= DETAIL VIEWS (custom per project) ================= */
function CandyDetail() {
  const [fi, setFi] = useState(0)
  const [wind, setWind] = useState(40)
  const f = FLAVORS[fi]
  const dur = `${(20 - wind * 0.15).toFixed(1)}s`
  return (
    <div className="detail-scene candy-detail" style={{ '--c1': f.c1, '--c2': f.c2, '--drift': dur }}>
      <svg viewBox="0 0 600 260" className="big-art" role="img" aria-label={`Candy Cloud Kingdom in ${f.name} flavor`}>
        <defs><linearGradient id="ckSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5a3fc4" /><stop offset="1" stopColor="#ffb3d9" /></linearGradient></defs>
        <rect width="600" height="260" rx="18" fill="url(#ckSky)" />
        {[[70, 50, 1.3], [330, 36, 1], [470, 80, 1.5]].map(([x, y, s], i) => (
          <g key={i} className="drift-x" style={{ animationDuration: `calc(var(--drift) * ${1 + i * 0.3})`, animationDelay: `${-i * 3}s` }}>
            <g transform={`translate(${x} ${y}) scale(${s})`} style={{ fill: i % 2 ? 'var(--c2)' : 'var(--c1)' }}>
              <circle cx="0" cy="12" r="20" /><circle cx="28" cy="0" r="28" /><circle cx="64" cy="10" r="22" /><rect x="-18" y="12" width="100" height="22" rx="11" />
            </g>
          </g>
        ))}
        {[[130, 190, 0.8], [300, 170, 1], [470, 196, 0.7]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <g className="bob" style={{ animationDelay: `${-i}s` }}>
              <path d="M-60 0 Q-40 50 0 60 Q40 50 60 0Z" fill="#7a5fd8" />
              <ellipse rx="64" ry="14" style={{ fill: 'var(--c1)' }} />
              <rect x="-12" y="-52" width="24" height="50" rx="6" fill="#fff0f8" />
              <path d="M-18 -50 L0 -86 L18 -50Z" style={{ fill: 'var(--c2)' }} />
              <circle cx="-38" cy="-10" r="10" style={{ fill: 'var(--c2)' }} /><circle cx="40" cy="-8" r="8" fill="#ffe29a" />
            </g>
          </g>
        ))}
      </svg>
      <fieldset className="controls">
        <legend>Cloud flavor</legend>
        <div className="seg">
          {FLAVORS.map((x, i) => (
            <button key={x.name} type="button" className={i === fi ? 'on' : ''} aria-pressed={i === fi} onClick={() => (chime(i), setFi(i))}>
              <i style={{ background: x.c2 }} aria-hidden="true" />
              {x.name}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="range">
        <span>Wind speed <b>{wind}%</b></span>
        <input type="range" min="0" max="100" value={wind} onChange={(e) => setWind(+e.target.value)} />
      </label>
    </div>
  )
}

const STARS = [[12, 20], [28, 64], [44, 30], [58, 74], [72, 22], [86, 56], [92, 18]]
function MoonDetail() {
  const box = useRef(null)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const [found, setFound] = useState([])
  const [assist, setAssist] = useState(false)

  const move = (x, y) => {
    const nx = Math.max(0, Math.min(100, x)), ny = Math.max(0, Math.min(100, y))
    setPos({ x: nx, y: ny })
    setFound((f) => {
      const add = STARS.map((s, i) => [s, i]).filter(([s, i]) => !f.includes(i) && Math.hypot((s[0] - nx) * 1.6, s[1] - ny) < 13).map(([, i]) => i)
      if (!add.length) return f
      chime(f.length)
      return [...f, ...add]
    })
  }
  const onPointer = (e) => {
    const r = box.current.getBoundingClientRect()
    move(((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100)
  }
  const onKey = (e) => {
    const k = { ArrowLeft: [-6, 0], ArrowRight: [6, 0], ArrowUp: [0, -6], ArrowDown: [0, 6] }[e.key]
    if (k) {
      e.preventDefault()
      move(pos.x + k[0], pos.y + k[1])
    }
  }
  useEffect(() => {
    if (found.length === STARS.length) success()
  }, [found.length])

  return (
    <div className="detail-scene moon-detail">
      <div
        ref={box}
        className={`night-box ${assist ? 'assist' : ''}`}
        style={{ '--lx': `${pos.x}%`, '--ly': `${pos.y}%` }}
        onPointerMove={onPointer}
        onPointerDown={onPointer}
        tabIndex={0}
        onKeyDown={onKey}
        role="group"
        aria-label={`Moonlit garden. Move the lantern with your pointer, finger or arrow keys. ${found.length} of 7 stars found.`}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="night-svg" aria-hidden="true">
          <ellipse cx="25" cy="82" rx="26" ry="7" fill="#4a3fb0" /><ellipse cx="72" cy="66" rx="20" ry="6" fill="#4a3fb0" /><ellipse cx="50" cy="40" rx="14" ry="4" fill="#4a3fb0" />
          {[[18, 78], [30, 78], [66, 62], [78, 62], [50, 36]].map(([x, y], i) => <g key={i}><path d={`M${x} ${y} q-2 -6 0 -10`} stroke="#9ff0d0" strokeWidth=".8" fill="none" /><circle cx={x} cy={y - 11} r="1.8" fill="#9ff0d0" /><circle cx={x} cy={y - 11} r="4.2" fill="#9ff0d0" opacity=".25" /></g>)}
        </svg>
        {STARS.map(([x, y], i) => (
          <span key={i} className={`hid-star ${found.includes(i) ? 'found' : ''}`} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">✦</span>
        ))}
        <div className="dark-cover" aria-hidden="true" />
        <img className="lantern" src={asset('dream-lantern.webp')} alt="" aria-hidden="true" draggable="false" />
      </div>
      <div className="detail-row">
        <p aria-live="polite"><strong>{found.length}/7</strong> hidden stars found{found.length === 7 ? ' — every one! Pip only found six.' : ''}</p>
        <div className="detail-btns">
          <button type="button" className="btn btn-ghost" onClick={() => setAssist((a) => !a)} aria-pressed={assist}>{assist ? 'Hide star hints' : 'Show star hints'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => setFound([])}>↺ Start over</button>
        </div>
      </div>
    </div>
  )
}

function RepairDetail() {
  const [level, setLevel] = useState(4)
  const [phase, setPhase] = useState('idle') // idle | running | done
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const run = () => {
    if (phase === 'running') return
    setPhase('running')
    chime(2)
    timer.current = setTimeout(() => (setPhase('done'), success()), 1700)
  }
  return (
    <div className={`detail-scene repair-detail ${phase}`}>
      <div className="conveyor">
        <div className="in" aria-hidden="true">
          {BLOBS.slice(0, level).map((b) => <span key={b} className="blob" style={{ animationDelay: `${b * 0.12}s` }}>〰</span>)}
        </div>
        <div className="mach" aria-hidden="true">
          <div className="mach-gears"><i /><i /><i /></div>
          <div className="mach-lamp" />
        </div>
        <div className="out" aria-hidden="true">
          {phase === 'done' && BLOBS.slice(0, level).map((b) => <span key={b} className="star-pop" style={{ animationDelay: `${b * 0.08}s` }}>★</span>)}
        </div>
      </div>
      <label className="range">
        <span>Nightmare intensity <b>{level}</b></span>
        <input type="range" min="1" max="10" value={level} onChange={(e) => (setLevel(+e.target.value), setPhase('idle'))} />
      </label>
      <div className="detail-row">
        <p aria-live="polite">
          {phase === 'idle' && `${level} wobbly nightmares are waiting in line.`}
          {phase === 'running' && 'The gears are sorting scribbles from sparkles…'}
          {phase === 'done' && <><strong>{level} nightmares → {level} peaceful stars.</strong> Sweet dreams!</>}
        </p>
        <button type="button" className="btn btn-primary" onClick={run} disabled={phase === 'running'}>{phase === 'done' ? 'Repair more' : 'Run the machine'}</button>
      </div>
    </div>
  )
}

/* ================= MODAL ================= */
function Modal({ project, onClose, opener }) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  const openerRef = useRef(opener)
  useEffect(() => {
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    const dlg = ref.current
    const focusables = () => dlg.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])')
    dlg.querySelector('.modal-x').focus()
    const onKey = (e) => {
      if (e.key === 'Escape') return closeRef.current()
      if (e.key !== 'Tab') return
      const f = [...focusables()].filter((el) => !el.disabled)
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus())
      else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus())
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = prev
      const o = openerRef.current
      o && o.focus && o.focus()
    }
  }, [])

  const Detail = { candy: CandyDetail, moon: MoonDetail, repair: RepairDetail }[project.id]
  return createPortal(
    <div className="modal-back" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal modal-${project.id}`} role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={ref}>
        <button type="button" className="modal-x" onClick={onClose} aria-label="Close project details">×</button>
        <p className="kicker">Dream project</p>
        <h3 id="modal-title">{project.title}</h3>
        <p className="modal-long">{project.long}</p>
        <Detail />
        <ul className="built">{project.built.map((b) => <li key={b}>{b}</li>)}</ul>
        <button type="button" className="btn btn-primary modal-done" onClick={onClose}>Back to the chapter</button>
      </div>
    </div>,
    document.body,
  )
}

/* ================= CARDS ================= */
function Card({ project, onOpen }) {
  const [flavor, setFlavor] = useState(0)
  const [lit, setLit] = useState(0)
  const [fixed, setFixed] = useState(false)
  const act = () => {
    if (project.id === 'candy') (chime(flavor + 1), setFlavor((f) => (f + 1) % FLAVORS.length))
    if (project.id === 'moon') (chime(lit), setLit((l) => (l >= 3 ? 0 : l + 1)))
    if (project.id === 'repair') (fixed ? chime(0) : success(), setFixed((x) => !x))
  }
  const status = project.id === 'candy' ? `${FLAVORS[flavor].name} weather` : project.id === 'moon' ? (lit >= 3 ? 'Hidden star found! ★' : `${lit}/3 plants glowing`) : fixed ? 'Peaceful star ★' : 'Unstable energy…'
  return (
    <article className={`proj proj-${project.id}`}>
      <button type="button" className="preview" onClick={act} aria-label={`${project.title} preview. ${project.hint}. Current: ${status}`}>
        {project.id === 'candy' && <CandyArt f={FLAVORS[flavor]} />}
        {project.id === 'moon' && <MoonArt lit={lit} />}
        {project.id === 'repair' && <RepairArt fixed={fixed} />}
        <span className="preview-chip" aria-hidden="true">{status}</span>
      </button>
      <div className="proj-body">
        <h4>{project.title}</h4>
        <p>{project.short}</p>
        <button type="button" className="btn btn-ghost btn-sm open-btn" onClick={(e) => onOpen(project.id, e.currentTarget)}>Open details →</button>
      </div>
    </article>
  )
}

export default function Projects() {
  const [open, setOpen] = useState(null)
  const opener = useRef(null)
  const close = () => setOpen(null)
  const proj = PROJECTS.find((p) => p.id === open)
  return (
    <>
      <div className="proj-grid">
        {PROJECTS.map((p) => (
          <Card key={p.id} project={p} onOpen={(id, el) => ((opener.current = el), setOpen(id))} />
        ))}
      </div>
      {proj && <Modal project={proj} onClose={close} opener={opener.current} />}
    </>
  )
}
