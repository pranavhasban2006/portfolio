import { useEffect, useState } from 'react';
import useInView from '../hooks/useInView.js';

export default function Counter({ value, suffix = '', decimals = 0, className = 'stat-value' }) {
  const [ref, inView] = useInView();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1400);
      setN(t < 1 ? value * (1 - Math.pow(1 - t, 3)) : value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return (
    <span ref={ref} className={className}>
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}
