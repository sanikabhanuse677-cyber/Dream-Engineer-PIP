// Deterministic pseudo-random helpers so the art is identical on every load.
export function rng(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// One element + many box-shadows = a whole star layer for the price of a single node.
export function starShadows(count, seed, { maxSize = 1.4, colors = ['#ffffff'], top = 0, height = 100 } = {}) {
  const r = rng(seed)
  const out = []
  for (let i = 0; i < count; i++) {
    const x = (r() * 100).toFixed(2)
    const y = (top + r() * height).toFixed(2)
    const s = (r() * maxSize).toFixed(2)
    out.push(`${x}vw ${y}vh 0 ${s}px ${colors[Math.floor(r() * colors.length)]}`)
  }
  return out.join(',')
}

// Smooth ridge-line path for hills / mountains.
export function ridge(seed, base, amp, step = 80, w = 1600, h = 900) {
  const r = rng(seed)
  const pts = []
  for (let x = -step; x <= w + step; x += step) pts.push([x, base - r() * amp])
  let d = `M-${step},${h} L${pts[0][0]},${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1]
    const [cx, cy] = pts[i]
    const mx = (px + cx) / 2
    d += ` Q${px},${py.toFixed(1)} ${mx},${((py + cy) / 2).toFixed(1)}`
  }
  const last = pts[pts.length - 1]
  return d + ` L${last[0]},${last[1].toFixed(1)} L${w + step},${h} Z`
}
