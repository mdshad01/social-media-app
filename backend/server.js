import "./config/env.js";
import mongoose from "mongoose";
import app from "./app.js";

process.on("uncaughtException", (err) => {
  console.log("UNCATCH EXCEPTION! Shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});

// ✅ MongoDB connection with better error handling
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.DB, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    cachedDb = db;
    console.log("Database connected successfully");
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
}

// ✅ Connect to database before starting server
connectToDatabase();

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
  console.log(`Server running at ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLE REJECTION! shutting down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// ✅ Export for Vercel serverless
export default app;
