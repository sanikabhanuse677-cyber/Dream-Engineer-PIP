# Pip — The Little Dream Engineer

A scroll-driven, storybook portfolio for **Pip**, the skull-faced Junior Dream Engineer at the Midnight Nursery.
Built for *Baby's First Website* (haX.baby) — **Track 1: The Skull Baby (Pip)**.

Stack: React 19 + Vite + GSAP (ScrollTrigger / ScrollToPlugin). No backend, no API keys, no accounts.

## Install & run

Requires Node.js 18+ (tested on Node 22).

```bash
npm install
npm run dev        # dev server → http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the build → http://localhost:4173
```

`dist/` uses relative asset paths (`base: './'`), so it can be dropped on Netlify, Vercel, GitHub Pages, Cloudflare Pages or any static folder.

## How the scroll journey works

`src/components/Journey.jsx` builds **one GSAP timeline** (12.6 "screens" long), pinned with ScrollTrigger and `scrub`-bound to the scrollbar.
Nothing runs on timers, so scrolling up simply plays everything in reverse.

1. **0 → 2** Camera approaches the portal. Night layers (stars, moon, mountains, hills, foreground) scale at different rates for real depth; the portal grows and its rings spin with scroll.
2. **2 → 3** Fly-through: tunnel rings rush past, soft flash, and Dreamland scales down from "very close" to normal.
3. **3.5 → 12.6** Five chapters fade in/out in sequence while Dreamland's three parallax layers keep drifting forward. Chapter 4 adds a glitch + dimmed stars; Chapter 5 heals the sky and bursts the stars back.

Timing numbers live in `src/data/timeline.js`; copy and puzzle data in `src/data/story.js`.

## Feature checklist

- [x] Cute loader (real asset preloading, star meter, failsafe timeout)
- [x] Night intro with Pip, pointer-reactive tilt, idle float, poke-to-giggle (touch + keyboard too)
- [x] Scroll-driven portal titled "How I Became an Engineer", reversible camera move and fly-through
- [x] Five connected chapters, revealed sequentially, reversible
- [x] Ch2 Dream Lab: working Dream Mixer (pick 2 of 4 ingredients, 6 recipes) + lullaby tuner
- [x] Ch3 exactly three projects: interactive preview, short text, and a custom detail dialog each (Candy Cloud Kingdom, Moonlight Adventure, Nightmare Repair Machine)
- [x] Ch4 playable **Repair the Dream Core** puzzle: instructions, hint, reset, new puzzle, success animation. Always solvable; scrolling past it never blocks you
- [x] Ch5 celebration (glowing stars, gentle confetti), closing line, **Replay the Journey** (smooth rewind + resets puzzle, mixer and dialogs)
- [x] Dream Mode ⇄ Starlight Mode (header button or tap Pip's lantern): palette, stars, moon glow and Pip's mood change
- [x] Hidden Easter egg: the shy pink star in the hero sky (found counter in the header)
- [x] Sound: tiny Web Audio chimes/lullaby, only after user interaction, with a visible mute button
- [x] Chapter rail + header controls for navigation; keyboard-accessible, visible focus rings, alt text, skip link
- [x] Responsive (desktop, tablet, 375px phones); no horizontal overflow
- [x] `prefers-reduced-motion`: no pinning or camera moves; the story becomes a calm vertical layout, nothing hidden

## Credits

- Pip art, music box and lantern: official haX.baby **Pip Creator Asset Pack** (converted to WebP, original look kept).
- Everything else (worlds, portal, machines, project art, puzzle, audio, loader): original SVG / CSS / Web Audio.
- React, Vite, GSAP; fonts Fredoka + Nunito via Fontsource (SIL OFL).

## Honest notes & limitations

- Your ZIP contained only the four Pip renders, **no separate dream-world or portal image**, so the night world, portal and Dreamland are drawn in SVG/CSS in the requested palette.
- Pip's renders have a cream background, so they are blended into the night with a soft moonlit glow instead of being cut out (cutting out turned ragged). The Meet Pip card shows the portrait as a framed photo.
- Pip's face itself cannot change expression (raster art); Starlight Mode changes his tint, adds sleepy "Zzz" and changes his speech bubble.
- Tested in headless Chromium (desktop 1366×768, phones 390×844 and 375×667, reduced motion): scrolling down/up, dialogs, puzzle solve/reset/hint, mixer, nav rail, replay, Easter egg and mood toggle all passed with zero console errors.
- **Not tested:** real iOS Safari / Android hardware, screen readers, audible sound quality, or Lighthouse scores.
