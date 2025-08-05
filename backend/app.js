const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");
const path = require("path");

const app = express();

app.use("/", express.static("uploads")); //?

app.use(cookieParser()); //?

app.use(halmet());

app.use(
  cors({
    origin: ["http://localhost:5000"],
    credentials: true,
  })
);

app.use(path.join(__dirname, "public"));

module.exports = app;
