import { useEffect, useState } from 'react';

const LINES = [
  '> init kernel ............. ok',
  '> loading weights ......... 3 projects',
  '> compiling experience .... ok',
  '> training resnet-18 ....... 7 emotions',
  '> launching portfolio',
];

// A terminal boot sequence that splits the screen open like blast doors.
export default function Boot({ onDone }) {
  const [shown, setShown] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || sessionStorageSafe()) {
      onDone();
      return;
    }
    const timers = LINES.map((_, i) => setTimeout(() => setShown(i + 1), 220 * (i + 1)));
    timers.push(setTimeout(() => setOpen(true), 220 * LINES.length + 350));
    timers.push(setTimeout(onDone, 220 * LINES.length + 1300));
    return () => timers.forEach(clearTimeout);
  }, [onDone]);

  return (
    <div className={`boot ${open ? 'open' : ''}`} aria-hidden="true">
      <div className="boot-half top" />
      <div className="boot-half bottom" />
      <pre className="boot-log">
        {LINES.slice(0, shown).join('\n')}
        <span className="caret">█</span>
      </pre>
    </div>
  );
}

// Only play the intro once per browser tab.
function sessionStorageSafe() {
  try {
    if (sessionStorage.getItem('booted')) return true;
    sessionStorage.setItem('booted', '1');
  } catch {
    /* storage blocked, just play it */
  }
  return false;
}
