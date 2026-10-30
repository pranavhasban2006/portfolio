import { useEffect, useRef, useState } from 'react';
import useInView from '../hooks/useInView.js';

// Live sorting visualiser. Each algorithm is a generator that yields
// the indices it is comparing, so the canvas can draw every step.
function* bubble(a) {
  for (let i = 0; i < a.length; i++)
    for (let j = 0; j < a.length - i - 1; j++) {
      yield [j, j + 1];
      if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    }
}

function* insertion(a) {
  for (let i = 1; i < a.length; i++)
    for (let j = i; j > 0 && a[j - 1] > a[j]; j--) {
      yield [j - 1, j];
      [a[j - 1], a[j]] = [a[j], a[j - 1]];
    }
}

function* quick(a, lo = 0, hi = a.length - 1) {
  if (lo >= hi) return;
  const pivot = a[hi];
  let i = lo;
  for (let j = lo; j < hi; j++) {
    yield [j, hi];
    if (a[j] < pivot) {
      [a[i], a[j]] = [a[j], a[i]];
      i++;
    }
  }
  [a[i], a[hi]] = [a[hi], a[i]];
  yield* quick(a, lo, i - 1);
  yield* quick(a, i + 1, hi);
}

function* merge(a, lo = 0, hi = a.length) {
  if (hi - lo < 2) return;
  const mid = (lo + hi) >> 1;
  yield* merge(a, lo, mid);
  yield* merge(a, mid, hi);
  const left = a.slice(lo, mid);
  const right = a.slice(mid, hi);
  let i = 0;
  let j = 0;
  for (let k = lo; k < hi; k++) {
    yield [k, mid + Math.min(j, right.length - 1)];
    a[k] = j >= right.length || (i < left.length && left[i] <= right[j]) ? left[i++] : right[j++];
  }
}

const ALGOS = [
  { name: 'Quick sort', time: 'O(n log n) avg', fn: quick, speed: 2 },
  { name: 'Merge sort', time: 'O(n log n)', fn: merge, speed: 2 },
  { name: 'Insertion sort', time: 'O(n²)', fn: insertion, speed: 8 },
  { name: 'Bubble sort', time: 'O(n²)', fn: bubble, speed: 14 },
];

const N = 48;

export default function SortViz() {
  const canvasRef = useRef(null);
  const [wrapRef, inView] = useInView({ threshold: 0.1, once: false });
  const [algo, setAlgo] = useState(0);
  const [ops, setOps] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let raf = 0;
    let index = algo;
    let arr;
    let gen;
    let active = [];
    let count = 0;
    let doneAt = 0;

    const reset = () => {
      arr = Array.from({ length: N }, (_, i) => (i + 1) / N).sort(() => Math.random() - 0.5);
      gen = ALGOS[index].fn(arr);
      count = 0;
      doneAt = 0;
      setAlgo(index);
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      const bw = w / N;
      arr.forEach((v, i) => {
        const on = active.includes(i);
        ctx.fillStyle = doneAt ? '#c6ff00' : on ? '#ff2bd6' : `hsl(${185 + v * 40}, 100%, ${35 + v * 25}%)`;
        const bh = v * (h - 8);
        ctx.fillRect(i * bw + 1, h - bh, bw - 2, bh);
      });
    };

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (doneAt) {
        if (now - doneAt > 1200) {
          index = (index + 1) % ALGOS.length;
          reset();
        }
        return draw();
      }
      for (let s = 0; s < ALGOS[index].speed; s++) {
        const step = gen.next();
        if (step.done) {
          active = [];
          doneAt = now;
          break;
        }
        active = step.value;
        count++;
      }
      setOps(count);
      draw();
    };

    reset();
    if (reduced) {
      arr.sort((x, y) => x - y);
      doneAt = 1;
      draw();
    } else raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return (
    <div className="sortviz" ref={wrapRef} aria-hidden="true">
      <div className="sortviz-bar">
        <span>{ALGOS[algo].name}</span>
        <span className="muted">{ALGOS[algo].time}</span>
        <span className="sortviz-ops">{ops} comparisons</span>
      </div>
      <canvas ref={canvasRef} />
    </div>
  );
}
