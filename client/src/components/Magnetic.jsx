import { useRef } from 'react';

// Wraps a link or button so it is pulled toward the cursor.
export default function Magnetic({ as: Tag = 'a', strength = 0.35, className = '', children, ...props }) {
  const ref = useRef(null);
  const move = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  const leave = () => {
    ref.current.style.transform = '';
  };
  return (
    <Tag ref={ref} className={`magnetic ${className}`} onPointerMove={move} onPointerLeave={leave} {...props}>
      <span className="magnetic-inner">{children}</span>
    </Tag>
  );
}
