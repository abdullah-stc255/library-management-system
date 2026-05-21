import mongoose from "mongoose";

export function connectDB() {
  try {
    mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log("connection failed", error.message);
    process.exit(1);
  }
}
