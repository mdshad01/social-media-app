import "./config/env.js";
import app from "./app.js";

process.on("uncaughtException", (err) => {
  console.log("UNCATCH EXCEPTION! Shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});

const port = process.env.PORT || 5000;

// ✅ Only start server in development (not needed for Vercel)
let server;
if (process.env.NODE_ENV !== 'production') {
  server = app.listen(port, () => {
    console.log(`Server running at ${port}`);
  });

  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLE REJECTION! shutting down");
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
}

// ✅ Export for Vercel serverless
export default app;
