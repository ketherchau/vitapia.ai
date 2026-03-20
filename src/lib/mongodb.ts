import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const cached = (global as { mongoose?: Record<string, unknown> }).mongoose || { conn: null, promise: null };

if (!(global as { mongoose?: Record<string, unknown> }).mongoose) {
  (global as { mongoose?: Record<string, unknown> }).mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    console.log("[*] Establishing secure connection to AWS MongoDB Cluster...");
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      console.log("[*] MongoDB connection established successfully.");
      return mongoose;
    }).catch(err => {
      console.error("[!] Database connection failed:", err.message);
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
