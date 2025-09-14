/*
 * Secure Node.js + Express Backend with Twilio SMS OTP Verification
 * 
 * SETUP INSTRUCTIONS:
 * 1. Run: npm install
 * 2. Create a .env file with your Twilio credentials:
 *    TWILIO_SID=your_account_sid
 *    TWILIO_AUTH_TOKEN=your_auth_token
 *    TWILIO_VERIFY_SID=your_verify_service_sid
 * 3. Start the server: node server.js
 * 4. Server will run on http://localhost:5000
 * 
 * ENDPOINTS:
 * - POST /send-otp: Send OTP to phone number
 * - POST /verify-otp: Verify OTP code
 */

const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Twilio OTP API',
      version: '1.0.0',
      description: 'A secure Node.js + Express backend that provides SMS OTP verification using Twilio\'s Verify API for React e-commerce applications.',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://your-app.vercel.app',
        description: 'Production server',
      }
    ],
    tags: [
      {
        name: 'OTP',
        description: 'SMS OTP verification endpoints'
      },
      {
        name: 'Health',
        description: 'Health check endpoints'
      }
    ]
  },
  apis: ['./server.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Initialize Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Validate environment variables
const requiredEnvVars = ['TWILIO_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_VERIFY_SID'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file and ensure all Twilio credentials are set.');
  process.exit(1);
}

// Utility function to validate phone number format
const isValidPhoneNumber = (phone) => {
  // Basic validation for international phone numbers (E.164 format)
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Swagger UI setup - MUST be before other routes
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Twilio OTP API Documentation"
}));

// Swagger JSON endpoint
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     SendOTPRequest:
 *       type: object
 *       required:
 *         - phone
 *       properties:
 *         phone:
 *           type: string
 *           description: Phone number in E.164 format
 *           example: "+1234567890"
 *     SendOTPResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "pending"
 *         message:
 *           type: string
 *           example: "OTP sent successfully"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *     VerifyOTPRequest:
 *       type: object
 *       required:
 *         - phone
 *         - code
 *       properties:
 *         phone:
 *           type: string
 *           description: Phone number in E.164 format
 *           example: "+1234567890"
 *         code:
 *           type: string
 *           description: 6-digit verification code
 *           example: "123456"
 *     VerifyOTPResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "approved"
 *         message:
 *           type: string
 *           example: "Phone number verified successfully"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: "error"
 *         message:
 *           type: string
 *           example: "Error description"
 */

/**
 * @swagger
 * /send-otp:
 *   post:
 *     summary: Send OTP to phone number
 *     description: Sends a one-time password (OTP) to the specified phone number via SMS using Twilio Verify API
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendOTPRequest'
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendOTPResponse'
 *       400:
 *         description: Bad request - Invalid phone number or missing data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post('/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    // Validate request body
    if (!phone) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone number is required'
      });
    }

    // Validate phone number format
    if (!isValidPhoneNumber(phone)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid phone number format. Please use E.164 format (e.g., +1234567890)'
      });
    }

    // Send OTP via Twilio Verify API
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verifications
      .create({
        to: phone,
        channel: 'sms'
      });

    console.log(`📱 OTP sent to ${phone}, Status: ${verification.status}`);

    res.json({
      status: verification.status, // Should be "pending"
      message: 'OTP sent successfully',
      phone: phone
    });

  } catch (error) {
    console.error('❌ Error sending OTP:', error.message);
    
    // Handle specific Twilio errors
    if (error.code === 60200) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid phone number'
      });
    }
    
    if (error.code === 60203) {
      return res.status(429).json({
        status: 'error',
        message: 'Too many requests. Please try again later.'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to send OTP. Please try again.'
    });
  }
});

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify OTP code
 *     description: Verifies the OTP code sent to the phone number
 *     tags: [OTP]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *     responses:
 *       200:
 *         description: Phone number verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyOTPResponse'
 *       400:
 *         description: Bad request - Invalid code or phone number
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Verification not found or expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Max verification attempts reached
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
app.post('/verify-otp', async (req, res) => {
  try {
    const { phone, code } = req.body;

    // Validate request body
    if (!phone || !code) {
      return res.status(400).json({
        status: 'error',
        message: 'Phone number and verification code are required'
      });
    }

    // Validate phone number format
    if (!isValidPhoneNumber(phone)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid phone number format. Please use E.164 format (e.g., +1234567890)'
      });
    }

    // Validate code format (should be 6 digits)
    if (!/^\d{6}$/.test(code)) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid verification code format. Code should be 6 digits.'
      });
    }

    // Verify OTP via Twilio Verify API
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID)
      .verificationChecks
      .create({
        to: phone,
        code: code
      });

    console.log(`🔐 OTP verification for ${phone}, Status: ${verificationCheck.status}`);

    if (verificationCheck.status === 'approved') {
      res.json({
        status: 'approved',
        message: 'Phone number verified successfully',
        phone: phone
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Invalid or expired verification code'
      });
    }

  } catch (error) {
    console.error('❌ Error verifying OTP:', error.message);
    
    // Handle specific Twilio errors
    if (error.code === 20404) {
      return res.status(404).json({
        status: 'error',
        message: 'Verification not found or expired'
      });
    }
    
    if (error.code === 60202) {
      return res.status(429).json({
        status: 'error',
        message: 'Max verification attempts reached'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Failed to verify OTP. Please try again.'
    });
  }
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API service
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 *                 message:
 *                   type: string
 *                   example: "Twilio OTP Service is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Twilio OTP Service is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Twilio OTP Backend Server started successfully!');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log('📋 Available endpoints:');
  console.log('   POST /send-otp   - Send OTP to phone number');
  console.log('   POST /verify-otp - Verify OTP code');
  console.log('   GET  /health     - Health check');
  console.log('');
  console.log('💡 Make sure your .env file contains:');
  console.log('   TWILIO_SID=your_account_sid');
  console.log('   TWILIO_AUTH_TOKEN=your_auth_token');
  console.log('   TWILIO_VERIFY_SID=your_verify_service_sid');
});