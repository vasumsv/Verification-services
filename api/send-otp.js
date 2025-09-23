const app = require("./_app");
const sendOtpHandler = require("./send-otp-impl");

app.post("/api/send-otp", sendOtpHandler);

module.exports = (req, res) => app(req, res);
