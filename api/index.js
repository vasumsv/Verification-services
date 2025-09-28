export default function handler(req, res) {
  res.status(200).json({
    name: "OTP Verification Service",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      sendOtp: "/api/send-otp",
      verifyOtp: "/api/verify-otp"
    },
    author: "Your Name"
  });
}
