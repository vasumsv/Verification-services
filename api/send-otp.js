require("dotenv").config();
const twilio = require("twilio");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });

  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: "Invalid phone format. Use E.164 (+919876543210)" });
  }

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_VERIFY_SERVICE_SID) {
    return res.status(500).json({ error: "Server config error. Missing Twilio credentials." });
  }

  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  try {
    const verification = await client.verify
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms" });

    console.log(`OTP sent to ${phone}, status: ${verification.status}`);
    return res.status(200).json({ success: true, status: verification.status, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Twilio error:", err.message);
    if (err.code === 20003) return res.status(401).json({ error: "Invalid Twilio credentials" });
    if (err.code === 21211) return res.status(400).json({ error: "Invalid phone number" });
    if (err.code === 20429) return res.status(429).json({ error: "Too many requests. Try again later." });

    return res.status(500).json({ error: "Failed to send OTP", details: process.env.NODE_ENV === "development" ? err.message : undefined });
  }
};
