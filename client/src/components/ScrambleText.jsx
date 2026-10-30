import { useEffect, useState } from 'react';
import useInView from '../hooks/useInView.js';

const GLYPHS = '!<>-_\\/[]{}=+*^?#01アカサタナ';

// Text that decodes itself from noise when it scrolls into view.
export default function ScrambleText({ text, as: Tag = 'span', className = '', delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const [out, setOut] = useState(text.replace(/\S/g, ' '));

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setOut(text);
    let frame = 0;
    let raf = 0;
    const total = text.length * 2.2 + 14;
    const startAt = performance.now() + delay;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now < startAt) return;
      frame++;
      const revealed = Math.max(0, frame - 10) / 2.2;
      setOut(
        text
          .split('')
          .map((ch, i) => (ch === ' ' ? ' ' : i < revealed ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join('')
      );
      if (frame > total) {
        cancelAnimationFrame(raf);
        setOut(text);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, delay]);

  return (
    <Tag ref={ref} className={`scramble ${className}`} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  );
}
