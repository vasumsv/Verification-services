module.exports = (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  res.status(200).json({
    name: "OTP Verification Service",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      sendOtp: "/api/send-otp",
      verifyOtp: "/api/verify-otp"
    }
  });
};