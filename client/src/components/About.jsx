import { useRef } from 'react';
import Section from './Section.jsx';
import useScrollProgress from '../hooks/useScrollProgress.js';
import Counter from './Counter.jsx';

// Each word ignites as the paragraph scrolls past, like reading with a highlighter.
export default function About({ profile }) {
  const textRef = useRef(null);
  const progress = useScrollProgress(textRef);
  const words = profile.about.join(' ¶ ').split(' ');
  const lit = Math.floor(progress * words.length * 1.15);

  return (
    <Section id="about" index={1} title="About">
      <div className="about-grid">
        <p ref={textRef} className="about-text">
          {words.map((wd, i) =>
            wd === '¶' ? (
              <span key={i} className="para-break" />
            ) : (
              <span key={i} className={`word ${i < lit ? 'lit' : ''}`}>
                {wd}{' '}
              </span>
            )
          )}
        </p>
        <div className="stats">
          {profile.stats.map((s) => (
            <div className="stat" key={s.label} data-hot>
              <Counter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
          <div className="stat location">
            <span className="stat-label">based in</span>
            <span>{profile.location}</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
