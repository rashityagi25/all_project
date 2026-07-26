import { useState, useEffect } from "react";
import axios from "axios";
import EvidenceUpload from "./EvidenceUpload";

const API = "";

export default function MyComplaints({ token, onNavigate }) {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [selectedFir, setSelectedFir] = useState(null);
    const [firLoading, setFirLoading] = useState(false);
    const [showEvidence, setShowEvidence] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await axios.get(`${API}/api/complaints`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setComplaints(res.data);
        } catch (e) {
            console.error("Failed to fetch complaints");
        }
        setLoading(false);
    };

    const viewFir = async (complaintId) => {
        setFirLoading(true);
        setSelectedFir(null);
        try {
            const res = await axios.get(`${API}/api/fir/complaint/${complaintId}`);
            setSelectedFir(res.data);
        } catch (e) {
            setSelectedFir({ error: "FIR not found for this complaint." });
        }
        setFirLoading(false);
    };

    const getStatusBadge = (status) => {
        const map = {
            SUBMITTED: { class: "badge-info", icon: "📋", text: "Submitted" },
            UNDER_REVIEW: { class: "badge-warning", icon: "🔍", text: "Under Review" },
            RESOLVED: { class: "badge-success", icon: "✅", text: "Resolved" },
            REJECTED: { class: "badge-danger", icon: "❌", text: "Rejected" }
        };
        return map[status] || { class: "badge-info", icon: "📋", text: status };
    };

    if (loading) return <div className="loading">Loading complaints...</div>;

    return (
        <div className="container">

            {/* Evidence Upload Modal */}
            {showEvidence && (
                <EvidenceUpload
                    token={token}
                    complaintId={showEvidence}
                    onClose={() => setShowEvidence(null)}
                />
            )}

            <div className="card">
                <h2>📁 My Complaints</h2>
                {complaints.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "30px", color: "#777" }}>
                        <p style={{ fontSize: "40px" }}>📭</p>
                        <p>Koi complaint nahi mili.</p>
                        <button className="btn btn-primary" style={{ marginTop: "15px" }}
                                onClick={() => onNavigate("complaint")}>
                            Pehli Complaint File Karo
                        </button>
                    </div>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Crime Type</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {complaints.map(c => {
                            const badge = getStatusBadge(c.status);
                            return (
                                <tr key={c.id}>
                                    <td><strong>{c.title}</strong></td>
                                    <td>{c.crimeTypeId}</td>
                                    <td>
                      <span className={`badge ${badge.class}`}>
                        {badge.icon} {badge.text}
                      </span>
                                    </td>
                                    <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                                    <td style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                                        <button className="btn btn-primary"
                                                style={{ padding: "4px 10px", fontSize: "11px" }}
                                                onClick={() => setSelectedComplaint(
                                                    selectedComplaint?.id === c.id ? null : c
                                                )}>
                                            📍 Timeline
                                        </button>
                                        <button className="btn btn-success"
                                                style={{ padding: "4px 10px", fontSize: "11px" }}
                                                onClick={() => viewFir(c.id)}>
                                            📄 FIR
                                        </button>
                                        <button className="btn btn-danger"
                                                style={{ padding: "4px 10px", fontSize: "11px" }}
                                                onClick={() => setShowEvidence(c.id)}>
                                            📎 Evidence
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Timeline */}
            {selectedComplaint && (
                <div className="card">
                    <h2>📍 Complaint Timeline — {selectedComplaint.title}</h2>
                    <div style={{ padding: "10px 0" }}>
                        {selectedComplaint.timeline && selectedComplaint.timeline.map((event, i) => (
                            <div key={i} style={{
                                display: "flex", gap: "15px", marginBottom: "20px",
                                paddingBottom: "20px",
                                borderBottom: i < selectedComplaint.timeline.length - 1 ? "1px dashed #ddd" : "none"
                            }}>
                                <div style={{
                                    width: "40px", height: "40px", borderRadius: "50%",
                                    background: "#1a237e", color: "white",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: "12px", fontWeight: "700", flexShrink: 0
                                }}>
                                    {i + 1}
                                </div>
                                <div>
                                    <div style={{ fontWeight: "700", color: "#1a237e" }}>
                                        {getStatusBadge(event.status).icon} {event.status}
                                    </div>
                                    <div style={{ color: "#555", margin: "4px 0" }}>{event.message}</div>
                                    <div style={{ fontSize: "12px", color: "#999" }}>
                                        🕒 {new Date(event.timestamp).toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedComplaint.address && (
                        <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
                            <strong>📍 Location:</strong> {selectedComplaint.address.street},
                            {selectedComplaint.address.city}, {selectedComplaint.address.state}
                        </div>
                    )}
                </div>
            )}

            {/* FIR Draft */}
            {firLoading && <div className="loading">FIR load ho rahi hai...</div>}
            {selectedFir && (
                <div className="card">
                    <h2>📄 FIR Draft</h2>
                    {selectedFir.error ? (
                        <div className="alert alert-error">{selectedFir.error}</div>
                    ) : (
                        <>
                            <div className="grid-2" style={{ marginBottom: "20px" }}>
                                <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
                                    <div><strong>FIR Number:</strong> {selectedFir.firNumber}</div>
                                    <div><strong>Filed Date:</strong> {selectedFir.filedDate}</div>
                                    <div><strong>Complainant:</strong> {selectedFir.complainantName}</div>
                                </div>
                                <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px" }}>
                                    <div><strong>IPC Section:</strong> {selectedFir.ipcSection}</div>
                                    <div><strong>AI Confidence:</strong> {(selectedFir.aiConfidence * 100).toFixed(1)}%</div>
                                    <div>
                                        <strong>Crime:</strong>
                                        <span className={`badge ${selectedFir.crime ? "badge-danger" : "badge-success"}`}
                                              style={{ marginLeft: "8px" }}>
                      {selectedFir.crime ? "🔴 YES" : "🟢 NO"}
                    </span>
                                    </div>
                                </div>
                            </div>
                            <div className="fir-draft">{selectedFir.firDraft}</div>
                        </>
                    )}
                    <button className="btn btn-danger" style={{ marginTop: "15px" }}
                            onClick={() => setSelectedFir(null)}>
                        ✖ Close
                    </button>
                </div>
            )}
        </div>
    );
}