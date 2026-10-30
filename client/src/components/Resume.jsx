import Section from './Section.jsx';
import Magnetic from './Magnetic.jsx';

// A document being scanned by a laser, with the download button below.
export default function Resume({ profile, experience, skills }) {
  return (
    <Section id="resume" index={6} title="Resume">
      <div className="resume">
        <div className="resume-doc" data-hot>
          <div className="scanline" />
          <h3>{profile.fullName || profile.name}</h3>
          <p className="muted">{profile.title}</p>
          <hr />
          {experience.map((e) => (
            <div key={e.role + e.company} className="resume-row">
              <b>{e.role}</b>
              <span>{e.company}</span>
              <small>{e.period}</small>
            </div>
          ))}
          <hr />
          <p className="muted small">{skills.flatMap((g) => g.items).slice(0, 14).join(' / ')}</p>
        </div>
        <div className="resume-side">
          <p>
            The one page version, ready for your ATS. Prefer reading it here? Everything on this site is on the resume
            too.
          </p>
          <Magnetic href={profile.links.resume} className="btn primary big" download>
            Download PDF ↓
          </Magnetic>
        </div>
      </div>
    </Section>
  );
}
