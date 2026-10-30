import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import Message from '../models/Message.js';
import { dbReady } from '../db.js';

const router = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 5 });
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', limiter, async (req, res, next) => {
  try {
    const { name = '', email = '', message = '' } = req.body || {};
    if (!name.trim() || !EMAIL_RE.test(email) || message.trim().length < 5) {
      return res.status(400).json({ error: 'Please give a name, a valid email and a message.' });
    }
    const data = { name: name.trim().slice(0, 100), email: email.trim().slice(0, 200), message: message.trim().slice(0, 5000) };
    if (dbReady) await Message.create(data);
    else console.log('[contact] New message (no DB configured):', data);
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
