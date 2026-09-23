import { useState } from "react";
import axios from "axios";

function AddIncome() {
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
                    type: "income",
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

            setMessage("Income added successfully! ✅");

            setAmount("");
            setCategory("");
            setDescription("");
            setDate("");

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Failed to add income"
            );
        }
    };

    return (
        <div className="income-page">

            <div className="income-container">

                <div className="income-icon">
                    💰
                </div>

                <h1>Add Income</h1>

                <p className="income-subtitle">
                    Record the money you receive
                </p>

                <form onSubmit={handleSubmit}>

                    <label>Amount</label>

                    <div className="amount-input">
                        <span>₹</span>

                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <label>Category</label>

                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Salary">💼 Salary</option>
                        <option value="Freelance">💻 Freelance</option>
                        <option value="Business">🏢 Business</option>
                        <option value="Gift">🎁 Gift</option>
                        <option value="Investment">📈 Investment</option>
                        <option value="Other">📦 Other</option>
                    </select>

                    <label>Description</label>

                    <input
                        type="text"
                        placeholder="Where did the income come from?"
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
                        className="income-submit"
                    >
                        Add Income
                    </button>

                </form>

                {message && (
                    <p className="income-message">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}

export default AddIncome;
