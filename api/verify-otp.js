require('dotenv').config();
const twilio = require("twilio");

/**
 * @openapi
 * /verify-otp:
 *   post:
 *     summary: Verify OTP code
 *     description: Verifies the 6-digit OTP code sent to the phone number
 *     tags:
 *       - OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOTPRequest'
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully"
 *       400:
 *         description: Invalid OTP or missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid OTP code"
 *                 status:
 *                   type: string
 *                   example: "denied"
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

  const { phone, code } = req.body;
  
  if (!phone || !code) {
    return res.status(400).json({ 
      error: "Both phone number and OTP code are required" 
    });
  }

  // Basic validation
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ 
      error: "Invalid phone number format. Use E.164 format (e.g., +919876543210)" 
    });
  }

  // Accept 4-6 digit codes
  const codeRegex = /^\d{4,6}$/;
  console.log(`Validating code: "${code}", length: ${code.length}, regex test: ${codeRegex.test(code)}`);
  
  if (!codeRegex.test(code)) {
    return res.status(400).json({ 
      error: "Invalid OTP format. Code must be 4-6 digits" 
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
    const verificationCheck = await client.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ 
        to: phone, 
        code: code 
      });

    console.log(`OTP verification for ${phone}: ${verificationCheck.status}`);

    if (verificationCheck.status === "approved") {
      return res.status(200).json({ 
        success: true,
        message: "OTP verified successfully"
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid or expired OTP code",
        status: verificationCheck.status 
      });
    }
  } catch (err) {
    console.error("Twilio verification error:", err.message);
    
    // Handle specific Twilio errors
    if (err.code === 20003) {
      return res.status(401).json({ error: "Invalid Twilio credentials" });
    } else if (err.code === 20404) {
      return res.status(400).json({ error: "No pending verification found for this phone number" });
    } else if (err.code === 60202) {
      return res.status(400).json({ error: "Maximum verification attempts reached" });
    }
    
    return res.status(500).json({ 
      error: "Failed to verify OTP. Please try again.",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};