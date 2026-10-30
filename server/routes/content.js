import { Router } from 'express';
import Project from '../models/Project.js';
import Post from '../models/Post.js';
import { dbReady } from '../db.js';
import * as content from '../../shared/content.js';

const router = Router();

router.get('/profile', (_req, res) => {
  res.json({ profile: content.profile, experience: content.experience, skills: content.skills, dsa: content.dsa });
});

router.get('/projects', async (_req, res, next) => {
  try {
    if (!dbReady) return res.json(content.projects);
    res.json(await Project.find().sort({ order: 1 }).lean());
  } catch (err) {
    next(err);
  }
});

router.get('/posts', async (_req, res, next) => {
  try {
    if (!dbReady) return res.json(content.posts);
    res.json(await Post.find().sort({ date: -1 }).lean());
  } catch (err) {
    next(err);
  }
});

router.get('/posts/:slug', async (req, res, next) => {
  try {
    const post = dbReady
      ? await Post.findOne({ slug: req.params.slug }).lean()
      : content.posts.find((p) => p.slug === req.params.slug);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

export default router;
