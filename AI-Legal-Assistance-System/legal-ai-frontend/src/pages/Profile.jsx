import { useState, useEffect } from "react";
import axios from "axios";

const API = "";

export default function Profile({ token, onNavigate }) {
    const [user, setUser] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const [profileRes, complaintsRes] = await Promise.all([
                axios.get(`${API}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API}/api/complaints`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setUser(profileRes.data);
            setForm({
                name: profileRes.data.name,
                phone: profileRes.data.phone,
                state: profileRes.data.state
            });
            setComplaints(complaintsRes.data);
        } catch (e) {
            console.error("Failed to fetch profile");
        }
        setLoading(false);
    };

    const handleUpdate = async () => {
        try {
            const res = await axios.put(`${API}/api/auth/profile`, form, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
            setEditing(false);
            setMessage("✅ Profile update ho gaya!");
            setTimeout(() => setMessage(""), 3000);
        } catch (e) {
            setError("❌ Update failed!");
        }
    };

    if (loading) return <div className="loading">Profile load ho rahi hai...</div>;

    const resolved = complaints.filter(c => c.status === "RESOLVED").length;
    const pending = complaints.filter(c => c.status === "SUBMITTED").length;
    const underReview = complaints.filter(c => c.status === "UNDER_REVIEW").length;

    return (
        <div className="container">

            {/* Profile Card */}
            <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>👤 My Profile</h2>
                    <button className="btn btn-primary"
                            onClick={() => setEditing(!editing)}>
                        {editing ? "❌ Cancel" : "✏️ Edit Profile"}
                    </button>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                {/* Avatar */}
                <div style={{ textAlign: "center", margin: "20px 0" }}>
                    <div style={{
                        width: "80px", height: "80px", borderRadius: "50%",
                        background: "#1a237e", color: "white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "32px", margin: "0 auto 10px"
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <h3>{user?.name}</h3>
                    <span className={`badge ${
                        user?.role === "ADMIN" ? "badge-danger" :
                            user?.role === "OFFICER" ? "badge-warning" : "badge-success"
                    }`}>
            {user?.role}
          </span>
                </div>

                {/* Profile Details */}
                {!editing ? (
                    <div className="grid-2">
                        <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>📧 Email:</strong><br />
                                <span>{user?.email}</span>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>📱 Phone:</strong><br />
                                <span>{user?.phone}</span>
                            </div>
                        </div>
                        <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>🗺️ State:</strong><br />
                                <span>{user?.state}</span>
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <strong>📅 Joined:</strong><br />
                                <span>{new Date(user?.createdAt).toLocaleDateString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input value={form.name}
                                   onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input value={form.phone}
                                   onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>State</label>
                            <input value={form.state}
                                   onChange={e => setForm({ ...form, state: e.target.value })} />
                        </div>
                        <button className="btn btn-primary" onClick={handleUpdate}>
                            💾 Save Changes
                        </button>
                    </div>
                )}
            </div>

            {/* Stats */}
            {user?.role === "USER" && (
                <>
                    <div className="grid-3" style={{ marginBottom: "20px" }}>
                        <div className="stat-card" style={{ borderTop: "4px solid #1a237e" }}>
                            <h3 style={{ color: "#1a237e" }}>{complaints.length}</h3>
                            <p>Total Complaints</p>
                        </div>
                        <div className="stat-card" style={{ borderTop: "4px solid #2e7d32" }}>
                            <h3 style={{ color: "#2e7d32" }}>{resolved}</h3>
                            <p>Resolved</p>
                        </div>
                        <div className="stat-card" style={{ borderTop: "4px solid #c62828" }}>
                            <h3 style={{ color: "#c62828" }}>{pending}</h3>
                            <p>Pending</p>
                        </div>
                    </div>

                    {/* Recent Complaints */}
                    <div className="card">
                        <h2>📋 Recent Complaints</h2>
                        {complaints.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "20px", color: "#777" }}>
                                <p>Koi complaint nahi hai abhi.</p>
                                <button className="btn btn-primary" style={{ marginTop: "10px" }}
                                        onClick={() => onNavigate("complaint")}>
                                    📋 File Complaint
                                </button>
                            </div>
                        ) : (
                            <table>
                                <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {complaints.slice(0, 5).map(c => (
                                    <tr key={c.id}>
                                        <td>{c.title}</td>
                                        <td>
                        <span className={`badge ${
                            c.status === "RESOLVED" ? "badge-success" :
                                c.status === "UNDER_REVIEW" ? "badge-warning" :
                                    c.status === "REJECTED" ? "badge-danger" : "badge-info"
                        }`}>{c.status}</span>
                                        </td>
                                        <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}