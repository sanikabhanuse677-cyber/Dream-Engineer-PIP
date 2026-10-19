export const PIP = {
  tagline: 'I build the dreams you fall asleep inside.',
  alt: {
    cloud: 'Pip, a baby with a smooth skull face, glowing eyes and a star-covered nightcap, waving from a fluffy cloud.',
    portrait: 'Pip holding a glowing nightlight lantern and a unicorn music box while sitting on a pink cloud.',
    box: 'The Lullaby Lab music box: a pastel pink box with a golden winding key and a tiny unicorn.',
    lantern: 'Pip’s glowing crescent-moon nightlight lantern with a brass handle.',
  },
}

export const FACTS = [
  ['Name', 'Pip'],
  ['What I am', 'A baby with a smooth skull face and glowing eye pinpricks'],
  ['Personality', 'Curious, sleepy, a little clumsy. I giggle at everything and hate silence.'],
  ['Job', 'Junior Dream Engineer at the Midnight Nursery'],
]

export const HERO_LINES = [
  'Hee hee! Hi there!',
  'Wanna see how I became a dream engineer?',
  'Psst… a shy star is hiding up in the sky.',
  'Silence is boooring. Say something!',
]
export const HERO_LINES_STARLIGHT = ['Shhh… the stars are sleeping.', 'Zzz… five more minutes…', 'The moon is so cozy tonight.']

export const SECRET = {
  title: 'You found Pip’s secret star!',
  text: 'Every lullaby has a hidden fifth note. Hum it softly and the stars will hum right back. ✦',
}

export const CHAPTER_TEXT = {
  1: {
    kicker: 'Chapter 1',
    title: 'The Baby Who Fell From a Star',
    body: 'One midnight, a star grew a little too sleepy and slipped out of the sky. It tumbled through the glowing clouds of Dreamland… and out popped me! A tiny, giggling, skull-faced baby, destined to discover the secrets of dreams.',
  },
  2: {
    kicker: 'Chapter 2',
    title: 'Welcome to Dream Lab',
    body: 'Dreamland hides a workshop where dreams are designed and repaired. I wobbled in, knocked over a blueprint, and the machines hummed hello. The Midnight Nursery made me their Junior Dream Engineer on the spot!',
  },
  3: {
    kicker: 'Chapter 3',
    title: 'Three Dreams, Three Creations',
    body: 'My first three inventions. Poke each preview, then open it up to see how it works.',
  },
  4: {
    kicker: 'Chapter 4',
    title: 'The Great Nightmare Glitch',
    body: 'Then — bzzzt! — Dreamland glitched. Sweet dreams turned strange and the Dream Core began to flicker. Help me fix it!',
  },
  5: {
    kicker: 'Chapter 5',
    title: 'The Dream Hero',
    body: 'The Core hummed back to life. The stars came home, and Dreamland glowed more beautifully than ever.',
  },
}

export const CLOSING = 'Even the smallest dreamer can make the biggest difference.'

export const INGREDIENTS = [
  { id: 'dust', label: 'Star Dust', icon: '✦', color: '#ffe29a' },
  { id: 'moon', label: 'Moonbeam', icon: '☾', color: '#cfe3ff' },
  { id: 'cloud', label: 'Cloud Fluff', icon: '☁', color: '#ffb3d9' },
  { id: 'hum', label: 'Lullaby Hum', icon: '♪', color: '#b9a7ff' },
]
export const RECIPES = {
  'dust+moon': { name: 'Silver Sparkle Sleep', note: 'Twinkles softly at the edges. Great for light sleepers.', colors: ['#cfe3ff', '#ffe29a'] },
  'cloud+dust': { name: 'Strawberry Skies', note: 'A pink sky that smells like warm pancakes.', colors: ['#ffb3d9', '#ffe29a'] },
  'dust+hum': { name: 'Chiming Constellation', note: 'The stars line up and ring like tiny bells.', colors: ['#b9a7ff', '#ffe29a'] },
  'cloud+moon': { name: 'Pillow Moon Float', note: 'You bob gently on a cloud, hugging the moon.', colors: ['#cfe3ff', '#ffb3d9'] },
  'hum+moon': { name: 'Moonlit Lullaby', note: 'A slow song drifts across a silver lake.', colors: ['#b9a7ff', '#cfe3ff'] },
  'cloud+hum': { name: 'Cuddle Cloud Chorus', note: 'Clouds hum along in perfect harmony.', colors: ['#ffb3d9', '#b9a7ff'] },
}

export const PROJECTS = [
  {
    id: 'candy',
    title: 'Candy Cloud Kingdom',
    short: 'A playful kingdom of candy-colored clouds and floating islands.',
    hint: 'Tap to change the weather flavor',
    long: 'Where the weather tastes like strawberry! Pip stitched together floating islands, gumdrop towers and clouds that change flavor with the breeze. It was the first dream Pip ever finished.',
    built: ['Islands float using a gentle bobbing loop', 'Every cloud flavor has its own color recipe', 'Wind speed changes how fast the kingdom drifts'],
  },
  {
    id: 'moon',
    title: 'Moonlight Adventure',
    short: 'A moonlit journey through floating islands, glowing plants and hidden stars.',
    hint: 'Tap to wake the glowing plants',
    long: 'A quiet night-walk across floating islands. Glowing plants light the way, and tiny stars hide in the shadows, waiting for a lantern to find them.',
    built: ['Plants glow when a visitor gets close', 'Stars are hidden under the dark and revealed by lantern light', 'Seven stars to find. Pip found six!'],
  },
  {
    id: 'repair',
    title: 'Nightmare Repair Machine',
    short: 'A magical machine that turns unstable dream energy into peaceful stars.',
    hint: 'Tap to repair the nightmare',
    long: 'Not every dream is sweet. Pip built a machine that gently swallows wobbly nightmare energy and gives it back as calm, sleepy stars. Nothing is ever thrown away.',
    built: ['Dial the nightmare intensity up or down', 'Three gears sort scribbles from sparkles', 'Every nightmare becomes the same number of stars'],
  },
]

export const PUZZLE = {
  symbols: [
    { id: 'moon', icon: '☾', label: 'Moon' },
    { id: 'star', icon: '✦', label: 'Star' },
    { id: 'cloud', icon: '☁', label: 'Cloud' },
    { id: 'heart', icon: '♥', label: 'Heart' },
    { id: 'note', icon: '♪', label: 'Note' },
  ],
  // Each puzzle is built by pressing these nodes from the solved state, so it is always solvable.
  scrambles: [[0, 2, 3], [1, 4], [0, 1, 3], [2, 3, 4], [0, 4, 2]],
}
