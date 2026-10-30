import { useEffect, useRef } from 'react';

// A living neural network that assembles itself into words.
// Particles are neurons; nearby neurons wire together; signals fire along the wires.
// The cursor repels neurons, clicking sends a shockwave, and the words morph every few seconds.

const COLORS = ['#00f0ff', '#ff2bd6', '#c6ff00'];

function sampleText(text, w, h, step) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  let size = Math.min(w / (text.length * 0.62), h * 0.42);
  ctx.font = `700 ${size}px "Space Grotesk", sans-serif`;
  const measured = ctx.measureText(text).width;
  if (measured > w * 0.9) size *= (w * 0.9) / measured;
  ctx.font = `700 ${size}px "Space Grotesk", sans-serif`;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h * (w < 700 ? 0.4 : 0.42));
  const data = ctx.getImageData(0, 0, w, h).data;
  const pts = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
    }
  }
  // Shuffle so particles cross the screen when words change.
  for (let i = pts.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [pts[i], pts[j]] = [pts[j], pts[i]];
  }
  return pts;
}

export default function NeuralHero({ words }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    let w = 0;
    let h = 0;
    let step = 8;
    let particles = [];
    let targetsByWord = [];
    let wordIndex = 0;
    let pulses = [];
    let shock = null;
    let raf = 0;
    let lastMorph = performance.now();
    let grid = new Map();

    const ambientTarget = () => ({ x: Math.random() * w, y: Math.random() * h, ambient: true });

    function applyWord(i) {
      const targets = targetsByWord[i];
      particles.forEach((p, k) => {
        const t = targets[k];
        p.tx = t ? t.x : ambientTarget().x;
        p.ty = t ? t.y : ambientTarget().y;
        p.inWord = !!t;
      });
    }

    function setup() {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      step = w < 700 ? 4 : 8;
      targetsByWord = words.map((wd) => sampleText(wd, w, h, step));
      const need = Math.max(...targetsByWord.map((t) => t.length)) + Math.round((w * h) / 9000);
      particles = Array.from({ length: need }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        tx: 0,
        ty: 0,
        inWord: false,
        color: COLORS[i % 3],
        phase: Math.random() * Math.PI * 2,
      }));
      applyWord(wordIndex);
    }

    // Spatial hash as a linked list in typed arrays, rebuilt each frame without allocating.
    let cols = 0;
    let rows = 0;
    let cell = 16;
    let head = new Int32Array(0);
    let next = new Int32Array(0);

    function buildGrid() {
      cell = step * 2;
      cols = Math.ceil(w / cell) + 2;
      rows = Math.ceil(h / cell) + 2;
      if (head.length !== cols * rows) head = new Int32Array(cols * rows);
      if (next.length !== particles.length) next = new Int32Array(particles.length);
      head.fill(-1);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const cx = Math.min(cols - 1, Math.max(0, ((p.x / cell) | 0) + 1));
        const cy = Math.min(rows - 1, Math.max(0, ((p.y / cell) | 0) + 1));
        const k = cy * cols + cx;
        next[i] = head[k];
        head[k] = i;
      }
    }

    function forNeighbours(i, fn) {
      const p = particles[i];
      const cx = Math.min(cols - 1, Math.max(0, ((p.x / cell) | 0) + 1));
      const cy = Math.min(rows - 1, Math.max(0, ((p.y / cell) | 0) + 1));
      for (let y = Math.max(0, cy - 1); y <= Math.min(rows - 1, cy + 1); y++) {
        for (let x = Math.max(0, cx - 1); x <= Math.min(cols - 1, cx + 1); x++) {
          for (let j = head[y * cols + x]; j !== -1; j = next[j]) if (j !== i) fn(j);
        }
      }
    }

    function firePulse() {
      const start = (Math.random() * particles.length) | 0;
      if (!particles[start].inWord || pulses.length > 40) return;
      pulses.push({ from: start, to: null, t: 0, hops: 14 + ((Math.random() * 10) | 0), color: particles[start].color });
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (now - lastMorph > 3800) {
        lastMorph = now;
        wordIndex = (wordIndex + 1) % words.length;
        applyWord(wordIndex);
      }

      ctx.fillStyle = 'rgba(5, 5, 10, 0.32)';
      ctx.fillRect(0, 0, w, h);

      // Physics
      for (const p of particles) {
        const ax = (p.tx - p.x) * (p.inWord ? 0.012 : 0.002);
        const ay = (p.ty - p.y) * (p.inWord ? 0.012 : 0.002);
        p.vx += ax;
        p.vy += ay;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
          const f = (16000 - d2) / 16000;
          const d = Math.sqrt(d2) || 1;
          p.vx += (dx / d) * f * 2.4;
          p.vy += (dy / d) * f * 2.4;
        }
        if (shock) {
          const sx = p.x - shock.x;
          const sy = p.y - shock.y;
          const sd = Math.sqrt(sx * sx + sy * sy) || 1;
          const band = Math.abs(sd - shock.r);
          if (band < 40) {
            p.vx += (sx / sd) * (40 - band) * 0.15;
            p.vy += (sy / sd) * (40 - band) * 0.15;
          }
        }
        if (!p.inWord) {
          p.vx += Math.cos(now * 0.0005 + p.phase) * 0.02;
          p.vy += Math.sin(now * 0.0007 + p.phase) * 0.02;
        }
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;
      }
      if (shock) {
        shock.r += 14;
        if (shock.r > Math.max(w, h)) shock = null;
      }

      buildGrid();

      // Wires between nearby word neurons
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.13)';
      ctx.beginPath();
      const maxD2 = step * step * 2.2;
      for (let i = 0; i < particles.length; i += 2) {
        const p = particles[i];
        forNeighbours(i, (j) => {
          if (j < i) return;
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          if (dx * dx + dy * dy < maxD2) {
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
          }
        });
      }
      ctx.stroke();

      // Neurons
      for (const color of [...COLORS, 'rgba(255,255,255,0.35)']) {
        ctx.fillStyle = color;
        ctx.beginPath();
        for (const p of particles) {
          if ((p.inWord ? p.color : 'rgba(255,255,255,0.35)') !== color) continue;
          const s = p.inWord ? 1.6 + Math.min(1, Math.abs(p.vx) + Math.abs(p.vy)) * 1.5 : 1;
          ctx.rect(p.x - s / 2, p.y - s / 2, s, s);
        }
        ctx.fill();
      }

      // Signals hopping neuron to neuron
      if (Math.random() < 0.5) firePulse();
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      pulses = pulses.filter((pl) => {
        if (pl.to === null) {
          const opts = [];
          forNeighbours(pl.from, (j) => particles[j].inWord && opts.push(j));
          if (!opts.length || pl.hops-- <= 0) return false;
          pl.to = opts[(Math.random() * opts.length) | 0];
          pl.t = 0;
        }
        pl.t += 0.25;
        const a = particles[pl.from];
        const b = particles[pl.to];
        const x = a.x + (b.x - a.x) * pl.t;
        const y = a.y + (b.y - a.y) * pl.t;
        ctx.strokeStyle = pl.color;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(x, y);
        ctx.stroke();
        // Cheap glow: a soft halo square under a bright core (shadowBlur is too slow here).
        ctx.fillStyle = pl.color;
        ctx.globalAlpha = 0.35;
        ctx.fillRect(x - 4, y - 4, 8, 8);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        if (pl.t >= 1) {
          pl.from = pl.to;
          pl.to = null;
        }
        return true;
      });
      ctx.restore();
    }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const pt = e.touches ? e.touches[0] : e;
      mouse.x = pt.clientX - r.left;
      mouse.y = pt.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onClick = (e) => {
      const r = canvas.getBoundingClientRect();
      shock = { x: e.clientX - r.left, y: e.clientY - r.top, r: 0 };
      lastMorph = performance.now() - 2600;
    };
    let resizeTimer = 0;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 150);
    };

    const start = () => {
      setup();
      if (reduced) {
        particles.forEach((p) => {
          p.x = p.tx;
          p.y = p.ty;
        });
        frame(performance.now());
        cancelAnimationFrame(raf);
      } else raf = requestAnimationFrame(frame);
    };
    (document.fonts?.ready || Promise.resolve()).then(start);

    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('touchmove', onMove, { passive: true });
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('click', onClick);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('touchmove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, [words]);

  return <canvas ref={canvasRef} className="neural-canvas" aria-hidden="true" />;
}
