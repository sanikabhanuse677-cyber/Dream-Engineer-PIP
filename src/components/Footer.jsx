export default function Footer({ onReplay }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-quote">“I build the dreams you fall asleep inside.” — Pip</p>
        <button type="button" className="btn btn-primary" onClick={onReplay}>
          ↺ Replay the Journey
        </button>
        <section className="credits" aria-labelledby="credits-title">
          <h2 id="credits-title">Credits</h2>
          <ul>
            <li>
              Pip character art, music box and lantern renders: the official <a href="https://hax.baby/baby-problem" target="_blank" rel="noreferrer">haX.baby Pip Creator Asset Pack</a> (Track 1).
            </li>
            <li>Worlds, portal, machines, projects, puzzle, audio chimes and the loader: original SVG / CSS / Web Audio made for this project.</li>
            <li>
              Built with <a href="https://react.dev" target="_blank" rel="noreferrer">React</a>, <a href="https://vite.dev" target="_blank" rel="noreferrer">Vite</a> and <a href="https://gsap.com" target="_blank" rel="noreferrer">GSAP</a> (ScrollTrigger). Fonts: Fredoka and Nunito via Fontsource (SIL OFL).
            </li>
            <li>Made for Baby’s First Website · haX.baby · Track 1: The Skull Baby.</li>
          </ul>
        </section>
      </div>
    </footer>
  )
}
