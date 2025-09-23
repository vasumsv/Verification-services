const express = require("express");
const cors = require("cors");

const app = express();

// Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend-domain.com"
];

// Remove Vercel’s default CORS header
app.use((req, res, next) => {
  res.removeHeader("Access-Control-Allow-Origin");
  next();
});

// CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow curl/Postman
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Preflight support
app.options("*", cors());

app.use(express.json());

module.exports = app;
