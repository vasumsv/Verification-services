require('dotenv').config();
const express = require("express");
const cors = require("cors");
const { swaggerUi, swaggerSpec } = require("../swagger");
const sendOtpHandler = require("./send-otp");
const verifyOtpHandler = require("./verify-otp");

const app = express();
app.use(express.json());

// CORS configuration - properly handle multiple origins
const allowedOrigins = [
  "https://verification-services-phi.vercel.app",
  "https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3-3z96fi50--5173--96435430.local-credentialless.webcontainer-api.io",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174"
];

// Enable pre-flight requests for all routes
app.options('*', cors({
  origin: function (origin, callback) {
    console.log('OPTIONS request from origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      console.log('Origin allowed:', origin);
      return callback(null, origin);
    }
    
    // For development, allow any localhost origin or webcontainer origin
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('webcontainer-api.io')) {
      console.log('Development origin allowed:', origin);
      return callback(null, origin);
    }
    
    console.log('Origin rejected:', origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS request from origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      console.log('Origin allowed:', origin);
      return callback(null, origin); // Return only the matched origin
    }
    
    // For development, allow any localhost origin or webcontainer origin
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('webcontainer-api.io')) {
      console.log('Development origin allowed:', origin);
      return callback(null, origin);
    }
    
    console.log('Origin rejected:', origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

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

// Handle all other routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
