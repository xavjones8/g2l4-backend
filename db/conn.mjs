import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const ATLAS_URI = process.env.ATLAS_URI;
if (!ATLAS_URI) {
  throw new Error("DATABASE_URI environment variable is not set");
}

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return;
  }

  try {
    await mongoose.connect(ATLAS_URI);
    console.log("Mongo connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default connectDB;
