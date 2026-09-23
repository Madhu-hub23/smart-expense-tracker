// backend/routes/health.routes.js
const express = require("express");
const router = express.Router();

// GET /api/health
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Expense Tracker API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

module.exports = router;