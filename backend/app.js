const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db/connection");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HOME
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Smart Expense Tracker API is running"
    });
});

// HEALTH
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Smart Expense Tracker API is running",
        timestamp: new Date().toISOString(),
        environment: "development"
    });
});

// REGISTER
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const [existingUsers] = await pool.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        const secret = process.env.JWT_SECRET || "smart_expense_tracker_secret";

        const token = jwt.sign(
            { id: result.insertId, email },
            secret,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                token,
                user: {
                    id: result.insertId,
                    name,
                    email
                }
            }
        });

    } catch (error) {
        console.error("Registration error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: error.message
        });
    }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await pool.query(
            "SELECT id, name, email, password FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const secret = process.env.JWT_SECRET || "smart_expense_tracker_secret";

        const token = jwt.sign(
            { id: user.id, email: user.email },
            secret,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error.message
        });
    }
});
// DASHBOARD
const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/dashboard", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const [incomeResult] = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total
             FROM transactions
             WHERE user_id = ? AND type = 'income'`,
            [userId]
        );

        const [expenseResult] = await pool.query(
            `SELECT COALESCE(SUM(amount), 0) AS total
             FROM transactions
             WHERE user_id = ? AND type = 'expense'`,
            [userId]
        );

        const income = Number(incomeResult[0].total);
        const expense = Number(expenseResult[0].total);
        const balance = income - expense;

        res.json({
            success: true,
            data: {
                income,
                expense,
                balance
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load dashboard"
        });
    }
});

// ADD TRANSACTION
app.post("/api/transactions", authMiddleware, async (req, res) => {
    try {
        const {
            type,
            amount,
            category,
            description,
            date
        } = req.body;

        if (!type || !amount || !date) {
            return res.status(400).json({
                success: false,
                message: "Type, amount and date are required"
            });
        }

        const userId = req.user.id;

        await pool.query(
            `INSERT INTO transactions
            (user_id, type, amount, category, description, date)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                userId,
                type,
                amount,
                category || null,
                description || null,
                date
            ]
        );

        res.status(201).json({
            success: true,
            message: "Transaction added successfully"
        });

    } catch (error) {
        console.error("Transaction error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to add transaction"
        });
    }
});

// GET TRANSACTIONS
app.get("/api/transactions", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const [transactions] = await pool.query(
            `SELECT id, type, amount, category, description, date
             FROM transactions
             WHERE user_id = ?
             ORDER BY date DESC, id DESC`,
            [userId]
        );

        res.json({
            success: true,
            data: transactions
        });

    } catch (error) {
        console.error("Get transactions error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load transactions"
        });
    }
});

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
});

module.exports = app;