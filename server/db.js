import mongoose from 'mongoose';

export let dbReady = false;
let pending = null;

// Connects once and reuses the connection, which also suits serverless functions
// where the same instance handles many requests.
export function connectDB(uri = process.env.MONGO_URI) {
  if (pending) return pending;
  if (!uri || uri.includes('<')) {
    console.log('[db] No MONGO_URI set, running with built-in content.');
    pending = Promise.resolve();
    return pending;
  }
  pending = mongoose
    .connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      dbReady = true;
      console.log('[db] Connected to MongoDB');
    })
    .catch((err) => {
      console.error('[db] Connection failed, falling back to built-in content:', err.message);
    });
  return pending;
}
