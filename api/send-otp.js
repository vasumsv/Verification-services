import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms" });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      sid: verification.sid,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
}
