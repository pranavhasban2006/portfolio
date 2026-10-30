import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import contentRoutes from './routes/content.js';
import contactRoutes from './routes/contact.js';

const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json({ limit: '20kb' }));
app.use('/api', (_req, _res, next) => connectDB().then(() => next(), next));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api', contentRoutes);
app.use('/api/contact', contactRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

export default app;
