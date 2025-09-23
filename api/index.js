const app = require("./_app");

// health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 🚀 Export as serverless function
module.exports = (req, res) => app(req, res);
