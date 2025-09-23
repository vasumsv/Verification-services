const app = require("./index");

app.post("/send-otp", async (req, res) => {
  // TODO: integrate Twilio here
  res.json({ success: true, message: "OTP sent" });
});

module.exports = app;
