const jwt = require("jsonwebtoken");

const JWT_SECRET =
    process.env.JWT_SECRET || "smart_expense_tracker_secret";

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    const token =
        authHeader && authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : null;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication required"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;