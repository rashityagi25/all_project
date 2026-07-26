import { useState } from "react";
import axios from "axios";

const API = "";

export default function Register({ onSwitchToLogin }) {
    const [form, setForm] = useState({
        name: "", email: "", password: "", phone: "", state: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await axios.post(`${API}/api/auth/register`, form);
            setSuccess("✅ Registered successfully! Please login.");
            setTimeout(() => onSwitchToLogin(), 2000);
        } catch (e) {
            const status = e.response?.status;
            const msg = e.response?.data?.message || e.response?.data || e.message;
            console.log("Full error:", e.response);
            setError(`Error ${status}: ${JSON.stringify(msg)}`);
        }
        setLoading(false);
    };

    return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
            <div className="card" style={{ width: "420px" }}>
                <h2 style={{ textAlign: "center", marginBottom: "8px" }}>🏛️ Legal AI System</h2>
                <h3 style={{ textAlign: "center", color: "#555", marginBottom: "24px" }}>Create Account</h3>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-group">
                    <label>Full Name</label>
                    <input placeholder="Enter your full name"
                           value={form.name}
                           onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>

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

                <div className="grid-2">
                    <div className="form-group">
                        <label>Phone</label>
                        <input placeholder="Phone number"
                               value={form.phone}
                               onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>State</label>
                        <input placeholder="Your state"
                               value={form.state}
                               onChange={e => setForm({ ...form, state: e.target.value })} />
                    </div>
                </div>

                <button className="btn btn-primary" style={{ width: "100%", padding: "12px" }}
                        onClick={handleSubmit} disabled={loading}>
                    {loading ? "Registering..." : "Create Account"}
                </button>

                <p style={{ textAlign: "center", marginTop: "15px", fontSize: "14px", color: "#777" }}>
                    Already have an account?{" "}
                    <span style={{ color: "#1a237e", cursor: "pointer", fontWeight: "600" }}
                          onClick={onSwitchToLogin}>
            Login here
          </span>
                </p>
            </div>
        </div>
    );
}