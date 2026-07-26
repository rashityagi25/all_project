import { useState, useEffect } from "react";
import axios from "axios";

const API = "";

export default function EvidenceUpload({ token, complaintId, onClose }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [evidenceList, setEvidenceList] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchEvidence();
    }, []);

    const fetchEvidence = async () => {
        try {
            const res = await axios.get(`${API}/api/evidence/complaint/${complaintId}`);
            setEvidenceList(res.data);
        } catch (e) {
            console.error("Failed to fetch evidence");
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Pehle file select karo!");
            return;
        }

        setUploading(true);
        setError("");
        setMessage("");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("complaintId", complaintId);

        try {
            await axios.post(`${API}/api/evidence/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setMessage("✅ Evidence upload ho gaya!");
            setFile(null);
            fetchEvidence();
        } catch (e) {
            setError("❌ Upload failed. Try again.");
        }
        setUploading(false);
    };

    const getFileIcon = (mimeType) => {
        if (mimeType?.includes("image")) return "🖼️";
        if (mimeType?.includes("pdf")) return "📄";
        if (mimeType?.includes("video")) return "🎥";
        return "📎";
    };

    return (
        <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.5)", display: "flex",
            alignItems: "center", justifyContent: "center", zIndex: 1000
        }}>
            <div className="card" style={{ width: "500px", maxHeight: "80vh", overflowY: "auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2>📎 Evidence Upload</h2>
                    <button className="btn btn-danger" onClick={onClose}>✖ Close</button>
                </div>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-error">{error}</div>}

                {/* Upload Section */}
                <div style={{
                    border: "2px dashed #1a237e", borderRadius: "10px",
                    padding: "20px", textAlign: "center", marginBottom: "20px"
                }}>
                    <p style={{ fontSize: "40px" }}>📁</p>
                    <p style={{ color: "#777", marginBottom: "15px" }}>
                        Photo, PDF, ya Video select karo
                    </p>
                    <input type="file"
                           accept="image/*,.pdf,video/*"
                           onChange={e => setFile(e.target.files[0])}
                           style={{ marginBottom: "10px" }} />
                    {file && (
                        <p style={{ color: "#1a237e", fontWeight: "600" }}>
                            Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </p>
                    )}
                </div>

                <button className="btn btn-primary" style={{ width: "100%", padding: "12px" }}
                        onClick={handleUpload} disabled={uploading || !file}>
                    {uploading ? "Upload ho raha hai..." : "📤 Upload Evidence"}
                </button>

                {/* Evidence List */}
                {evidenceList.length > 0 && (
                    <div style={{ marginTop: "20px" }}>
                        <h3 style={{ color: "#1a237e", marginBottom: "15px" }}>
                            📋 Uploaded Evidence ({evidenceList.length})
                        </h3>
                        {evidenceList.map(e => (
                            <div key={e.id} style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", padding: "10px",
                                background: "#f5f5f5", borderRadius: "8px", marginBottom: "8px"
                            }}>
                                <div>
                  <span style={{ fontSize: "20px", marginRight: "10px" }}>
                    {getFileIcon(e.mimeType)}
                  </span>
                                    <strong>{e.filename}</strong>
                                    <span style={{ color: "#777", fontSize: "12px", marginLeft: "10px" }}>
                    ({(e.fileSize / 1024).toFixed(1)} KB)
                  </span>
                                </div>
                                <a href={`${API}/api/evidence/download/${e.id}`}
                                   target="_blank" rel="noreferrer">
                                    <button className="btn btn-success"
                                            style={{ padding: "5px 12px", fontSize: "12px" }}>
                                        ⬇️ Download
                                    </button>
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}