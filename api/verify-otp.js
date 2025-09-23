const app = require("./index");

app.post("/verify-otp", async (req, res) => {
  // TODO: verify OTP with Twilio
  res.json({ success: true, message: "OTP verified" });
});

module.exports = app;
