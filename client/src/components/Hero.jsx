import NeuralHero from './NeuralHero.jsx';
import Magnetic from './Magnetic.jsx';

export default function Hero({ profile }) {
  const words = WORDS(profile.name);
  return (
    <header className="hero" id="top">
      <NeuralHero words={words} />
      <div className="hero-overlay">
        <p className="hero-kicker">
          <span className="dot" /> available for SWE and AI/ML roles
        </p>
        <div className="hero-bottom">
          <div>
            <h1 className="sr-only">{profile.name}, {profile.title}</h1>
            <p className="hero-title glitch" data-text={profile.title}>
              {profile.title}
            </p>
            <p className="hero-tagline">{profile.tagline}</p>
          </div>
          <div className="hero-ctas">
            <Magnetic href="#projects" className="btn primary">See my work</Magnetic>
            <Magnetic href="#contact" className="btn ghost">Get in touch</Magnetic>
          </div>
        </div>
        <p className="hero-hint">move your cursor through the network · click to send a shockwave</p>
      </div>
    </header>
  );
}

// Memoised per name so the canvas effect does not restart on every render.
const cache = new Map();
function WORDS(name) {
  if (!cache.has(name)) cache.set(name, [name.toUpperCase(), 'SWE', 'AI / ML', 'BUILDER']);
  return cache.get(name);
}
