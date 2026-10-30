import 'dotenv/config';
import mongoose from 'mongoose';
import Project from './models/Project.js';
import Post from './models/Post.js';
import { projects, posts } from '../shared/content.js';

if (!process.env.MONGO_URI) {
  console.error('Set MONGO_URI in server/.env first.');
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
for (const p of projects) await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true });
for (const p of posts) await Post.findOneAndUpdate({ slug: p.slug }, p, { upsert: true });
console.log(`Seeded ${projects.length} projects and ${posts.length} posts.`);
await mongoose.disconnect();
