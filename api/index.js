const app = require("./_app");

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ✅ Export handler for Vercel
module.exports = (req, res) => app(req, res);
