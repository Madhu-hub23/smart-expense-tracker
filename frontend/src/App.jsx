import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import AddIncome from "./AddIncome";
import AddExpense from "./AddExpense";
import Transactions from "./Transactions";
import Reports from "./Reports";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Main App */}
                <Route
                    path="/*"
                    element={
                        <div>
                            <nav style={styles.nav}>

                                <Link to="/" style={styles.logo}>
                                    Smart Expense Tracker
                                </Link>

                                <div style={styles.links}>
                                    <Link to="/" style={styles.link}>
                                        Dashboard
                                    </Link>

                                    <Link to="/income" style={styles.link}>
                                        Income
                                    </Link>

                                    <Link to="/expense" style={styles.link}>
                                        Expense
                                    </Link>

                                    <Link to="/transactions" style={styles.link}>
                                        Transactions
                                    </Link>

                                    <Link to="/reports" style={styles.link}>
                                        Reports
                                    </Link>
                                </div>

                            </nav>

                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/income" element={<AddIncome />} />
                                <Route path="/expense" element={<AddExpense />} />
                                <Route path="/transactions" element={<Transactions />} />
                                <Route path="/reports" element={<Reports />} />
                            </Routes>
                        </div>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

const styles = {
    nav: {
        backgroundColor: "#1e293b",
        padding: "16px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px"
    },

    logo: {
        color: "white",
        textDecoration: "none",
        fontSize: "22px",
        fontWeight: "bold"
    },

    links: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
    },

    link: {
        color: "white",
        textDecoration: "none",
        fontSize: "15px"
    }
};

export default App;
