import { useState } from 'react';
import Section from './Section.jsx';

// Skills as a planetary system: each group is an orbit, each skill a moon.
// Hover a group in the legend to pull that orbit into focus.
export default function Skills({ skills }) {
  const [focus, setFocus] = useState(null);

  return (
    <Section id="skills" index={4} title="Skills">
      <div className="skills-wrap">
        <div className={`orbits ${focus !== null ? 'focused' : ''}`} aria-hidden="true">
          <div className="core">
            <span>{'</>'}</span>
          </div>
          {skills.map((g, gi) => {
            const radius = 18 + gi * 10;
            return (
              <div
                key={g.group}
                className={`orbit ${focus === gi ? 'is-focus' : ''}`}
                style={{
                  '--r': `${radius}%`,
                  '--dur': `${38 + gi * 14}s`,
                  '--dir': gi % 2 ? 'reverse' : 'normal',
                }}
              >
                {g.items.map((s, si) => (
                  <div key={s} className="moon" style={{ '--a': `${(360 / g.items.length) * si}deg` }}>
                    <span className="moon-inner">{s}</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
        <div className="skills-legend">
          {skills.map((g, gi) => (
            <div
              key={g.group}
              className={`legend-row ${focus === gi ? 'is-focus' : ''}`}
              onPointerEnter={() => setFocus(gi)}
              onPointerLeave={() => setFocus(null)}
              data-hot
            >
              <h3>
                <span>{String(gi + 1).padStart(2, '0')}</span> {g.group}
              </h3>
              <p>{g.items.join(' · ')}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
