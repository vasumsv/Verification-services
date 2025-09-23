const express = require("express");
const cors = require("cors");

const app = express();

// Allowed origins (update with your frontend domains)
const allowedOrigins = [
  "http://localhost:5173",
  "https://your-frontend-domain.com"
];

// 🔑 Always run this middleware first
app.use((req, res, next) => {
  res.removeHeader("Access-Control-Allow-Origin"); // remove Vercel's default
  next();
});

// ✅ Apply CORS properly
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl/postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// ✅ Explicit preflight handler (important for CORS!)
app.options("*", cors());

// Middleware
app.use(express.json());

// Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Export handler for Vercel
module.exports = app;
