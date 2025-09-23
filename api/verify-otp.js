const app = require("./_app");

app.post("/verify-otp", async (req, res) => {
  res.json({ success: true, message: "OTP verified" });
});

module.exports = (req, res) => app(req, res);
