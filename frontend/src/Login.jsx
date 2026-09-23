import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem("token", response.data.data.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.data.user)
            );

            navigate("/");

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Login failed"
            );
        }
    };

    return (
        <div style={styles.page}>

            <div style={styles.card}>

                <h1 style={styles.title}>Smart Expense Tracker</h1>

                <p style={styles.subtitle}>
                    Manage your money easily 💰
                </p>

                <h2>Login</h2>

                <form onSubmit={handleLogin}>

                    <input
                        style={styles.input}
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        style={styles.input}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button style={styles.button} type="submit">
                        Login
                    </button>

                </form>

                {message && (
                    <p style={styles.error}>{message}</p>
                )}

                <p style={styles.bottomText}>
                    Don't have an account?{" "}
                    <Link to="/register" style={styles.link}>
                        Sign Up
                    </Link>
                </p>

            </div>

        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f5f9"
    },

    card: {
        width: "380px",
        padding: "35px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
        textAlign: "center"
    },

    title: {
        color: "#1e293b",
        marginBottom: "5px"
    },

    subtitle: {
        color: "#64748b",
        marginBottom: "25px"
    },

    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "13px",
        marginBottom: "15px",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        fontSize: "15px"
    },

    button: {
        width: "100%",
        padding: "13px",
        backgroundColor: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer"
    },

    error: {
        color: "#dc2626"
    },

    bottomText: {
        marginTop: "20px",
        color: "#64748b"
    },

    link: {
        color: "#2563eb",
        fontWeight: "bold",
        textDecoration: "none"
    }
};

export default Login;