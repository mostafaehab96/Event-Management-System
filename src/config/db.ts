import "process";
import mongoose from "mongoose";
import "dotenv/config";

export const connectToDatabase = async () => {
  try {
    const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017";
    await mongoose.connect(MONGO_URL);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
