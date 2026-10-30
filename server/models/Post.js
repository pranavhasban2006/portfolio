import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    date: String,
    readMins: Number,
    excerpt: String,
    tags: [String],
    body: String,
  },
  { timestamps: true }
);

export default mongoose.model('Post', postSchema);
