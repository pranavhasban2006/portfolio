import { useRef } from 'react';
import Section from './Section.jsx';
import useScrollProgress from '../hooks/useScrollProgress.js';

// A circuit trace that is etched as you scroll; each stop powers on when the current reaches it.
export default function Experience({ experience }) {
  const ref = useRef(null);
  const progress = useScrollProgress(ref);

  return (
    <Section id="experience" index={3} title="Journey">
      <div className="timeline" ref={ref} style={{ '--p': progress }}>
        <div className="trace">
          <div className="trace-fill" />
          <div className="trace-spark" />
        </div>
        {experience.map((e, i) => {
          const on = progress > (i + 0.2) / experience.length;
          return (
            <div key={e.role + e.company} className={`stop ${on ? 'on' : ''}`}>
              <span className="node" />
              <div className="stop-body">
                <span className="period">{e.period}</span>
                <h3>
                  {e.role} <em>@ {e.company}</em>
                </h3>
                <ul>
                  {e.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                {e.link && (
                  <a className="stop-link" href={e.link} target="_blank" rel="noreferrer">
                    view on GitHub ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
