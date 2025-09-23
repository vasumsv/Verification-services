require("dotenv").config();
const twilio = require("twilio");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone, code } = req.body;
  if (!phone || !code) {
    return res.status(400).json({ error: "Both phone number and OTP code are required" });
  }

  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Invalid phone number format. Use E.164 (+919876543210)" });
  }

  const codeRegex = /^\d{4,6}$/;
  if (!codeRegex.test(code)) {
    return res.status(400).json({ error: "Invalid OTP format. Must be 4–6 digits" });
  }

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_VERIFY_SERVICE_SID) {
    return res.status(500).json({ error: "Server config error. Missing Twilio credentials." });
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    const verificationCheck = await client.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code });

    console.log(`OTP verification for ${phone}: ${verificationCheck.status}`);

    if (verificationCheck.status === "approved") {
      return res.status(200).json({ success: true, message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ success: false, error: "Invalid or expired OTP code", status: verificationCheck.status });
    }
  } catch (err) {
    console.error("Twilio verification error:", err.message);
    if (err.code === 20003) return res.status(401).json({ error: "Invalid Twilio credentials" });
    if (err.code === 20404) return res.status(400).json({ error: "No pending verification found" });
    if (err.code === 60202) return res.status(400).json({ error: "Max verification attempts reached" });

    return res.status(500).json({ error: "Failed to verify OTP", details: process.env.NODE_ENV === "development" ? err.message : undefined });
  }
};
