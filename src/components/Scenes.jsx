import { useMemo } from 'react'
import { StarShape } from './Art'
import { PokePip } from './PipOrb'
import DreamLab from './DreamLab'
import Projects from './Projects'
import CorePuzzle from './CorePuzzle'
import { asset } from '../lib/asset'
import { rng } from '../lib/rng'
import { CHAPTER_TEXT, CLOSING, PIP } from '../data/story'

export function Scene({ id, active, children }) {
  return (
    <section className={`scene scene-${id} ${active ? 'is-active' : ''}`} aria-labelledby={`ch${id}-title`} aria-hidden={active ? undefined : true} inert={!active}>
      <div className="scene-inner">{children}</div>
    </section>
  )
}

export function StoryCard({ n, className = '', children }) {
  const t = CHAPTER_TEXT[n]
  return (
    <div className={`story-card ${className}`}>
      <p className="kicker">{t.kicker}</p>
      <h3 id={`ch${n}-title`}>{t.title}</h3>
      <p>{t.body}</p>
      {children}
    </div>
  )
}

export function Ch1({ active }) {
  return (
    <Scene id={1} active={active}>
      <div className="visual ch1-visual">
        <div className="falling-star" aria-hidden="true">
          <StarShape size={72} />
          <i className="trail" />
        </div>
        <i className="impact-ring" aria-hidden="true" />
        <i className="puff p1" aria-hidden="true" />
        <i className="puff p2" aria-hidden="true" />
        <i className="puff p3" aria-hidden="true" />
        <div className="ch1-pip">
          <PokePip src={asset('pip-cloud.webp')} alt={PIP.alt.cloud} />
        </div>
      </div>
      <StoryCard n={1} className="ch1-card" />
    </Scene>
  )
}

export function Ch2({ active, reduced, replayKey }) {
  return (
    <Scene id={2} active={active}>
      <StoryCard n={2} className="ch2-card" />
      <div className="visual ch2-visual">
        <DreamLab key={replayKey} reduced={reduced} />
      </div>
    </Scene>
  )
}

export function Ch3({ active, replayKey }) {
  return (
    <Scene id={3} active={active}>
      <div className="ch3-wrap">
        <StoryCard n={3} className="ch3-card" />
        <Projects key={replayKey} />
      </div>
    </Scene>
  )
}

export function Ch4({ active, replayKey, onSolved }) {
  return (
    <Scene id={4} active={active}>
      <StoryCard n={4} className="ch4-card" />
      <div className="visual ch4-visual">
        <CorePuzzle key={replayKey} onSolved={onSolved} />
      </div>
    </Scene>
  )
}

const CONFETTI = (() => {
  const r = rng(404)
  const colors = ['#ffb3d9', '#ffe29a', '#b9a7ff', '#cfe3ff', '#9ff0d0']
  return Array.from({ length: 34 }, () => ({ l: r() * 100, d: 7 + r() * 7, dl: -r() * 12, c: colors[Math.floor(r() * colors.length)], s: 6 + r() * 7, rot: r() * 360 }))
})()
const BURST = [[-190, -120], [-140, 40], [-210, -10], [190, -110], [150, 50], [210, 0], [-70, -170], [80, -170], [0, -200], [-100, 120], [110, 120], [0, 150]]

export function Ch5({ active, coreFixed, onReplay }) {
  const stars = useMemo(() => BURST, [])
  return (
    <Scene id={5} active={active}>
      <div className="visual ch5-visual">
        <div className="confetti" aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <i key={i} style={{ left: `${c.l}%`, width: c.s, height: c.s * 1.5, background: c.c, animationDuration: `${c.d}s`, animationDelay: `${c.dl}s` }} />
          ))}
        </div>
        <div className="ch5-stage">
          {stars.map(([x, y], i) => (
            <span key={i} className="ch5-star" data-x={x} data-y={y} aria-hidden="true">
              <StarShape size={i % 3 === 0 ? 40 : 28} />
            </span>
          ))}
          <div className="ch5-core" aria-hidden="true" />
          <div className="ch5-pip">
            <PokePip src={asset('pip-portrait.webp')} alt={PIP.alt.portrait} />
          </div>
        </div>
      </div>
      <StoryCard n={5} className="ch5-card">
        <p className="core-note">{coreFixed ? '✦ You and Pip repaired the Dream Core together.' : '✦ Pip repaired the Dream Core all by himself.'}</p>
        <blockquote className="ch5-closing">“{CLOSING}”</blockquote>
        <button type="button" className="btn btn-primary replay" onClick={onReplay}>
          ↺ Replay the Journey
        </button>
      </StoryCard>
    </Scene>
  )
}
