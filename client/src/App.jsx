import { useCallback, useState } from 'react';
import * as content from '../../shared/content.js';
import useApi from './hooks/useApi.js';
import Boot from './components/Boot.jsx';
import Cursor from './components/Cursor.jsx';
import Nav from './components/Nav.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import About from './components/About.jsx';
import Projects from './components/Projects.jsx';
import Experience from './components/Experience.jsx';
import Skills from './components/Skills.jsx';
import DSA from './components/DSA.jsx';
import Resume from './components/Resume.jsx';
import Blog from './components/Blog.jsx';
import Contact from './components/Contact.jsx';

const fallbackProfile = { profile: content.profile, experience: content.experience, skills: content.skills, dsa: content.dsa };

export default function App() {
  const [booted, setBooted] = useState(false);
  const onBooted = useCallback(() => setBooted(true), []);
  const { profile, experience, skills, dsa = content.dsa } = useApi('/profile', fallbackProfile);
  const projects = useApi('/projects', content.projects);
  const posts = useApi('/posts', content.posts);

  return (
    <>
      {!booted && <Boot onDone={onBooted} />}
      <Cursor />
      <div className="noise" aria-hidden="true" />
      <Nav />
      <main>
        <Hero profile={profile} />
        <Marquee items={['Full Stack', 'Machine Learning', 'MERN', 'AWS', 'PyTorch', 'Computer Vision']} />
        <About profile={profile} />
        <Projects projects={projects} />
        <Marquee reverse items={['Open to internships', 'SWE', 'AI / ML', 'VIT Vellore', '250+ LeetCode']} />
        <Experience experience={experience} />
        <Skills skills={skills} />
        <DSA dsa={dsa} links={profile.links} />
        <Resume profile={profile} experience={experience} skills={skills} />
        <Blog posts={posts} />
        <Contact profile={profile} />
      </main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} {profile.fullName || profile.name}</span>
        <span>Built with MongoDB, Express, React and Node</span>
        <a href="#top">back to top ↑</a>
      </footer>
    </>
  );
}
