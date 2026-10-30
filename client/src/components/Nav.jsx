import { useEffect, useState } from 'react';

const LINKS = ['about', 'projects', 'experience', 'skills', 'dsa', 'resume', 'blog', 'contact'];

export default function Nav() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? scrollY / max : 0);
      let current = '';
      for (const id of LINKS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < innerHeight * 0.4) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${open ? 'open' : ''}`}>
      <a href="#top" className="logo" data-hot>
        P<span>.</span>
      </a>
      <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}>
        <span />
        <span />
      </button>
      <ul>
        {LINKS.map((id, i) => (
          <li key={id}>
            <a href={`#${id}`} className={active === id ? 'active' : ''} onClick={() => setOpen(false)}>
              <small>{String(i + 1).padStart(2, '0')}</small>
              {id === 'experience' ? 'journey' : id}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-progress" style={{ transform: `scaleX(${progress})` }} />
    </nav>
  );
}
