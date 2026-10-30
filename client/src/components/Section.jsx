import useInView from '../hooks/useInView.js';
import ScrambleText from './ScrambleText.jsx';

export default function Section({ id, index, title, children, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.08 });
  return (
    <section id={id} ref={ref} className={`section ${inView ? 'in' : ''} ${className}`}>
      <header className="section-head">
        <span className="section-index">{String(index).padStart(2, '0')}</span>
        <ScrambleText as="h2" text={title} className="section-title" />
        <span className="section-rule" />
      </header>
      {children}
    </section>
  );
}
