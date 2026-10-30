import { useRef, useState } from 'react';
import Section from './Section.jsx';
import Magnetic from './Magnetic.jsx';

// Fires a burst of glyphs from the button when a message is sent.
function burst(el) {
  const r = el.getBoundingClientRect();
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.className = 'burst';
    s.textContent = '01✦<>{}'[i % 7];
    const a = (Math.PI * 2 * i) / 28;
    const d = 80 + Math.random() * 120;
    s.style.left = `${r.left + r.width / 2}px`;
    s.style.top = `${r.top + r.height / 2}px`;
    s.style.setProperty('--dx', `${Math.cos(a) * d}px`);
    s.style.setProperty('--dy', `${Math.sin(a) * d}px`);
    s.style.color = ['#00f0ff', '#ff2bd6', '#c6ff00'][i % 3];
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 1000);
  }
}

const SOCIALS = [
  ['github', 'GitHub'],
  ['linkedin', 'LinkedIn'],
  ['leetcode', 'LeetCode'],
  ['codeforces', 'Codeforces'],
];

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', text: '' });
  const btnRef = useRef(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'sending', text: 'transmitting...' });
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Could not send. Try emailing me instead.');
      setStatus({ state: 'ok', text: 'message received. I will get back to you soon.' });
      setForm({ name: '', email: '', message: '' });
      if (btnRef.current) burst(btnRef.current);
    } catch (err) {
      setStatus({ state: 'error', text: err.message === 'Failed to fetch' ? 'Server is offline. Email me instead.' : err.message });
    }
  };

  return (
    <Section id="contact" index={8} title="Contact">
      <div className="contact">
        <div className="contact-big">
          <p>Let's build</p>
          <p className="outline">something</p>
          <p>together.</p>
          <div className="socials">
            <Magnetic href={`mailto:${profile.email}`}>{profile.email}</Magnetic>
            {SOCIALS.filter(([key]) => profile.links[key]).map(([key, label]) => (
              <Magnetic key={key} href={profile.links[key]} target="_blank" rel="noreferrer">
                {label} ↗
              </Magnetic>
            ))}
          </div>
        </div>
        <form className="terminal" onSubmit={submit}>
          <div className="terminal-bar">
            <i />
            <i />
            <i />
            <span>~/contact</span>
          </div>
          <label>
            <span>$ name</span>
            <input value={form.name} onChange={set('name')} required maxLength={100} autoComplete="name" />
          </label>
          <label>
            <span>$ email</span>
            <input type="email" value={form.email} onChange={set('email')} required maxLength={200} autoComplete="email" />
          </label>
          <label>
            <span>$ message</span>
            <textarea value={form.message} onChange={set('message')} required minLength={5} maxLength={5000} rows={5} />
          </label>
          <button ref={btnRef} className="btn primary" disabled={status.state === 'sending'}>
            {status.state === 'sending' ? 'sending...' : 'send ⏎'}
          </button>
          {status.text && (
            <p className={`status ${status.state}`} role="status">
              {status.text}
            </p>
          )}
        </form>
      </div>
    </Section>
  );
}
