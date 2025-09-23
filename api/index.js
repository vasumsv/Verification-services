require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { swaggerUi, swaggerSpec } = require("../swagger");
const sendOtpHandler = require("./send-otp");
const verifyOtpHandler = require("./verify-otp");

const app = express();
app.use(express.json());

// ✅ Allowed Origins
const allowedOrigins = [
  "https://verification-services-phi.vercel.app",
  "https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3--5173--96435430.local-credentialless.webcontainer-api.io",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174"
];

// ✅ Remove Vercel’s default CORS before setting ours
app.use((req, res, next) => {
  res.removeHeader("Access-Control-Allow-Origin");
  next();
});

// ✅ Proper CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow curl, mobile apps
    if (allowedOrigins.includes(origin)) return callback(null, origin);

    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      return callback(null, origin);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

// ✅ Safety cleanup: ensure only one Access-Control-Allow-Origin
app.use((req, res, next) => {
  const origin = res.getHeader("Access-Control-Allow-Origin");
  if (origin && typeof origin === "string" && origin.includes(",")) {
    res.setHeader("Access-Control-Allow-Origin", origin.split(",")[0].trim());
  }
  next();
});

// Swagger Docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui .topbar { display: none }",
  customSiteTitle: "OTP API Documentation"
}));

// Root Endpoint
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

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// OTP Endpoints
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
