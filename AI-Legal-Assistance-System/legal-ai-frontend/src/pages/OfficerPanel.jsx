import { useState, useEffect } from "react";
import axios from "axios";

const API = "";

export default function OfficerPanel({ token, onNavigate }) {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get(`${API}/api/complaints/my-assigned`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplaints(res.data);
        } catch (e) {
            console.error("Failed to fetch complaints");
        }
        setLoading(false);
    };

    const updateStatus = async (complaintId, status) => {
        setUpdating(complaintId);
        try {
            await axios.put(`${API}/api/complaints/${complaintId}/status`,
                { status, message: `Status updated to ${status}` },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(`✅ Status updated to ${status}!`);
            fetchComplaints();
            setTimeout(() => setMessage(""), 3000);
        } catch (e) {
            setMessage("❌ Update failed!");
        }
        setUpdating(null);
    };

    const getStatusBadge = (status) => {
        const map = {
            SUBMITTED: "badge-info",
            UNDER_REVIEW: "badge-warning",
            RESOLVED: "badge-success",
            REJECTED: "badge-danger"
        };
        return map[status] || "badge-info";
    };

    if (loading) return <div className="loading">Loading assigned complaints...</div>;

    return (
        <div className="container">
            <div className="card">
                <h2>👮 Officer Panel — Assigned Complaints</h2>
                <p style={{ color: "#777", marginBottom: "20px" }}>
                    Total assigned: <strong>{complaints.length}</strong>
                </p>

                {message && <div className="alert alert-success">{message}</div>}

                {complaints.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px", color: "#777" }}>
                        <p style={{ fontSize: "40px" }}>📭</p>
                        <p>Koi complaint assign nahi hui abhi.</p>
                    </div>
                ) : (
                    complaints.map(c => (
                        <div key={c.id} style={{
                            border: "1px solid #eee", borderRadius: "10px",
                            padding: "20px", marginBottom: "15px",
                            borderLeft: "4px solid #1a237e"
                        }}>
                            <div className="grid-2">
                                <div>
                                    <h3 style={{ color: "#1a237e", marginBottom: "8px" }}>{c.title}</h3>
                                    <p style={{ color: "#555", fontSize: "14px" }}>{c.description}</p>
                                    <div style={{ marginTop: "8px", fontSize: "13px", color: "#777" }}>
                                        📍 {c.address?.city}, {c.address?.state}<br />
                                        📅 {new Date(c.createdAt).toLocaleDateString('en-IN')}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ marginBottom: "12px" }}>
                                        <strong>Status: </strong>
                                        <span className={`badge ${getStatusBadge(c.status)}`}>
                      {c.status}
                    </span>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                        <button className="btn btn-primary"
                                                style={{ fontSize: "13px" }}
                                                disabled={updating === c.id || c.status === "UNDER_REVIEW"}
                                                onClick={() => updateStatus(c.id, "UNDER_REVIEW")}>
                                            🔍 Mark Under Review
                                        </button>
                                        <button className="btn btn-success"
                                                style={{ fontSize: "13px" }}
                                                disabled={updating === c.id || c.status === "RESOLVED"}
                                                onClick={() => updateStatus(c.id, "RESOLVED")}>
                                            ✅ Mark Resolved
                                        </button>
                                        <button className="btn btn-danger"
                                                style={{ fontSize: "13px" }}
                                                disabled={updating === c.id || c.status === "REJECTED"}
                                                onClick={() => updateStatus(c.id, "REJECTED")}>
                                            ❌ Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}