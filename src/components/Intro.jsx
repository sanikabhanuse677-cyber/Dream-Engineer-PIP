import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { StarLayer } from './Art'
import PipOrb from './PipOrb'
import { asset } from '../lib/asset'
import { giggle, playLullaby, stopLullaby, secretSong, chime } from '../lib/audio'
import { journeyApi } from '../lib/journeyApi'
import { PIP, FACTS, HERO_LINES, HERO_LINES_STARLIGHT } from '../data/story'

export function Hero({ mood, reduced, onSecret, secretFound }) {
  const heroRef = useRef(null)
  const tiltRef = useRef(null)
  const bounceRef = useRef(null)
  const [line, setLine] = useState(0)
  const [sparks, setSparks] = useState(0)
  const starlight = mood === 'starlight'
  const lines = starlight ? HERO_LINES_STARLIGHT : HERO_LINES

  // Pointer reaction: Pip leans toward the cursor / finger. quickTo keeps it smooth, cleanup removes listeners.
  useEffect(() => {
    if (reduced || !tiltRef.current) return
    const el = heroRef.current
    const target = tiltRef.current
    const xTo = gsap.quickTo(target, 'x', { duration: 0.9, ease: 'power3.out' })
    const yTo = gsap.quickTo(target, 'y', { duration: 0.9, ease: 'power3.out' })
    const rTo = gsap.quickTo(target, 'rotation', { duration: 0.9, ease: 'power3.out' })
    const move = (e) => {
      const r = el.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top) / r.height - 0.5
      xTo(nx * 34)
      yTo(ny * 22)
      rTo(nx * 9)
    }
    const leave = () => (xTo(0), yTo(0), rTo(0))
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    return () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(target)
    }
  }, [reduced])

  const poke = () => {
    giggle()
    setLine((l) => (l + 1) % lines.length)
    if (!reduced && bounceRef.current) gsap.fromTo(bounceRef.current, { scaleX: 1.07, scaleY: 0.92 }, { scaleX: 1, scaleY: 1, duration: 0.8, ease: 'elastic.out(1,0.35)', overwrite: true })
  }
  const star = () => {
    setSparks((n) => n + 1)
    secretSong()
    onSecret()
  }

  return (
    <section className="hero" id="top" ref={heroRef} aria-labelledby="hero-title">
      <div className="hero-sky" aria-hidden="true" />
      <StarLayer className="h-stars h-a" count={90} seed={101} maxSize={0.6} />
      <StarLayer className="h-stars h-b" count={40} seed={102} maxSize={1.2} colors={['#fff', '#cfe3ff', '#ffe29a']} />
      <div className="hero-moon" aria-hidden="true" />
      <div className="cloud c1" aria-hidden="true" />
      <div className="cloud c2" aria-hidden="true" />
      <div className="cloud c3" aria-hidden="true" />
      <div className="shooting" aria-hidden="true" />

      <button type="button" className={`secret-star ${secretFound ? 'found' : ''}`} onClick={star} aria-label={secretFound ? 'The secret star Pip hides. Tap to hear its song again' : 'A shy little star twinkling in the corner. Tap it?'}>
        ✦
      </button>
      {sparks > 0 && (
        <div className="sparks" key={sparks} aria-hidden="true">
          {Array.from({ length: 10 }, (_, i) => (
            <i key={i} style={{ '--a': `${i * 36}deg` }} />
          ))}
        </div>
      )}

      <div className="hero-inner">
        <div className="hero-copy">
          <p className="kicker">Junior Dream Engineer · Midnight Nursery</p>
          <h1 id="hero-title">
            Hi, I’m <span className="grad">Pip</span>
          </h1>
          <p className="tagline">“{PIP.tagline}”</p>
          <div className="cta-row">
            <button type="button" className="btn btn-primary" onClick={() => journeyApi.goTo('portal')}>
              Follow me through the portal <span aria-hidden="true">✦</span>
            </button>
            <a className="btn btn-ghost" href="#meet">
              Meet Pip
            </a>
          </div>
        </div>
        <div className="hero-pip">
          <div className="speech" aria-live="polite">
            {lines[line % lines.length]}
          </div>
          <div ref={tiltRef} className="tilt">
            <div ref={bounceRef} className="bounce-box">
              <div className="float">
                <PipOrb src={asset('pip-cloud.webp')} alt={PIP.alt.cloud} onPoke={poke} label="Poke Pip so he giggles" sleepy={starlight} />
                {starlight && (
                  <span className="zz" aria-hidden="true">
                    z<b>z</b>
                    <i>Z</i>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="scroll-hint" aria-hidden="true">
        scroll ↓
      </p>
    </section>
  )
}

export function MeetPip({ mood, onMood }) {
  const starlight = mood === 'starlight'
  const [playing, setPlaying] = useState(false)
  useEffect(() => () => stopLullaby(), [])
  const lullaby = () => {
    if (playing) {
      stopLullaby()
      setPlaying(false)
      return
    }
    setPlaying(true)
    playLullaby(() => setPlaying(false))
  }
  return (
    <section className="meet" id="meet" aria-labelledby="meet-title">
      <div className="meet-inner">
        <figure className="portrait-card">
          <img src={asset('pip-portrait.webp')} alt={PIP.alt.portrait} loading="lazy" decoding="async" width="640" height="960" />
          <figcaption>Pip · Junior Dream Engineer</figcaption>
        </figure>
        <div className="meet-copy">
          <p className="kicker">Nursery ID card</p>
          <h2 id="meet-title">Meet the baby behind your dreams</h2>
          <dl className="facts">
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="props">
            <button type="button" className={`prop ${starlight ? 'lit' : ''}`} onClick={() => (chime(starlight ? 1 : 3), onMood())} aria-pressed={starlight}>
              <img src={asset('dream-lantern.webp')} alt={PIP.alt.lantern} loading="lazy" width="96" height="86" />
              <span>
                <strong>Dream Lantern</strong>
                <small>{starlight ? 'Starlight Mode is on' : 'Tap to switch to Starlight Mode'}</small>
              </span>
            </button>
            <button type="button" className={`prop ${playing ? 'lit' : ''}`} onClick={lullaby} aria-pressed={playing}>
              <img src={asset('lullaby-box.webp')} alt={PIP.alt.box} loading="lazy" width="96" height="87" />
              <span>
                <strong>Lullaby Box</strong>
                <small>{playing ? 'Playing… tap to stop' : 'Tap to hear a tiny lullaby'}</small>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
