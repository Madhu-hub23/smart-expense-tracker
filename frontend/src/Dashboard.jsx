import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
    const [dashboard, setDashboard] = useState({
        income: 0,
        expense: 0,
        balance: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setDashboard(response.data.data);
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
    };

    const user = JSON.parse(localStorage.getItem("user"));

    if (loading) {
        return <h2 className="loading">Loading...</h2>;
    }

    return (
        <div className="dashboard-container">

            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>
                        Welcome back, {user?.name || "User"} 👋
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Logout
                </button>
            </div>

            <div className="dashboard-cards">

                <div className="dashboard-card income">
                    <div className="card-icon">💰</div>
                    <p>Total Income</p>
                    <h2>
                        ₹ {dashboard.income.toLocaleString()}
                    </h2>
                </div>

                <div className="dashboard-card expense">
                    <div className="card-icon">💸</div>
                    <p>Total Expense</p>
                    <h2>
                        ₹ {dashboard.expense.toLocaleString()}
                    </h2>
                </div>

                <div className="dashboard-card balance">
                    <div className="card-icon">💵</div>
                    <p>Available Balance</p>
                    <h2>
                        ₹ {dashboard.balance.toLocaleString()}
                    </h2>
                </div>

            </div>

            <div className="quick-section">

                <h2>Quick Actions</h2>

                <div className="quick-buttons">

                    <Link to="/income" className="quick-button income-btn">
                        💰 Add Income
                    </Link>

                    <Link to="/expense" className="quick-button expense-btn">
                        💸 Add Expense
                    </Link>

                    <Link to="/transactions" className="quick-button transaction-btn">
                        📋 Transactions
                    </Link>

                    <Link to="/reports" className="quick-button report-btn">
                        📊 Reports
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;