export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    message: "Verification service is running 🚀",
    timestamp: new Date().toISOString(),
  });
}
