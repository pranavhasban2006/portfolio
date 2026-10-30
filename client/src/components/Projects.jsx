import { useRef } from 'react';
import Section from './Section.jsx';

// Hovering a card shines an "x-ray" lens that reveals the engineering underneath:
// a blueprint layer with the stack and key results, masked to a circle around the cursor.
function ProjectCard({ p, i }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
    el.style.setProperty('--rx', `${((y / r.height) - 0.5) * -10}deg`);
    el.style.setProperty('--ry', `${((x / r.width) - 0.5) * 12}deg`);
  };
  const leave = () => {
    const el = ref.current;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <article
      ref={ref}
      className="project"
      style={{ '--accent': p.accent, '--delay': `${i * 120}ms` }}
      onPointerMove={move}
      onPointerLeave={leave}
      data-hot
    >
      <div className="project-face">
        <span className="project-num">{String(i + 1).padStart(2, '0')}</span>
        <span className="project-kind">{p.kind}</span>
        <h3>{p.title}</h3>
        <p>{p.summary}</p>
        <div className="project-links">
          {p.github && (
            <a href={p.github} target="_blank" rel="noreferrer">
              code ↗
            </a>
          )}
          {p.demo && (
            <a href={p.demo} target="_blank" rel="noreferrer">
              live ↗
            </a>
          )}
        </div>
        <ul className="project-tech">
          {p.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </div>
      <div className="project-xray" aria-hidden="true">
        <code>
          {`// ${p.slug}.config\nstack: [${p.tech.join(', ')}]\n\nresults:\n${p.highlights.map((h) => `  + ${h}`).join('\n')}`}
        </code>
      </div>
    </article>
  );
}

export default function Projects({ projects }) {
  return (
    <Section id="projects" index={2} title="Projects">
      <p className="section-lede">Hover a card to x-ray it.</p>
      <div className="projects">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} p={p} i={i} />
        ))}
      </div>
    </Section>
  );
}
