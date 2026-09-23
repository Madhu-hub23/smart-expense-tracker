const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "P25DS010",
    database: "smart_expense_tracker",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL database connected successfully!");
        connection.release();
    } catch (error) {
        console.error("❌ MySQL connection failed:", error.message);
    }
}

testConnection();

module.exports = pool;