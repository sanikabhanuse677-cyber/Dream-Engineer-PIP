import { useEffect, useMemo, useRef, useState } from 'react'
import { PUZZLE } from '../data/story'
import { chime, buzz, success } from '../lib/audio'

const N = 5
const flip = (arr, i) => {
  for (const k of [i - 1, i, i + 1]) arr[(k + N) % N] = !arr[(k + N) % N]
}

export default function CorePuzzle({ onSolved }) {
  const [round, setRound] = useState(0)
  const scramble = PUZZLE.scrambles[round % PUZZLE.scrambles.length]
  const initial = useMemo(() => {
    const s = Array(N).fill(true)
    scramble.forEach((i) => flip(s, i))
    return s
  }, [scramble])

  const [nodes, setNodes] = useState(initial)
  const [parity, setParity] = useState(Array(N).fill(false))
  const [moves, setMoves] = useState(0)
  const [hint, setHint] = useState(null)
  const [shaking, setShaking] = useState(false)
  const hintTimer = useRef(null)
  const shakeTimer = useRef(null)
  const solved = nodes.every(Boolean)

  useEffect(() => {
    setNodes(initial)
    setParity(Array(N).fill(false))
    setMoves(0)
    setHint(null)
  }, [initial])

  useEffect(() => {
    if (solved) {
      success()
      onSolved && onSolved()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solved])
  useEffect(
    () => () => {
      clearTimeout(hintTimer.current)
      clearTimeout(shakeTimer.current)
    },
    [],
  )

  const press = (i) => {
    if (solved) return
    const next = [...nodes]
    flip(next, i)
    const wasLit = nodes.filter(Boolean).length
    const nowLit = next.filter(Boolean).length
    if (!next.every(Boolean)) if (nowLit >= wasLit) chime(i)
      else {
        buzz()
        setShaking(true)
        clearTimeout(shakeTimer.current)
        shakeTimer.current = setTimeout(() => setShaking(false), 450)
      }
    setNodes(next)
    setParity((p) => p.map((v, k) => (k === i ? !v : v)))
    setMoves((m) => m + 1)
    setHint(null)
  }
  const reset = () => {
    setNodes(initial)
    setParity(Array(N).fill(false))
    setMoves(0)
    setHint(null)
  }
  const again = () => setRound((r) => r + 1)
  const showHint = () => {
    // The puzzle is the solved state plus presses on `scramble`; undoing exactly those presses solves it.
    const need = []
    for (let i = 0; i < N; i++) if (scramble.includes(i) !== parity[i]) need.push(i)
    if (!need.length) return
    setHint(need[0])
    clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setHint(null), 3200)
  }

  const lit = nodes.filter(Boolean).length
  return (
    <div className={`puzzle ${solved ? 'solved' : ''}`}>
      <div className={`core-wrap ${shaking ? 'shaking' : ''}`}>
        <svg className="core-links" viewBox="-100 -100 200 200" aria-hidden="true">
          {nodes.map((on, i) => {
            const j = (i + 1) % N
            const a = (i / N) * Math.PI * 2 - Math.PI / 2
            const b = (j / N) * Math.PI * 2 - Math.PI / 2
            return <line key={i} x1={Math.cos(a) * 74} y1={Math.sin(a) * 74} x2={Math.cos(b) * 74} y2={Math.sin(b) * 74} className={on && nodes[j] ? 'lit' : ''} />
          })}
        </svg>
        <div className="core" aria-hidden="true">
          <span className="core-ico">{solved ? '✦' : '⚡'}</span>
          <small>{solved ? 'STABLE' : 'GLITCHING'}</small>
        </div>
        {PUZZLE.symbols.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={`node n${i} ${nodes[i] ? 'on' : 'off'} ${hint === i ? 'hint' : ''}`}
            style={{ '--i': i }}
            onClick={() => press(i)}
            disabled={solved}
            aria-pressed={nodes[i]}
            aria-label={`${s.label} node, ${nodes[i] ? 'glowing' : 'dark'}. Flips itself and its two neighbours.`}
          >
            <span aria-hidden="true">{s.icon}</span>
          </button>
        ))}
        {solved && (
          <div className="success-burst" aria-hidden="true">
            {Array.from({ length: 14 }, (_, i) => (
              <i key={i} style={{ '--a': `${i * (360 / 14)}deg`, '--d': `${i % 3}` }} />
            ))}
          </div>
        )}
      </div>
      <div className="puzzle-side">
        <p className="puzzle-help">
          <strong>How to play:</strong> light all five nodes. Pressing a node flips <em>it and its two neighbours</em>.
        </p>
        <p className="puzzle-status" aria-live="polite">
          {solved ? `🎉 Dream Core stable! Solved in ${moves} ${moves === 1 ? 'move' : 'moves'}.` : `${lit}/5 lit · ${moves} ${moves === 1 ? 'move' : 'moves'}${hint !== null ? ` · Try the ${PUZZLE.symbols[hint].label} node` : ''}`}
        </p>
        <div className="puzzle-actions">
          {!solved && (
            <>
              <button type="button" className="btn btn-ghost" onClick={showHint}>
                💡 Hint
              </button>
              <button type="button" className="btn btn-ghost" onClick={reset}>
                ↺ Reset
              </button>
            </>
          )}
          {solved && (
            <>
              <button type="button" className="btn btn-primary" onClick={again}>
                Try a new puzzle
              </button>
              <button type="button" className="btn btn-ghost" onClick={reset}>
                ↺ Replay this one
              </button>
            </>
          )}
        </div>
        <p className="puzzle-skip">Stuck? You can always keep scrolling. Pip will fix the Core himself.</p>
      </div>
    </div>
  )
}
