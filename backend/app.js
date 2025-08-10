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

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Security middleware first
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3000"],
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

// Routes

app.use("/api/v1/users", userRouter); //post man user => users
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
