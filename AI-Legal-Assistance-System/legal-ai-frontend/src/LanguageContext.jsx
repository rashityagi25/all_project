import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const translations = {
    en: {
        // Navbar
        home: "🏠 Home",
        fileComplaint: "📋 File Complaint",
        myComplaints: "📁 My Complaints",
        officerPanel: "👮 Officer Panel",
        dashboard: "📊 Dashboard",
        legalAI: "🤖 Legal AI",
        helplines: "🚨 Helplines",
        logout: "🚪 Logout",

        // Home
        systemTitle: "🏛️ AI-Powered Legal Assistance System",
        systemSubtitle: "File complaints, get legal advice, and access emergency helplines",
        fileNow: "File Now",
        viewComplaints: "View Complaints",
        viewHelplines: "View Helplines",
        quickActions: "⚡ Quick Actions",
        howItWorks: "ℹ️ How It Works",
        step1: "✅ Step 1: File your complaint with details",
        step2: "🤖 Step 2: AI classifies the crime automatically",
        step3: "📄 Step 3: FIR draft is auto-generated",
        step4: "⚖️ Step 4: Get legal advice & IPC sections",
        step5: "🚨 Step 5: Access emergency helplines",

        // File Complaint
        complaintTitle: "📋 File New Complaint",
        title: "Complaint Title",
        crimeType: "Crime Type",
        description: "Description",
        location: "📍 Incident Location",
        street: "Street",
        city: "City",
        state: "State",
        pincode: "Pincode",
        submitComplaint: "📋 File Complaint",
        cancel: "Cancel",

        // My Complaints
        myComplaintsTitle: "📁 My Complaints",
        noComplaints: "No complaints filed yet.",
        fileFirst: "File First Complaint",
        timeline: "📍 Timeline",
        fir: "📄 FIR",
        evidence: "📎 Evidence",

        // Profile
        myProfile: "👤 My Profile",
        editProfile: "✏️ Edit Profile",
        saveChanges: "💾 Save Changes",
        totalComplaints: "Total Complaints",
        resolved: "Resolved",
        pending: "Pending",

        // Login
        login: "Login",
        email: "Email",
        password: "Password",
        registerHere: "Register here",
        noAccount: "Don't have an account?",

        // Register
        createAccount: "Create Account",
        fullName: "Full Name",
        phone: "Phone",
        loginHere: "Login here",
        haveAccount: "Already have an account?",
    },

    hi: {
        // Navbar
        home: "🏠 होम",
        fileComplaint: "📋 शिकायत दर्ज करें",
        myComplaints: "📁 मेरी शिकायतें",
        officerPanel: "👮 अधिकारी पैनल",
        dashboard: "📊 डैशबोर्ड",
        legalAI: "🤖 कानूनी AI",
        helplines: "🚨 हेल्पलाइन",
        logout: "🚪 लॉगआउट",

        // Home
        systemTitle: "🏛️ AI-संचालित कानूनी सहायता प्रणाली",
        systemSubtitle: "शिकायत दर्ज करें, कानूनी सलाह लें और आपातकालीन हेल्पलाइन तक पहुंचें",
        fileNow: "अभी दर्ज करें",
        viewComplaints: "शिकायतें देखें",
        viewHelplines: "हेल्पलाइन देखें",
        quickActions: "⚡ त्वरित कार्य",
        howItWorks: "ℹ️ यह कैसे काम करता है",
        step1: "✅ चरण 1: अपनी शिकायत विवरण के साथ दर्ज करें",
        step2: "🤖 चरण 2: AI स्वचालित रूप से अपराध वर्गीकृत करता है",
        step3: "📄 चरण 3: FIR मसौदा स्वचालित रूप से तैयार होता है",
        step4: "⚖️ चरण 4: कानूनी सलाह और IPC धाराएं प्राप्त करें",
        step5: "🚨 चरण 5: आपातकालीन हेल्पलाइन तक पहुंचें",

        // File Complaint
        complaintTitle: "📋 नई शिकायत दर्ज करें",
        title: "शिकायत का शीर्षक",
        crimeType: "अपराध का प्रकार",
        description: "विवरण",
        location: "📍 घटना स्थान",
        street: "सड़क",
        city: "शहर",
        state: "राज्य",
        pincode: "पिनकोड",
        submitComplaint: "📋 शिकायत दर्ज करें",
        cancel: "रद्द करें",

        // My Complaints
        myComplaintsTitle: "📁 मेरी शिकायतें",
        noComplaints: "अभी तक कोई शिकायत दर्ज नहीं की गई।",
        fileFirst: "पहली शिकायत दर्ज करें",
        timeline: "📍 टाइमलाइन",
        fir: "📄 FIR",
        evidence: "📎 साक्ष्य",

        // Profile
        myProfile: "👤 मेरी प्रोफाइल",
        editProfile: "✏️ प्रोफाइल संपादित करें",
        saveChanges: "💾 बदलाव सहेजें",
        totalComplaints: "कुल शिकायतें",
        resolved: "हल की गई",
        pending: "लंबित",

        // Login
        login: "लॉगिन",
        email: "ईमेल",
        password: "पासवर्ड",
        registerHere: "यहाँ रजिस्टर करें",
        noAccount: "खाता नहीं है?",

        // Register
        createAccount: "खाता बनाएं",
        fullName: "पूरा नाम",
        phone: "फ़ोन",
        loginHere: "यहाँ लॉगिन करें",
        haveAccount: "पहले से खाता है?",
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState("en");
    const t = translations[language];
    const toggleLanguage = () => setLanguage(prev => prev === "en" ? "hi" : "en");

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}