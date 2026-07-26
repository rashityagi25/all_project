import { useState } from "react";
import axios from "axios";

const API = "";
export default function Login({ onLogin, onSwitchToRegister }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.post(`${API}/api/auth/login`, form);
            localStorage.setItem("token", res.data.token);
            onLogin(res.data.token);
        } catch (e) {
            setError("Invalid email or password!");
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
            <div className="card" style={{ width: "400px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "8px" }}>🏛️ Legal AI System</h2>
                <h3 style={{ textAlign: "center", color: "#555", marginBottom: "24px" }}>Login</h3>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="Enter your email"
                           value={form.email}
                           onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password" placeholder="Enter your password"
                           value={form.password}
                           onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>

                <button className="btn btn-primary" style={{ width: "100%", padding: "12px" }}
                        onClick={handleSubmit} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px", color: "#777" }}>
                    Don't have an account?{" "}
                    <span style={{ color: "#1a237e", cursor: "pointer", fontWeight: "600" }}
                          onClick={onSwitchToRegister}>
            Register here
          </span>
                </p>
            </div>
        </div>
    );
}