import Section from './Section.jsx';
import SortViz from './SortViz.jsx';
import Counter from './Counter.jsx';

export default function DSA({ dsa, links }) {
  return (
    <Section id="dsa" index={5} title="DSA">
      <p className="dsa-intro">{dsa.intro}</p>
      <div className="dsa-grid">
        <SortViz />
        <div className="platforms">
          {dsa.platforms.map((p) => {
            const url = links[p.link];
            const Tag = url ? 'a' : 'div';
            return (
              <Tag
                key={p.name}
                className="platform"
                style={{ '--accent': p.accent }}
                {...(url ? { href: url, target: '_blank', rel: 'noreferrer' } : {})}
                data-hot
              >
                <h3>
                  {p.name}
                  {url && <span> ↗</span>}
                </h3>
                <div className="platform-stats">
                  {p.stats.map((s) => (
                    <div key={s.label}>
                      <Counter value={s.value} suffix={s.suffix} className="platform-value" />
                      <span className="stat-label">{s.label}</span>
                    </div>
                  ))}
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
      {dsa.topics?.length > 0 && (
        <ul className="dsa-topics">
          {dsa.topics.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}
    </Section>
  );
}
