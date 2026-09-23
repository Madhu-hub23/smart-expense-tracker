import { useEffect, useState } from "react";
import axios from "axios";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "https://smart-expense-tracker-w6kg.onrender.com/api/transactions",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setTransactions(response.data.data);

            } catch (error) {
                setMessage(
                    error.response?.data?.message ||
                    "Unable to load transactions"
                );
            }
        };

        fetchTransactions();
    }, []);

    return (
        <div className="transactions-page">

            <div className="transactions-header">
                <div>
                    <h1>Transactions</h1>
                    <p>View all your income and expenses</p>
                </div>

                <span className="transaction-count">
                    {transactions.length} Transactions
                </span>
            </div>

            {message && (
                <p className="form-message">{message}</p>
            )}

            {transactions.length === 0 ? (

                <div className="empty-transactions">
                    <div>📋</div>
                    <h2>No Transactions Yet</h2>
                    <p>
                        Your income and expenses will appear here.
                    </p>
                </div>

            ) : (

                <div className="table-container">

                    <table className="transactions-table">

                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>

                        <tbody>

                            {transactions.map((transaction) => (

                                <tr key={transaction.id}>

                                    <td>
                                        {new Date(
                                            transaction.date
                                        ).toLocaleDateString("en-IN")}
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                transaction.type === "income"
                                                    ? "type-income"
                                                    : "type-expense"
                                            }
                                        >
                                            {transaction.type === "income"
                                                ? "Income"
                                                : "Expense"}
                                        </span>
                                    </td>

                                    <td>
                                        {transaction.category || "-"}
                                    </td>

                                    <td>
                                        {transaction.description || "-"}
                                    </td>

                                    <td
                                        className={
                                            transaction.type === "income"
                                                ? "amount-income"
                                                : "amount-expense"
                                        }
                                    >
                                        {transaction.type === "income"
                                            ? "+ "
                                            : "- "}
                                        ₹{" "}
                                        {Number(
                                            transaction.amount
                                        ).toLocaleString()}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}

export default Transactions;
