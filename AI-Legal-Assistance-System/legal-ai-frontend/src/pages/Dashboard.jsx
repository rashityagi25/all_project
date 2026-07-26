import { useState, useEffect } from "react";
import axios from "axios";
import {
    PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const API = "";
const COLORS = ["#1a237e", "#c62828", "#2e7d32", "#f57f17", "#6a1b9a", "#00838f"];

export default function Dashboard({ token }) {
    const [stats, setStats] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, complaintsRes] = await Promise.all([
                axios.get(`${API}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API}/api/complaints/all`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setStats(statsRes.data);
            setComplaints(complaintsRes.data);
        } catch (e) {
            console.error("Failed to fetch dashboard data");
        }
        setLoading(false);
    };

    if (loading) return <div className="loading">Dashboard load ho raha hai...</div>;

    // Status distribution data
    const statusData = complaints.reduce((acc, c) => {
        const existing = acc.find(x => x.name === c.status);
        if (existing) existing.value++;
        else acc.push({ name: c.status, value: 1 });
        return acc;
    }, []);

    // Crime type distribution data
    const crimeData = complaints.reduce((acc, c) => {
        const existing = acc.find(x => x.name === c.crimeTypeId);
        if (existing) existing.count++;
        else acc.push({ name: c.crimeTypeId, count: 1 });
        return acc;
    }, []);

    // Recent complaints
    const recentComplaints = [...complaints]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const totalComplaints = complaints.length;
    const resolved = complaints.filter(c => c.status === "RESOLVED").length;
    const pending = complaints.filter(c => c.status === "SUBMITTED").length;
    const underReview = complaints.filter(c => c.status === "UNDER_REVIEW").length;

    return (
        <div className="container">
            <div className="card">
                <h2>📊 Admin Dashboard</h2>
                <p style={{ color: "#777" }}>System ka pura overview</p>
            </div>

            {/* Stats Cards */}
            <div className="grid-3" style={{ marginBottom: "20px" }}>
                <div className="stat-card" style={{ borderTop: "4px solid #1a237e" }}>
                    <h3 style={{ color: "#1a237e" }}>{totalComplaints}</h3>
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

            <div className="grid-2" style={{ marginBottom: "20px" }}>
                <div className="stat-card" style={{ borderTop: "4px solid #f57f17" }}>
                    <h3 style={{ color: "#f57f17" }}>{underReview}</h3>
                    <p>Under Review</p>
                </div>
                <div className="stat-card" style={{ borderTop: "4px solid #6a1b9a" }}>
                    <h3 style={{ color: "#6a1b9a" }}>
                        {totalComplaints > 0 ? Math.round((resolved / totalComplaints) * 100) : 0}%
                    </h3>
                    <p>Resolution Rate</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid-2" style={{ marginBottom: "20px" }}>

                {/* Pie Chart - Status */}
                <div className="card">
                    <h2>📈 Status Distribution</h2>
                    {statusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%"
                                     outerRadius={80} dataKey="value" label={({name, value}) => `${name}: ${value}`}>
                                    {statusData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ textAlign: "center", color: "#777", padding: "40px" }}>
                            Koi data nahi
                        </p>
                    )}
                </div>

                {/* Bar Chart - Crime Types */}
                <div className="card">
                    <h2>🔍 Crime Type Distribution</h2>
                    {crimeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={crimeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="count" fill="#1a237e" name="Complaints" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p style={{ textAlign: "center", color: "#777", padding: "40px" }}>
                            Koi data nahi
                        </p>
                    )}
                </div>
            </div>

            {/* Recent Complaints */}
            <div className="card">
                <h2>🕒 Recent Complaints</h2>
                {recentComplaints.length === 0 ? (
                    <p style={{ color: "#777" }}>Koi complaint nahi</p>
                ) : (
                    <table>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Crime Type</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentComplaints.map(c => (
                            <tr key={c.id}>
                                <td>{c.title}</td>
                                <td>{c.crimeTypeId}</td>
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
        </div>
    );
}