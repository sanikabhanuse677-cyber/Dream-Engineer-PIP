import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { NightWorld, Portal, Tunnel, DreamWorld } from './Art'
import { Ch1, Ch2, Ch3, Ch4, Ch5 } from './Scenes'
import { journeyApi } from '../lib/journeyApi'
import { TOTAL, APPROACH_END as A, PASS_END as P, CHAPTERS, chapterAt } from '../data/timeline'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
ScrollTrigger.config({ ignoreMobileResize: true })

const PortalTitle = () => (
  <div className="portal-title">
    <p className="kicker">Midnight Nursery presents</p>
    <h2 id="portal-title">How I Became an Engineer</h2>
    <p className="portal-sub">Scroll down to fly through the portal. Scroll up to rewind.</p>
  </div>
)

export default function Journey({ reduced, replayKey, coreFixed, onCoreFixed, onReplay, onChapter }) {
  const wrapRef = useRef(null)
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const lastCh = useRef(-1)
  const [active, setActive] = useState(0)

  const setCh = useCallback(
    (c) => {
      if (lastCh.current === c) return
      lastCh.current = c
      setActive(c)
      onChapter(c)
    },
    [onChapter],
  )

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current

    /* ---------- Reduced motion: no pinning, no camera moves. Chapters become a calm vertical story. ---------- */
    if (reduced) {
      setActive(0)
      const goTo = (key) => {
        if (key === 'top') return window.scrollTo({ top: 0 })
        const el = key === 'portal' ? section : section.querySelector(`.scene-${key.replace('ch', '')}`)
        el && el.scrollIntoView({ block: 'start' })
      }
      journeyApi.goTo = goTo
      journeyApi.replay = () => window.scrollTo({ top: 0 })
      const scenes = [...section.querySelectorAll('.scene')]
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => e.isIntersecting && setCh(+e.target.className.match(/scene-(\d)/)[1]))
        },
        { threshold: 0.5 },
      )
      scenes.forEach((s) => io.observe(s))
      return () => io.disconnect()
    }

    /* ---------- Full journey: ONE scrubbed GSAP timeline pinned to the scroll position. ---------- */
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stage)
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * TOTAL}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setCh(chapterAt(self.progress * TOTAL)),
          onLeaveBack: () => (lastCh.current = -2, setCh(-1)),
          onLeave: () => setCh(5),
        },
      })
      tl.duration(TOTAL)

      // 1) Camera approaches the portal: layers scale at different speeds = real depth.
      tl.to(q('.n-near'), { scale: 3.8, ease: 'power1.in', duration: A }, 0)
        .to(q('.n-near'), { opacity: 0, duration: 0.7 }, 1.3)
        .to(q('.n-mid'), { scale: 2.4, ease: 'power1.in', duration: A }, 0)
        .to(q('.n-far'), { scale: 1.45, duration: A }, 0)
        .to(q('.n-stars'), { scale: 1.7, duration: P }, 0)
        .to(q('.n-moon'), { scale: 1.3, yPercent: -10, duration: A }, 0)
        .to(q('.fireflies'), { scale: 2.2, opacity: 0, duration: A }, 0)
        .to(q('.portal'), { scale: 3.2, ease: 'power1.in', duration: A }, 0)
        .to(q('.portal-rings'), { rotation: 220, duration: P }, 0)
        .to(q('.portal-title'), { opacity: 0, y: -50, duration: 0.7 }, 0.9)
        .to(q('.scroll-cue'), { opacity: 0, duration: 0.3 }, 0.1)

      // 2) Fly through: portal swallows the screen, tunnel rings rush past, a soft flash hides the swap.
      tl.to(q('.portal'), { scale: 10, ease: 'power2.in', duration: P - A }, A)
        .fromTo(q('.t-ring'), { scale: 0.1 }, { scale: 6, ease: 'power1.in', duration: 1.5, stagger: 0.13 }, 1.2)
        .fromTo(q('.t-ring'), { opacity: 0 }, { opacity: 1, duration: 0.35, stagger: 0.13 }, 1.2)
        .to(q('.t-ring'), { opacity: 0, duration: 0.5, stagger: 0.13 }, 2.0)
        .to(q('.night'), { opacity: 0, duration: 0.3 }, 2.35)
        .to(q('.portal'), { opacity: 0, duration: 0.3 }, 2.55)
        .fromTo(q('.flash'), { opacity: 0 }, { opacity: 1, duration: 0.35 }, 2.15)
        .to(q('.flash'), { opacity: 0, duration: 0.55 }, 2.6)

      // 3) Emerge in Dreamland (scales down from "very close" to normal) and keep drifting forward with every chapter.
      const D = TOTAL - 2.3
      tl.fromTo(q('.dream'), { opacity: 0, scale: 2.5 }, { opacity: 1, scale: 1, ease: 'power2.out', duration: 1.0 }, 2.25)
        .fromTo(q('.d-far'), { xPercent: 3, scale: 1 }, { xPercent: -3, scale: 1.18, duration: D }, 2.3)
        .fromTo(q('.d-mid'), { xPercent: 6, scale: 1 }, { xPercent: -6, scale: 1.35, duration: D }, 2.3)
        .fromTo(q('.d-near'), { xPercent: 10, yPercent: 0, scale: 1 }, { xPercent: -10, yPercent: 5, scale: 1.7, duration: D }, 2.3)
        .fromTo(q('.d-stars'), { yPercent: 0 }, { yPercent: -7, duration: D }, 2.3)

      // 4) Chapter scenes: fade/slide in, fade out. Every tween is scrubbed, so scrolling up plays it all in reverse.
      CHAPTERS.forEach((c, i) => {
        const sc = q(`.scene-${c.id}`)
        const inner = q(`.scene-${c.id} .scene-inner`)
        const at = c.fadeInAt ?? c.start - 0.15
        tl.fromTo(sc, { opacity: 0 }, { opacity: 1, duration: 0.4 }, at)
        tl.fromTo(inner, { y: 36, scale: 0.97 }, { y: 0, scale: 1, ease: 'power2.out', duration: 0.5 }, at)
        if (i < CHAPTERS.length - 1) {
          tl.fromTo(sc, { opacity: 1 }, { opacity: 0, duration: 0.3, immediateRender: false }, c.end - 0.3)
          tl.fromTo(inner, { y: 0 }, { y: -28, duration: 0.3, immediateRender: false }, c.end - 0.3)
        }
      })

      // Chapter 1: the star falls, lands, Pip bursts out.
      tl.fromTo(q('.falling-star'), { x: '34vw', y: '-70vh', scale: 0.5, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, ease: 'power2.in', duration: 0.7 }, 3.4)
        .to(q('.falling-star'), { opacity: 0, scale: 2.4, duration: 0.15 }, 4.1)
        .fromTo(q('.impact-ring'), { scale: 0.2, opacity: 0 }, { scale: 3.4, opacity: 0.9, duration: 0.35 }, 4.1)
        .to(q('.impact-ring'), { opacity: 0, duration: 0.35 }, 4.45)
        .fromTo(q('.puff'), { scale: 0.1, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.06 }, 4.0)
        .fromTo(q('.ch1-pip'), { scale: 0.05, opacity: 0, rotation: -40 }, { scale: 1, opacity: 1, rotation: 0, ease: 'back.out(1.6)', duration: 0.6 }, 4.1)
        .fromTo(q('.ch1-card'), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, 4.25)

      // Chapter 4: Dreamland glitches, stars dim. Chapter 5: everything heals, stars return.
      tl.fromTo(q('.d-glitch'), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 8.4)
        .to(q('.d-glitch'), { opacity: 0, duration: 0.6 }, 10.8)
        .fromTo(q('.d-tint'), { opacity: 0 }, { opacity: 1, duration: 0.8 }, 8.4)
        .to(q('.d-tint'), { opacity: 0, duration: 0.8 }, 10.8)
        .to(q('.d-stars'), { opacity: 0.1, duration: 0.8 }, 8.5)
        .to(q('.d-stars'), { opacity: 1, duration: 1.1 }, 10.9)
        .fromTo(q('.d-heal'), { opacity: 0 }, { opacity: 1, duration: 0.9 }, 10.8)
        .fromTo(q('.ch5-core'), { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.5)' }, 10.95)
        .fromTo(q('.ch5-star'), { scale: 0, opacity: 0, x: 0, y: 0 }, { scale: 1, opacity: 1, x: (i, el) => +el.dataset.x * (window.innerWidth < 720 ? 0.55 : 1), y: (i, el) => +el.dataset.y * (window.innerWidth < 720 ? 0.55 : 1), ease: 'back.out(1.7)', duration: 0.7, stagger: 0.05 }, 11.1)
        .fromTo(q('.ch5-card'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, 11.4)

      const st = tl.scrollTrigger
      const yAt = (t) => st.start + (t / TOTAL) * (st.end - st.start)
      const scrollTo = (y) => {
        const dist = Math.abs(y - window.scrollY) / window.innerHeight
        gsap.to(window, { scrollTo: { y, autoKill: true }, duration: Math.min(3.2, 0.7 + dist * 0.4), ease: 'power2.inOut', overwrite: true })
      }
      journeyApi.goTo = (key) => {
        if (key === 'top') return scrollTo(0)
        if (key === 'portal') return scrollTo(Math.ceil(st.start))
        const c = CHAPTERS[+key.replace('ch', '') - 1]
        scrollTo(Math.round(yAt(c.rest)))
      }
      journeyApi.replay = () => scrollTo(0)
    }, wrapRef)

    return () => {
      ctx.revert()
      journeyApi.goTo = () => {}
      journeyApi.replay = () => {}
      lastCh.current = -1
    }
  }, [reduced, setCh])

  const is = (n) => reduced || active === n
  return (
    <div className={`journey-wrap ${reduced ? 'rm' : ''}`} ref={wrapRef}>
      <section className="journey" id="journey" ref={sectionRef} aria-labelledby="portal-title">
        <div className="stage" ref={stageRef}>
          {reduced ? (
            <div className="rm-intro">
              <PortalTitle />
              <div className="rm-portal">
                <Portal />
              </div>
            </div>
          ) : (
            <>
              <NightWorld />
              <Portal />
              <Tunnel />
            </>
          )}
          <DreamWorld />
          {!reduced && (
            <>
              <div className="flash" aria-hidden="true" />
              <PortalTitle />
              <p className="scroll-cue" aria-hidden="true">
                <span>scroll</span>
                <i>↓</i>
              </p>
            </>
          )}
          <div className="scenes">
            <Ch1 active={is(1)} />
            <Ch2 active={is(2)} reduced={reduced} replayKey={replayKey} />
            <Ch3 active={is(3)} replayKey={replayKey} />
            <Ch4 active={is(4)} replayKey={replayKey} onSolved={onCoreFixed} />
            <Ch5 active={is(5)} coreFixed={coreFixed} onReplay={onReplay} />
          </div>
        </div>
      </section>
    </div>
  )
}
