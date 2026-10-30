import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    order: { type: Number, default: 0 },
    title: { type: String, required: true },
    kind: String,
    summary: String,
    tech: [String],
    highlights: [String],
    github: String,
    demo: String,
    accent: String,
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
