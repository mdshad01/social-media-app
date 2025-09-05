import dotenv from "dotenv";
import mongoose from "mongoose";

process.on("uncaughtException", (err) => {
  console.log("UNCATCH EXCEPTION! Shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./.env" });
import app from "./app.js";

mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log(error);
  });

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
