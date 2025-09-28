const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(bodyParser.json());

// Import API routes
const health = require("./api/health");
const index = require("./api/index");
const sendOtp = require("./api/send-otp");
const verifyOtp = require("./api/verify-otp");

// Routes
app.get("/api/health", health);
app.get("/api", index);
app.post("/api/send-otp", sendOtp);
app.post("/api/verify-otp", verifyOtp);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});