import { useEffect, useState } from "react";
import axios from "axios";

function Reports() {
    const [report, setReport] = useState({
        income: 0,
        expense: 0,
        balance: 0
    });

    useEffect(() => {
        const fetchReport = async () => {
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

                setReport(response.data.data);

            } catch (error) {
                console.error("Report error:", error);
            }
        };

        fetchReport();
    }, []);

    return (
        <div style={styles.container}>

            <h1>Smart Expense Tracker</h1>
            <h2>Financial Report</h2>

            <div style={styles.cards}>

                <div style={styles.card}>
                    <h3>Total Income</h3>
                    <h2>₹ {report.income}</h2>
                </div>

                <div style={styles.card}>
                    <h3>Total Expense</h3>
                    <h2>₹ {report.expense}</h2>
                </div>

                <div style={styles.card}>
                    <h3>Current Balance</h3>
                    <h2>₹ {report.balance}</h2>
                </div>

            </div>

            <div style={styles.info}>
                <h2>Summary</h2>

                <p>
                    You have earned ₹ {report.income} in total.
                </p>

                <p>
                    You have spent ₹ {report.expense} in total.
                </p>

                <p>
                    Your current balance is ₹ {report.balance}.
                </p>
            </div>

        </div>
    );
}

const styles = {
    container: {
        maxWidth: "1000px",
        margin: "40px auto",
        fontFamily: "Arial"
    },

    cards: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap"
    },

    card: {
        flex: "1",
        minWidth: "200px",
        padding: "25px",
        backgroundColor: "#f5f5f5",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    },

    info: {
        marginTop: "40px"
    }
};

export default Reports;