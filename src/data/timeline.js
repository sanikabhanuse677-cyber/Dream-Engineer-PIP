// All journey timing is expressed in "viewport heights of scroll" (1 unit = 1 screen of scrolling).
export const TOTAL = 12.6
export const APPROACH_END = 2.0
export const PASS_END = 3.0

// start/end drive pointer-events + the active chapter; rest = where the nav buttons scroll to.
export const CHAPTERS = [
  { id: 1, start: 3.5, end: 5.0, rest: 4.7, fadeInAt: 3.3 },
  { id: 2, start: 5.0, end: 6.6, rest: 5.9 },
  { id: 3, start: 6.6, end: 8.6, rest: 7.6 },
  { id: 4, start: 8.6, end: 10.8, rest: 9.7 },
  { id: 5, start: 10.8, end: 12.6, rest: 12.2 },
]

export const NAV = [
  { key: 'top', label: 'Start' },
  { key: 'portal', label: 'The Portal' },
  { key: 'ch1', label: 'Fell From a Star' },
  { key: 'ch2', label: 'Dream Lab' },
  { key: 'ch3', label: 'Three Creations' },
  { key: 'ch4', label: 'The Glitch' },
  { key: 'ch5', label: 'Dream Hero' },
]

export function chapterAt(t) {
  if (t < CHAPTERS[0].start) return 0
  for (const c of CHAPTERS) if (t >= c.start && t < c.end) return c.id
  return 5
}
