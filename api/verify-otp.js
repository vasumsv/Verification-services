const app = require("./_app");
const verifyOtpHandler = require("./verify-otp-impl");

app.post("/api/verify-otp", verifyOtpHandler);

module.exports = (req, res) => app(req, res);
