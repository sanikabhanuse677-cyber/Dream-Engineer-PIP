import { NAV } from '../data/timeline'
import { journeyApi } from '../lib/journeyApi'

export function Header({ mood, onMood, muted, onMute, secrets }) {
  const starlight = mood === 'starlight'
  return (
    <header className="topbar">
      <a className="brand" href="#top" onClick={(e) => (e.preventDefault(), journeyApi.goTo('top'))}>
        <span className="brand-star" aria-hidden="true">✦</span>
        <span className="brand-text">
          Pip <small>Midnight Nursery</small>
        </span>
      </a>
      <div className="top-actions">
        <span className="secret-count" title="Secret stars found" aria-label={`Secret stars found: ${secrets} of 1`}>
          <span aria-hidden="true">★</span> {secrets}/1
        </span>
        <button type="button" className="chip-btn" aria-pressed={starlight} onClick={onMood} title="Switch between Dream Mode and Starlight Mode">
          <span aria-hidden="true">{starlight ? '🌙' : '🌸'}</span>
          <span className="chip-label">{starlight ? 'Starlight Mode' : 'Dream Mode'}</span>
        </button>
        <button type="button" className="chip-btn" aria-pressed={muted} onClick={onMute} aria-label={muted ? 'Sound is off. Turn sound on' : 'Sound is on. Mute sound'}>
          <span aria-hidden="true">{muted ? '🔇' : '🔔'}</span>
          <span className="chip-label">{muted ? 'Muted' : 'Sound on'}</span>
        </button>
      </div>
    </header>
  )
}

// Right-hand chapter rail: also the keyboard-friendly way to jump around the scroll journey.
export function Rail({ current }) {
  const idxFor = (c) => (c < 0 ? 0 : c === 0 ? 1 : c + 1)
  const active = idxFor(current)
  return (
    <nav className="rail" aria-label="Story chapters">
      <ol>
        {NAV.map((n, i) => (
          <li key={n.key}>
            <button type="button" className={i === active ? 'on' : ''} aria-current={i === active ? 'step' : undefined} onClick={() => journeyApi.goTo(n.key)}>
              <span className="rail-label">{n.label}</span>
              <span className="rail-dot" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function Toast({ toast, onClose }) {
  return (
    <div className="toast-zone" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.id}>
          <span className="toast-icon" aria-hidden="true">🌟</span>
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.text}</p>
          </div>
          <button type="button" className="toast-x" onClick={onClose} aria-label="Close message">×</button>
        </div>
      )}
    </div>
  )
}
