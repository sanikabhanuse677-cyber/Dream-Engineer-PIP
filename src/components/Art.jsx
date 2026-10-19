import { useMemo } from 'react'
import { ridge, rng, starShadows } from '../lib/rng'

/* ---------- Star layer: one node, many box-shadows ---------- */
export function StarLayer({ className = '', count, seed, maxSize = 1, colors, top, height }) {
  const shadow = useMemo(() => starShadows(count, seed, { maxSize, colors, top, height }), [count, seed, maxSize, colors, top, height])
  return (
    <div className={`star-layer ${className}`} aria-hidden="true">
      <i style={{ boxShadow: shadow }} />
    </div>
  )
}

export function StarShape({ className = '', size = 40 }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <defs>
        <radialGradient id="starG" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#fffbe6" />
          <stop offset="1" stopColor="#ffd56b" />
        </radialGradient>
      </defs>
      <path d="M20 2l5.2 11.6 12.6 1.3-9.4 8.5 2.7 12.4L20 29.2 8.9 35.8l2.7-12.4-9.4-8.5 12.6-1.3z" fill="url(#starG)" strokeLinejoin="round" stroke="#fff3c4" strokeWidth="2" />
    </svg>
  )
}

/* ---------- NIGHT WORLD (intro, before the portal) ---------- */
export function NightWorld() {
  const far = useMemo(() => ridge(11, 600, 150, 110), [])
  const mid = useMemo(() => ridge(23, 700, 70, 70), [])
  const near = useMemo(() => ridge(37, 860, 50, 50), [])
  const pines = useMemo(() => {
    const r = rng(5)
    return Array.from({ length: 30 }, () => ({ x: r() * 1600, y: 690 + r() * 40, s: 0.6 + r() * 0.9 }))
  }, [])
  const glow = useMemo(() => {
    const r = rng(9)
    return Array.from({ length: 12 }, () => ({ x: 60 + r() * 1480, y: 820 + r() * 60, s: 0.6 + r() * 0.8, c: ['#ffb3d9', '#b9a7ff', '#cfe3ff'][Math.floor(r() * 3)] }))
  }, [])
  return (
    <div className="world night" aria-hidden="true">
      <div className="sky-night" />
      <StarLayer className="n-stars n-stars-a" count={90} seed={1} maxSize={0.5} />
      <StarLayer className="n-stars n-stars-b" count={45} seed={2} maxSize={1} colors={['#fff', '#cfe3ff', '#ffe29a']} />
      <StarLayer className="n-stars n-stars-c" count={14} seed={3} maxSize={1.6} colors={['#fff', '#ffb3d9']} />
      <div className="n-moon">
        <div className="moon-disc" />
      </div>
      <svg className="layer n-far" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="gFar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3b3a9a" />
            <stop offset="1" stopColor="#1c1a66" />
          </linearGradient>
        </defs>
        <path d={far} fill="url(#gFar)" opacity=".85" />
      </svg>
      <svg className="layer n-mid" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="gMid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#25237a" />
            <stop offset="1" stopColor="#120f4a" />
          </linearGradient>
        </defs>
        <path d={mid} fill="url(#gMid)" />
        {pines.map((p, i) => (
          <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`} fill="#13104d">
            <path d="M0 -70 L18 -30 H8 L24 0 H-24 L-8 -30 H-18 Z" />
          </g>
        ))}
        {/* the Midnight Nursery cottage */}
        <g transform="translate(250 690)">
          <rect x="-46" y="-52" width="92" height="52" rx="6" fill="#171458" />
          <path d="M-58 -50 L0 -98 L58 -50 Z" fill="#2a2680" />
          <rect x="24" y="-96" width="14" height="30" fill="#2a2680" />
          <rect x="-14" y="-38" width="28" height="26" rx="13" fill="#ffd98a" className="win-glow" />
          <circle cx="0" cy="-112" r="5" fill="#ffe29a" />
        </g>
      </svg>
      <svg className="layer n-near" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="gNear" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1a1768" />
            <stop offset="1" stopColor="#0a0833" />
          </linearGradient>
          <radialGradient id="gGlow">
            <stop offset="0" stopColor="#fff" stopOpacity=".9" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d={near} fill="url(#gNear)" />
        {glow.map((g, i) => (
          <g key={i} transform={`translate(${g.x} ${g.y}) scale(${g.s})`}>
            <circle r="34" fill={g.c} opacity=".28" className="pulse-soft" style={{ animationDelay: `${i * 0.37}s` }} />
            <path d="M-14 0 Q0 -26 14 0 Z" fill={g.c} />
            <rect x="-3" y="0" width="6" height="14" rx="3" fill="#efe9ff" />
          </g>
        ))}
      </svg>
      <div className="fireflies">
        {Array.from({ length: 12 }, (_, i) => (
          <i key={i} style={{ '--x': `${(i * 83) % 100}%`, '--y': `${55 + ((i * 37) % 40)}%`, '--d': `${6 + (i % 5)}s`, '--dl': `${-i * 0.9}s` }} />
        ))}
      </div>
    </div>
  )
}

/* ---------- PORTAL ---------- */
export function Portal() {
  return (
    <div className="portal" aria-hidden="true">
      <div className="portal-glow" />
      <div className="portal-rings">
        <i className="ring r1" />
        <i className="ring r2" />
        <i className="ring r3" />
        {Array.from({ length: 8 }, (_, i) => (
          <b key={i} className="rune" style={{ '--a': `${i * 45}deg` }}>
            ✦
          </b>
        ))}
      </div>
      <div className="portal-core">
        <div className="swirl" />
        <div className="swirl s2" />
      </div>
    </div>
  )
}
export function Tunnel() {
  return (
    <div className="tunnel" aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <i key={i} className="t-ring" />
      ))}
    </div>
  )
}

/* ---------- DREAMLAND ---------- */
function Island({ x, y, s = 1, top = '#ffd1ec', under = '#6f56c9', deco = 'tree', delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="bob" style={{ animationDelay: `${delay}s` }}>
        <path d="M-120 0 Q-96 90 -34 112 Q0 158 34 112 Q96 90 120 0 Z" fill={under} />
        <path d="M-70 40 Q-40 80 -10 70" stroke="#ffffff22" strokeWidth="6" fill="none" strokeLinecap="round" />
        <ellipse cx="0" cy="0" rx="124" ry="26" fill={top} />
        <ellipse cx="0" cy="-4" rx="112" ry="18" fill="#fff" opacity=".28" />
        {deco === 'tree' && (
          <g>
            <rect x="-48" y="-52" width="8" height="46" rx="4" fill="#8a6bd8" />
            <circle cx="-44" cy="-66" r="26" fill="#9ff0d0" />
            <rect x="34" y="-34" width="7" height="30" rx="3" fill="#8a6bd8" />
            <circle cx="38" cy="-44" r="18" fill="#ffc2e4" />
          </g>
        )}
        {deco === 'castle' && (
          <g>
            <rect x="-30" y="-58" width="60" height="56" rx="6" fill="#ffe3f1" />
            <path d="M-38 -56 L0 -112 L38 -56 Z" fill="#ff9fcf" />
            <rect x="-62" y="-36" width="26" height="34" rx="4" fill="#fff1c9" />
            <path d="M-66 -34 L-49 -70 L-32 -34 Z" fill="#b9a7ff" />
            <circle cx="0" cy="-30" r="9" fill="#ffd98a" />
          </g>
        )}
        {deco === 'crystal' && (
          <g>
            <path d="M-20 -2 L-6 -78 L12 -2 Z" fill="#b9a7ff" opacity=".95" />
            <path d="M8 -2 L26 -54 L40 -2 Z" fill="#cfe3ff" opacity=".95" />
            <path d="M-50 -2 L-38 -40 L-26 -2 Z" fill="#ffb3d9" opacity=".95" />
          </g>
        )}
      </g>
    </g>
  )
}

function CloudShape({ x, y, s = 1, o = 0.9, fill = 'url(#gCloud)' }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <circle cx="0" cy="10" r="46" fill={fill} />
      <circle cx="58" cy="-14" r="62" fill={fill} />
      <circle cx="130" cy="2" r="54" fill={fill} />
      <circle cx="190" cy="14" r="38" fill={fill} />
      <rect x="-30" y="10" width="250" height="42" rx="21" fill={fill} />
    </g>
  )
}

function GlowPlant({ x, y, s = 1, c = '#9ff0d0', delay = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 Q-16 -60 6 -110" stroke="#5f4bb8" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M0 -40 Q-34 -50 -40 -78" stroke="#5f4bb8" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g className="pulse-soft" style={{ animationDelay: `${delay}s` }}>
        <circle cx="6" cy="-112" r="34" fill={c} opacity=".3" />
        <circle cx="6" cy="-112" r="14" fill={c} />
        <circle cx="-40" cy="-80" r="20" fill={c} opacity=".28" />
        <circle cx="-40" cy="-80" r="8" fill={c} />
      </g>
    </g>
  )
}

export function DreamWorld() {
  const sparkles = useMemo(() => {
    const r = rng(77)
    return Array.from({ length: 14 }, () => ({ x: r() * 1600, y: 80 + r() * 560, r: 2 + r() * 3 }))
  }, [])
  return (
    <div className="world dream" aria-hidden="true">
      <div className="d-sky" />
      <div className="d-aurora a1" />
      <div className="d-aurora a2" />
      <div className="d-stars">
        <StarLayer className="d-stars-a" count={80} seed={41} maxSize={0.7} height={70} />
        <StarLayer className="d-stars-b" count={30} seed={42} maxSize={1.5} colors={['#fff', '#ffe29a', '#ffb3d9']} height={70} />
      </div>
      <div className="d-moon" />
      <svg className="layer d-far" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="gCloud" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#f3d9ff" />
          </linearGradient>
        </defs>
        <Island x={250} y={330} s={0.9} deco="castle" delay={0} />
        <Island x={900} y={220} s={0.6} deco="crystal" top="#cfe3ff" under="#5a47b8" delay={-2} />
        <Island x={1330} y={380} s={0.8} deco="tree" top="#c7f7e4" delay={-4} />
        <Island x={640} y={470} s={0.45} deco="crystal" top="#ffd1ec" delay={-1.3} />
        {sparkles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#fff" opacity=".6" className="pulse-soft" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
      </svg>
      <svg className="layer d-mid" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <CloudShape x={60} y={560} s={1.1} o={0.7} />
        <CloudShape x={820} y={520} s={1.4} o={0.65} />
        <CloudShape x={1250} y={600} s={0.9} o={0.7} />
        <CloudShape x={420} y={200} s={0.6} o={0.45} />
      </svg>
      <svg className="layer d-near" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice">
        <CloudShape x={-120} y={760} s={2.2} o={0.95} />
        <CloudShape x={640} y={800} s={2.6} o={0.95} />
        <CloudShape x={1180} y={770} s={2.2} o={0.95} />
        <GlowPlant x={230} y={800} s={1.1} c="#9ff0d0" />
        <GlowPlant x={820} y={830} s={1.3} c="#ffb3d9" delay={-1} />
        <GlowPlant x={1400} y={810} s={1} c="#b9a7ff" delay={-2} />
      </svg>
      <div className="d-tint" />
      <div className="d-glitch">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="d-heal" />
    </div>
  )
}
