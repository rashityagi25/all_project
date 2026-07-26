import { useState, useRef, useEffect } from "react";
import axios from "axios";

const FLASK_API = "";

export default function Chatbot() {
    const [messages, setMessages] = useState([
        {
            type: "bot",
            text: "Namaste! 🙏 Main aapka Legal AI Assistant hun!\n\nMain aapki help kar sakta hun:\n• FIR kaise file karein?\n• IPC sections kya hain?\n• Bail kaise milti hai?\n• Emergency helplines\n• Legal advice\n\nApna sawaal poochiye!"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput("");
        setMessages(prev => [...prev, { type: "user", text: userMsg }]);
        setLoading(true);

        try {
            const res = await axios.post(`/ai/chat`, {
                message: userMsg
            });
            setMessages(prev => [...prev, {
                type: "bot",
                text: res.data.response
            }]);
        } catch (e) {
            setMessages(prev => [...prev, {
                type: "bot",
                text: "❌ Sorry, abhi server se connect nahi ho pa raha. Thodi der baad try karo."
            }]);
        }
        setLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const quickQuestions = [
        "FIR kaise file karein?",
        "Theft ke liye IPC section?",
        "Emergency helplines kya hain?",
        "Bail kaise milti hai?",
        "Cybercrime report karna hai",
        "Women safety helpline?"
    ];

    return (
        <div className="container">
            <div className="card" style={{ padding: "0", overflow: "hidden" }}>

                {/* Header */}
                <div style={{
                    background: "#1a237e", color: "white",
                    padding: "20px 25px", display: "flex",
                    alignItems: "center", gap: "15px"
                }}>
                    <div style={{
                        width: "45px", height: "45px", borderRadius: "50%",
                        background: "white", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: "22px"
                    }}>⚖️</div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: "18px" }}>Legal AI Assistant</h2>
                        <p style={{ margin: 0, fontSize: "12px", opacity: 0.8 }}>
                            🟢 Online — Legal advice ke liye ready!
                        </p>
                    </div>
                </div>

                {/* Quick Questions */}
                <div style={{
                    padding: "15px 20px", background: "#f8f9fa",
                    borderBottom: "1px solid #eee"
                }}>
                    <p style={{ fontSize: "12px", color: "#777", marginBottom: "8px" }}>
                        ⚡ Quick Questions:
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {quickQuestions.map((q, i) => (
                            <button key={i}
                                    onClick={() => { setInput(q); }}
                                    style={{
                                        background: "white", border: "1px solid #1a237e",
                                        color: "#1a237e", padding: "4px 12px",
                                        borderRadius: "20px", fontSize: "12px",
                                        cursor: "pointer"
                                    }}>
                                {q}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <div style={{
                    height: "400px", overflowY: "auto",
                    padding: "20px", background: "#fafafa"
                }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            display: "flex",
                            justifyContent: msg.type === "user" ? "flex-end" : "flex-start",
                            marginBottom: "15px"
                        }}>
                            {msg.type === "bot" && (
                                <div style={{
                                    width: "32px", height: "32px", borderRadius: "50%",
                                    background: "#1a237e", color: "white",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", fontSize: "16px",
                                    marginRight: "10px", flexShrink: 0
                                }}>⚖️</div>
                            )}
                            <div style={{
                                maxWidth: "70%",
                                background: msg.type === "user" ? "#1a237e" : "white",
                                color: msg.type === "user" ? "white" : "#333",
                                padding: "12px 16px", borderRadius: "12px",
                                boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                                fontSize: "14px", lineHeight: "1.6",
                                whiteSpace: "pre-wrap"
                            }}>
                                {msg.text}
                            </div>
                            {msg.type === "user" && (
                                <div style={{
                                    width: "32px", height: "32px", borderRadius: "50%",
                                    background: "#c62828", color: "white",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", fontSize: "16px",
                                    marginLeft: "10px", flexShrink: 0
                                }}>👤</div>
                            )}
                        </div>
                    ))}
                    {loading && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{
                                width: "32px", height: "32px", borderRadius: "50%",
                                background: "#1a237e", color: "white",
                                display: "flex", alignItems: "center",
                                justifyContent: "center", fontSize: "16px"
                            }}>⚖️</div>
                            <div style={{
                                background: "white", padding: "12px 16px",
                                borderRadius: "12px", color: "#777",
                                boxShadow: "0 1px 5px rgba(0,0,0,0.1)"
                            }}>
                                ⏳ Soch raha hun...
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div style={{
                    padding: "15px 20px", background: "white",
                    borderTop: "1px solid #eee",
                    display: "flex", gap: "10px"
                }}>
                    <input
                        style={{
                            flex: 1, padding: "12px 16px",
                            border: "1px solid #ddd", borderRadius: "25px",
                            fontSize: "14px", outline: "none"
                        }}
                        placeholder="Apna legal sawaal yahan likhein..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={loading}
                    />
                    <button
                        className="btn btn-primary"
                        style={{ borderRadius: "25px", padding: "12px 24px" }}
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}>
                        Send 📤
                    </button>
                </div>
            </div>
        </div>
    );
}