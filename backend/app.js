import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import globalErrorHandler from "./controllers/errorController.js";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import AppError from "./utils/appError.js";
import userRouter from "./routers/userRouter.js";
import postRouter from "./routers/postRouter.js";
import mongoose from "mongoose";

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ✅ MongoDB connection with caching for Vercel serverless
let cachedDb = null;

async function connectToDatabase() {
  // Return cached connection if available
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log("Using cached database connection");
    return cachedDb;
  }

  try {
    // Optimized connection settings for Vercel serverless
    const db = await mongoose.connect(process.env.DB, {
      serverSelectionTimeoutMS: 10000, // Increased from 5s to 10s
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Connection pooling
      minPoolSize: 2,
      maxIdleTimeMS: 10000,
    });
    
    cachedDb = db;
    console.log("Database connected successfully");
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    cachedDb = null;
    throw error;
  }
}

// Security middleware first
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://10.29.204.203:3000",
      "https://social-media-app-6omb.vercel.app",
      "https://social-media-app-snowy-xi.vercel.app"
    ],
    credentials: true,
  
  })
);

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parsing middleware
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser()); // Parse cookies from requests

// Data sanitization
app.use(mongoSanitize());

// Static file serving
app.use("/uploads", express.static("uploads")); // User uploads
app.use(express.static(path.join(__dirname, "public"))); // Static assets

// ✅ Middleware to ensure DB connection before handling requests
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Failed to connect to database:", error);
    res.status(503).json({
      status: "error",
      message: "Database connection failed. Please try again.",
    });
  }
});

// DEBUG: Remove this after testing
app.get("/api/v1/debug", (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV,
    isProduction: process.env.NODE_ENV === "production",
    jwtCookieExpires: process.env.JWT_COOKIE_EXPIRES_IN
  });
});

// Health check endpoint for warming up serverless function
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Routes

app.use("/api/v1/users", userRouter); //postman user => users
app.use("/api/v1/posts", postRouter);

app.get("/", (req, res) => {
  res.send("You are currently in root😎");
});

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global error handler (must be last)
app.use(globalErrorHandler);

export default app;
