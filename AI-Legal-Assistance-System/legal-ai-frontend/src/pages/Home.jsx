export default function Home({ onNavigate }) {
    return (
        <div className="container">
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
                <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>
                    🏛️ AI-Powered Legal Assistance System
                </h2>
                <p style={{ color: "#777", marginBottom: "30px" }}>
                    File complaints, get legal advice, and access emergency helplines
                </p>
            </div>

            <div className="grid-3" style={{ marginBottom: "20px" }}>
                <div className="stat-card">
                    <h3>📋</h3>
                    <p>File Complaint</p>
                    <button className="btn btn-primary" style={{ marginTop: "10px" }}
                            onClick={() => onNavigate("complaint")}>
                        File Now
                    </button>
                </div>
                <div className="stat-card">
                    <h3>🤖</h3>
                    <p>AI Crime Detection</p>
                    <button className="btn btn-primary" style={{ marginTop: "10px" }}
                            onClick={() => onNavigate("complaints")}>
                        View Complaints
                    </button>
                </div>
                <div className="stat-card">
                    <h3>🚨</h3>
                    <p>Emergency Helplines</p>
                    <button className="btn btn-danger" style={{ marginTop: "10px" }}
                            onClick={() => onNavigate("helplines")}>
                        View Helplines
                    </button>
                </div>
            </div>

            <div className="grid-2">
                <div className="card">
                    <h2>⚡ Quick Actions</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <button className="btn btn-primary" onClick={() => onNavigate("complaint")}>
                            📋 File New Complaint
                        </button>
                        <button className="btn btn-success" onClick={() => onNavigate("complaints")}>
                            📁 My Complaints & FIR
                        </button>
                        <button className="btn btn-danger" onClick={() => onNavigate("helplines")}>
                            🚨 Emergency Helplines
                        </button>
                    </div>
                </div>

                <div className="card">
                    <h2>ℹ️ How It Works</h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "14px" }}>
                        <div>✅ <strong>Step 1:</strong> File your complaint with details</div>
                        <div>🤖 <strong>Step 2:</strong> AI classifies the crime automatically</div>
                        <div>📄 <strong>Step 3:</strong> FIR draft is auto-generated</div>
                        <div>⚖️ <strong>Step 4:</strong> Get legal advice & IPC sections</div>
                        <div>🚨 <strong>Step 5:</strong> Access emergency helplines</div>
                    </div>
                </div>
            </div>
        </div>
    );
}