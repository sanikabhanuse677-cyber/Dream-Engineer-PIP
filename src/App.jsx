import { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Loader from './components/Loader'
import { Header, Rail, Toast } from './components/Chrome'
import { Hero, MeetPip } from './components/Intro'
import Journey from './components/Journey'
import Footer from './components/Footer'
import { useReducedMotion } from './lib/useReducedMotion'
import { journeyApi } from './lib/journeyApi'
import { setMuted, chime } from './lib/audio'
import { SECRET } from './data/story'

export default function App() {
  const reduced = useReducedMotion()
  const [loaded, setLoaded] = useState(false)
  const [mood, setMood] = useState('dream')
  const [muted, setMutedState] = useState(false)
  const [replayKey, setReplayKey] = useState(0)
  const [coreFixed, setCoreFixed] = useState(false)
  const [secretFound, setSecretFound] = useState(false)
  const [chapter, setChapter] = useState(-1)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    document.documentElement.dataset.mood = mood
  }, [mood])
  useEffect(() => {
    document.documentElement.dataset.core = coreFixed ? 'fixed' : 'glitch'
  }, [coreFixed])

  // Keep the page still while the loader is up, then let ScrollTrigger measure the real layout.
  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !loaded)
    if (loaded) requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [loaded])

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  const onMood = () => setMood((m) => (m === 'dream' ? 'starlight' : 'dream'))
  const onMute = () =>
    setMutedState((m) => {
      setMuted(!m)
      if (m) setTimeout(() => chime(2), 30)
      return !m
    })
  const onSecret = () => {
    setSecretFound(true)
    clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), ...SECRET })
    toastTimer.current = setTimeout(() => setToast(null), 7000)
  }
  const onReplay = useCallback(() => {
    setReplayKey((k) => k + 1)
    setCoreFixed(false)
    journeyApi.replay()
  }, [])

  return (
    <>
      <a className="skip-link" href="#meet">
        Skip to Pip’s story
      </a>
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Header mood={mood} onMood={onMood} muted={muted} onMute={onMute} secrets={secretFound ? 1 : 0} />
      <Rail current={chapter} />
      <main>
        <Hero mood={mood} reduced={reduced} onSecret={onSecret} secretFound={secretFound} />
        <MeetPip mood={mood} onMood={onMood} />
        <Journey key={reduced ? 'rm' : 'full'} reduced={reduced} replayKey={replayKey} coreFixed={coreFixed} onCoreFixed={() => setCoreFixed(true)} onReplay={onReplay} onChapter={setChapter} />
      </main>
      <Footer onReplay={onReplay} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  )
}
