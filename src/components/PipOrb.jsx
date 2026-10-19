import { forwardRef, useRef, useState } from 'react'
import gsap from 'gsap'
import { giggle } from '../lib/audio'

// Pip's artwork blended into the night with a soft moonlit halo, so the supplied renders keep their original look.
const PipOrb = forwardRef(function PipOrb({ src, alt, onPoke, label = 'Poke Pip', className = '', glow = true, sleepy = false }, ref) {
  const img = <img className="pip-img" src={src} alt={alt} draggable="false" decoding="async" />
  return (
    <div className={`pip-orb ${glow ? 'has-glow' : ''} ${sleepy ? 'is-sleepy' : ''} ${className}`} ref={ref}>
      {onPoke ? (
        <button type="button" className="pip-btn" onClick={onPoke} aria-label={label}>
          {img}
        </button>
      ) : (
        img
      )}
    </div>
  )
})
export default PipOrb

// Pip that giggles + squishes when poked (works with mouse, touch and keyboard).
export function PokePip({ src, alt, className = '', sleepy = false }) {
  const bounce = useRef(null)
  const [pop, setPop] = useState(0)
  const poke = () => {
    giggle()
    setPop((n) => n + 1)
    if (bounce.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(bounce.current, { scaleX: 1.08, scaleY: 0.9 }, { scaleX: 1, scaleY: 1, duration: 0.7, ease: 'elastic.out(1,0.35)', overwrite: true })
    }
  }
  return (
    <div className="poke-wrap">
      <div ref={bounce} className="bounce-box">
        <PipOrb src={src} alt={alt} onPoke={poke} className={className} sleepy={sleepy} label="Poke Pip to make him giggle" />
      </div>
      {pop > 0 && (
        <span key={pop} className="giggle-pop" aria-hidden="true">
          hee hee!
        </span>
      )}
    </div>
  )
}
