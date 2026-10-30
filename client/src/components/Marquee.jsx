export default function Marquee({ items, reverse = false }) {
  const row = [...items, ...items];
  return (
    <div className={`marquee ${reverse ? 'reverse' : ''}`} aria-hidden="true">
      <div className="marquee-track">
        {row.map((t, i) => (
          <span key={i}>
            {t} <b>✦</b>
          </span>
        ))}
      </div>
    </div>
  );
}
