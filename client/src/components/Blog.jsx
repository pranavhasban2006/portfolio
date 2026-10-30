import { useEffect, useState } from 'react';
import Section from './Section.jsx';

export default function Blog({ posts }) {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <Section id="blog" index={7} title="Blog">
      <ul className="posts">
        {posts.map((p) => (
          <li key={p.slug}>
            <button className="post" onClick={() => setOpen(p)}>
              <time>{p.date}</time>
              <span className="post-title" data-text={p.title}>
                {p.title}
              </span>
              <span className="post-meta">
                {p.tags.map((t) => `#${t}`).join(' ')} · {p.readMins} min
              </span>
              <span className="post-arrow">→</span>
            </button>
          </li>
        ))}
      </ul>
      {open && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={open.title} onClick={() => setOpen(null)}>
          <article className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(null)} aria-label="Close">
              ×
            </button>
            <time>{open.date}</time>
            <h3>{open.title}</h3>
            <p className="muted">{open.excerpt}</p>
            <p>{open.body}</p>
          </article>
        </div>
      )}
    </Section>
  );
}
