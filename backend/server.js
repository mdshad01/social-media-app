// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });
import "./config/env.js";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/db.js";

process.on("uncaughtException", (err) => {
  console.log("UNCATCH EXCEPTION! Shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});
const port = process.env.PORT || 5000;

await connectDB();


const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLE REJECTION! shutting down");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
