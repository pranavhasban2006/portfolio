import { useEffect, useRef } from 'react';

// A comet cursor: a chain of springs that whips behind the pointer,
// plus a ring that inverts whatever it passes over and swells on interactive elements.
const SEGMENTS = 14;

export default function Cursor() {
  const ringRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.body.classList.add('has-cursor');
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const ring = ringRef.current;
    const pts = Array.from({ length: SEGMENTS }, () => ({ x: innerWidth / 2, y: innerHeight / 2 }));
    const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    const ringPos = { x: mouse.x, y: mouse.y };
    let raf = 0;
    let hue = 0;

    const resize = () => {
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const hot = e.target.closest('a, button, input, textarea, [data-hot]');
      ring.classList.toggle('hot', !!hot);
    };
    const onDown = () => ring.classList.add('down');
    const onUp = () => ring.classList.remove('down');

    const tick = () => {
      raf = requestAnimationFrame(tick);
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;
      ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;

      pts[0].x = mouse.x;
      pts[0].y = mouse.y;
      for (let i = 1; i < SEGMENTS; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * 0.45;
        pts[i].y += (pts[i - 1].y - pts[i].y) * 0.45;
      }
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      hue = (hue + 1.2) % 360;
      for (let i = 1; i < SEGMENTS; i++) {
        const t = 1 - i / SEGMENTS;
        ctx.strokeStyle = `hsla(${(hue + i * 12) % 360}, 100%, 60%, ${t})`;
        ctx.lineWidth = t * 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-cursor');
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-trail" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
