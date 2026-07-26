import { useState, useEffect } from "react";
import axios from "axios";

const API = "";

export default function Helplines() {
    const [helplines, setHelplines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchHelplines();
    }, []);

    const fetchHelplines = async () => {
        try {
            const res = await axios.get(`${API}/api/helplines`);
            setHelplines(res.data);
        } catch (e) {
            console.error("Failed to fetch helplines");
        }
        setLoading(false);
    };

    const filtered = helplines.filter(h =>
        h.title.toLowerCase().includes(search.toLowerCase()) ||
        h.crimeType.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="loading">Loading helplines...</div>;

    return (
        <div className="container">
            <div className="card">
                <h2>🚨 Emergency Helplines</h2>
                <p style={{ color: "#777", marginBottom: "20px" }}>
                    Quick access to emergency contacts for all crime types
                </p>
                <div className="form-group">
                    <input placeholder="🔍 Search helplines..."
                           value={search}
                           onChange={e => setSearch(e.target.value)} />
                </div>
            </div>

            {/* Emergency Numbers Banner */}
            <div style={{
                background: "#c62828", color: "white", borderRadius: "12px",
                padding: "20px", marginBottom: "20px", textAlign: "center"
            }}>
                <h3 style={{ marginBottom: "15px" }}>⚡ Quick Emergency Numbers</h3>
                <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
                    {[
                        { name: "Police", number: "100" },
                        { name: "Ambulance", number: "108" },
                        { name: "Fire", number: "101" },
                        { name: "National Emergency", number: "112" },
                        { name: "Women Helpline", number: "1091" },
                        { name: "Cyber Crime", number: "1930" },
                    ].map(e => (
                        <div key={e.number} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "24px", fontWeight: "700" }}>{e.number}</div>
                            <div style={{ fontSize: "12px", opacity: 0.9 }}>{e.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid-3">
                {filtered.map(h => (
                    <div key={h.id} className="helpline-card">
                        <h3>{h.title}</h3>
                        <p style={{ color: "#777", fontSize: "13px", marginBottom: "12px" }}>
                            {h.description}
                        </p>
                        {h.contacts.map((c, i) => (
                            <div key={i} className="contact-item">
                                <div>
                                    <div style={{ fontWeight: "600", fontSize: "13px" }}>{c.name}</div>
                                    <div style={{ fontSize: "11px", color: "#777" }}>{c.description}</div>
                                    {c.available24x7 && (
                                        <span className="badge badge-success" style={{ fontSize: "10px" }}>
                      24x7
                    </span>
                                    )}
                                </div>
                                <div className="contact-number">{c.number}</div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}