require('dotenv').config();
const express = require("express");
const { swaggerUi, swaggerSpec } = require("../swagger");
const sendOtpHandler = require("./send-otp");
const verifyOtpHandler = require("./verify-otp");

const app = express();
app.use(express.json());

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Swagger UI documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "OTP API Documentation"
}));

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 OTP API is running!", 
    documentation: "/docs",
    endpoints: {
      "POST /send-otp": "Send OTP to phone number",
      "POST /verify-otp": "Verify OTP code"
    }
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// OTP endpoints
app.post("/send-otp", sendOtpHandler);
app.post("/verify-otp", verifyOtpHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/docs`);
  });
}

module.exports = app;