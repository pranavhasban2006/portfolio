# Portfolio (MERN)

A bold, dark, heavily animated portfolio for SWE and AI/ML job hunting.

- **client/**: React 18 + Vite. No animation libraries, every effect is hand written.
- **server/**: Express + Mongoose. Serves projects and blog posts from MongoDB and stores contact form messages.
- **shared/content.js**: all site text in one place. Edit this file to change what the site says.

## The animations

| Where | Effect |
| --- | --- |
| Intro | Terminal boot log, then the screen splits open like blast doors (once per tab) |
| Hero | A neural network of ~2.5k neurons that assembles into your name, then morphs into SWE, AI / ML and BUILDER. Signals fire neuron to neuron, the cursor repels neurons, and a click sends a shockwave |
| Cursor | A rainbow comet tail made of a spring chain, plus a ring that inverts what it passes over |
| Headings | Text decodes itself from glyph noise when it scrolls into view |
| About | Words light up one by one as you scroll, stats count up |
| Projects | 3D tilt cards with a spinning neon border and an "x-ray lens" that reveals a blueprint of the stack and results under the cursor |
| Experience | A circuit trace etches down the page as you scroll and powers on each role |
| Skills | Skill groups orbit a glowing core; hover a group to bring its orbit into focus |
| Resume | A laser scanline sweeps the resume preview |
| Blog | Rows flood with light and glitch on hover, posts open in a modal |
| Contact | Terminal style form; sending fires a burst of glyphs |

Everything respects `prefers-reduced-motion`, and the custom cursor is off on touch screens.

## Run it

```bash
npm run install:all
cp server/.env.example server/.env   # optional: add MONGO_URI
npm run dev                          # client on :5173, API on :5000
```

Without `MONGO_URI` the API serves the content in `shared/content.js` and logs contact messages to the console, so you can develop with no database.

With MongoDB (for example a free MongoDB Atlas cluster), set `MONGO_URI` and run `npm run seed` to load projects and posts.

## Deploy on Vercel

The repo is ready for Vercel as is: `vercel.json` builds the React app into `client/dist`, and `api/index.js` runs the Express API as a serverless function at `/api/*`.

1. Push this repo to GitHub.
2. On vercel.com, choose **Add New → Project**, import the repo, and keep the default settings (they come from `vercel.json`).
3. Optional but recommended: create a free MongoDB Atlas cluster, allow access from anywhere (`0.0.0.0/0`), and add `MONGO_URI` under **Settings → Environment Variables**. Then redeploy. Without it, contact form messages only appear in Vercel's function logs.
4. Run `npm run seed` locally with the same `MONGO_URI` if you want projects and posts served from the database.

## Run as a single Node server (Render, Railway, Fly.io)

```bash
npm run build   # builds client/dist
npm start       # Express serves the API and the built site on one port
```

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET | /api/profile | profile, experience, skills |
| GET | /api/projects | sorted by `order` |
| GET | /api/posts | newest first |
| GET | /api/posts/:slug | single post |
| POST | /api/contact | `{ name, email, message }`, rate limited to 5 per 15 min |

## To do

- Replace placeholders in `shared/content.js`
- Replace `client/public/resume.pdf` with your resume
