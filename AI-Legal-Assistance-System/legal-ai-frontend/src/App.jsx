import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import FileComplaint from "./pages/FileComplaint";
import MyComplaints from "./pages/MyComplaints";
import Helplines from "./pages/Helplines";
import OfficerPanel from "./pages/OfficerPanel";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import Profile from "./pages/Profile";
import { useLanguage } from "./LanguageContext";
import "./index.css";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [page, setPage] = useState("home");
  const [authPage, setAuthPage] = useState("login");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    if (!token) {
      setPage("login");
    } else {
      const decoded = parseJwt(token);
      if (decoded) {
        setUserRole(decoded.role);
        setUserName(decoded.sub);
      }
    }
  }, [token]);

  const handleLogin = (t) => {
    setToken(t);
    localStorage.setItem("token", t);
    const decoded = parseJwt(t);
    if (decoded) {
      setUserRole(decoded.role);
      setUserName(decoded.sub);
    }
    setPage("home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUserRole("");
    setUserName("");
    setAuthPage("login");
  };

  if (!token) {
    return authPage === "login"
        ? <Login onLogin={handleLogin} onSwitchToRegister={() => setAuthPage("register")} />
        : <Register onSwitchToLogin={() => setAuthPage("login")} />;
  }

  return (
      <div>
        {/* Navbar */}
        <div className="navbar">
          <h1>🏛️ Legal AI System</h1>
          <div className="navbar-links">
            <button onClick={() => setPage("home")}>{t.home}</button>
            {userRole === "USER" && (
                <>
                  <button onClick={() => setPage("complaint")}>{t.fileComplaint}</button>
                  <button onClick={() => setPage("complaints")}>{t.myComplaints}</button>
                </>
            )}
            {userRole === "OFFICER" && (
                <button onClick={() => setPage("officer")}>{t.officerPanel}</button>
            )}
            {userRole === "ADMIN" && (
                <>
                  <button onClick={() => setPage("complaint")}>{t.fileComplaint}</button>
                  <button onClick={() => setPage("complaints")}>{t.myComplaints}</button>
                  <button onClick={() => setPage("officer")}>{t.officerPanel}</button>
                  <button onClick={() => setPage("dashboard")}>{t.dashboard}</button>
                </>
            )}
            <button onClick={() => setPage("chatbot")}>{t.legalAI}</button>
            <button onClick={() => setPage("helplines")}>{t.helplines}</button>
            <button onClick={() => setPage("profile")}
                    style={{ background: "transparent", border: "1px solid #aaa", color: "#aaa" }}>
              👤 {userName}
            </button>

            {/* Language Toggle */}
            <button onClick={toggleLanguage}
                    style={{
                      background: language === "en" ? "#ff9800" : "#4caf50",
                      border: "none", color: "white",
                      padding: "6px 14px", borderRadius: "5px",
                      cursor: "pointer", fontWeight: "700"
                    }}>
              {language === "en" ? "🇮🇳 हिंदी" : "🇬🇧 English"}
            </button>

            <button onClick={handleLogout}>{t.logout}</button>
          </div>
        </div>

        {/* Pages */}
        {page === "home" && <Home onNavigate={setPage} />}
        {page === "complaint" && <FileComplaint token={token} onNavigate={setPage} />}
        {page === "complaints" && <MyComplaints token={token} onNavigate={setPage} />}
        {page === "helplines" && <Helplines />}
        {page === "officer" && <OfficerPanel token={token} onNavigate={setPage} />}
        {page === "dashboard" && <Dashboard token={token} />}
        {page === "chatbot" && <Chatbot />}
        {page === "profile" && <Profile token={token} onNavigate={setPage} />}
      </div>
  );
}