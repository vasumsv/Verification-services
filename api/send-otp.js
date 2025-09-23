require('dotenv').config();
const twilio = require("twilio");

/**
 * @openapi
 * /send-otp:
 *   post:
 *     summary: Send OTP to a phone number
 *     description: Sends a 6-digit OTP code to the specified phone number via SMS using Twilio Verify service
 *     tags:
 *       - OTP
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
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Bad request - missing or invalid phone number
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
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  // Basic phone number validation
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      error: "Invalid phone number format. Use E.164 format (e.g., +919876543210)" 
    });
  }

  // Check for required environment variables
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_VERIFY_SERVICE_SID) {
    return res.status(500).json({ 
      error: "Server configuration error. Missing Twilio credentials." 
    });
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  try {
    const verification = await client.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ 
        to: phone, 
        channel: "sms" 
      });

    console.log(`OTP sent to ${phone}, status: ${verification.status}`);

    return res.status(200).json({ 
      success: true, 
      status: verification.status,
      message: "OTP sent successfully"
    });
  } catch (err) {
    console.error("Twilio error:", err.message);
    
    // Handle specific Twilio errors
    if (err.code === 20003) {
      return res.status(401).json({ error: "Invalid Twilio credentials" });
    } else if (err.code === 21211) {
      return res.status(400).json({ error: "Invalid phone number" });
    } else if (err.code === 20429) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }
    
    return res.status(500).json({ 
      error: "Failed to send OTP. Please try again.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};