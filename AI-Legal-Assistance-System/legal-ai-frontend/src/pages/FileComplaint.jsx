import { useState } from "react";
import axios from "axios";

const API = "";

export default function FileComplaint({ token, onNavigate }) {
    const [form, setForm] = useState({
        title: "", description: "", crimeTypeId: "",
        street: "", city: "", state: "", pincode: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const crimeTypes = [
        { id: "murder", name: "Murder" },
        { id: "theft", name: "Theft" },
        { id: "robbery", name: "Robbery" },
        { id: "assault", name: "Assault" },
        { id: "kidnapping", name: "Kidnapping" },
        { id: "fraud", name: "Fraud" },
        { id: "harassment", name: "Harassment" },
        { id: "cybercrime", name: "Cyber Crime" },
    ];

    const handleSubmit = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const res = await axios.post(`${API}/api/complaints`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(`✅ Complaint filed! ID: ${res.data.id} — FIR is being generated...`);
            setForm({ title: "", description: "", crimeTypeId: "", street: "", city: "", state: "", pincode: "" });
            setTimeout(() => onNavigate("complaints"), 2000);
        } catch (e) {
            setError("Failed to file complaint. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div className="container">
            <div className="card">
                <h2>📋 File New Complaint</h2>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-group">
                    <label>Complaint Title</label>
                    <input placeholder="Brief title of the incident"
                           value={form.title}
                           onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>

                <div className="form-group">
                    <label>Crime Type</label>
                    <select value={form.crimeTypeId}
                            onChange={e => setForm({ ...form, crimeTypeId: e.target.value })}>
                        <option value="">-- Select Crime Type --</option>
                        {crimeTypes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea rows="4" placeholder="Describe the incident in detail..."
                              value={form.description}
                              onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>

                <h3 style={{ margin: "20px 0 15px", color: "#1a237e" }}>📍 Incident Location</h3>

                <div className="grid-2">
                    <div className="form-group">
                        <label>Street</label>
                        <input placeholder="Street address"
                               value={form.street}
                               onChange={e => setForm({ ...form, street: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>City</label>
                        <input placeholder="City"
                               value={form.city}
                               onChange={e => setForm({ ...form, city: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>State</label>
                        <input placeholder="State"
                               value={form.state}
                               onChange={e => setForm({ ...form, state: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Pincode</label>
                        <input placeholder="Pincode"
                               value={form.pincode}
                               onChange={e => setForm({ ...form, pincode: e.target.value })} />
                    </div>
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Filing Complaint..." : "📋 File Complaint"}
                    </button>
                    <button className="btn btn-danger" onClick={() => onNavigate("home")}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}