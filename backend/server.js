const app = require("./app");

const PORT = 5000;

app.listen(PORT, () => {
    console.log("Smart Expense Tracker Backend");
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health: http://localhost:${PORT}/api/health`);
    console.log(`Auth: http://localhost:${PORT}/api/auth`);
});