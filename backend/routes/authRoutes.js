// backend/routes/authRoutes.js

const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const router = express.Router();

// ===============================
// Register
// POST /api/auth/register
// ===============================

router.post("/register", register);

// ===============================
// Login
// POST /api/auth/login
// ===============================

router.post("/login", login);

module.exports = router;