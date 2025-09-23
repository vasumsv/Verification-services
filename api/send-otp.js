const app = require("./_app");

app.post("/send-otp", async (req, res) => {
  res.json({ success: true, message: "OTP sent" });
});

module.exports = (req, res) => app(req, res);
