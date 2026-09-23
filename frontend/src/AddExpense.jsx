import { useState } from "react";
import axios from "axios";

function AddExpense() {
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "https://smart-expense-tracker-w6kg.onrender.com/api/transactions",
                {
                    type: "expense",
                    amount,
                    category,
                    description,
                    date
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Expense added successfully! ✅");

            setAmount("");
            setCategory("");
            setDescription("");
            setDate("");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to add expense"
            );
        }
    };

    return (
        <div className="form-page">

            <div className="form-container">

                <div className="form-icon">💸</div>

                <h1>Add Expense</h1>

                <p className="form-subtitle">
                    Record your spending
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Amount</label>

                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />

                    <label>Category</label>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Food">🍔 Food</option>
                        <option value="Travel">🚗 Travel</option>
                        <option value="Shopping">🛍️ Shopping</option>
                        <option value="Education">📚 Education</option>
                        <option value="Bills">🧾 Bills</option>
                        <option value="Other">📦 Other</option>
                    </select>

                    <label>Description</label>

                    <input
                        type="text"
                        placeholder="What did you spend on?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label>Date</label>

                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="expense-submit"
                    >
                        Add Expense
                    </button>

                </form>

                {message && (
                    <p className="form-message">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}

export default AddExpense;
