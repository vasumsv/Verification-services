import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: "Phone and code are required" });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code });

    if (verificationCheck.status === "approved") {
      return res.status(200).json({ success: true, message: "OTP verified successfully ✅" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP ❌" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Failed to verify OTP", details: error.message });
  }
}
