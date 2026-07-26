# 🏛️ AI-Powered Legal Assistance & Crime Reporting System

> A full-stack web application that enables citizens to file complaints online, get AI-generated FIR drafts, receive legal advice, and access emergency helplines.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Features](#features)
- [AI Model](#ai-model)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)

---

## 🎯 Overview

The AI-Powered Legal Assistance System simplifies the complaint filing process for citizens who may not know legal procedures. The system automatically:
- Classifies whether a complaint is crime-related using ML
- Generates FIR drafts with applicable IPC sections
- Provides legal advice through an AI chatbot
- Tracks complaint status in real-time
- Sends evidence uploads to MongoDB GridFS

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Spring Boot 3.4.5 + Java 24 |
| Database | MongoDB 8.3 |
| AI/ML Service | Python Flask + Scikit-learn |
| Frontend | React 18 + Vite |
| Authentication | JWT (JSON Web Tokens) |
| Charts | Recharts |
| File Storage | MongoDB GridFS |
| ML Model | TF-IDF + Logistic Regression |

---

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   React Frontend │────▶│  Spring Boot Backend  │────▶│  Flask AI API   │
│   (Port: 5173)  │     │    (Port: 8080)        │     │  (Port: 5000)   │
└─────────────────┘     └──────────────────────┘     └─────────────────┘
                                    │                          │
                                    ▼                          ▼
                           ┌─────────────┐          ┌──────────────────┐
                           │   MongoDB   │          │  ML Model (.pkl) │
                           │ (Port:27017)│          │  88.56% Accuracy │
                           └─────────────┘          └──────────────────┘
```

---

## ✨ Features

### 👤 User Features
- ✅ Register & Login with JWT authentication
- ✅ File complaints with location details
- ✅ Auto AI crime classification
- ✅ Auto FIR draft generation with IPC sections
- ✅ Upload evidence (photos, PDFs, videos)
- ✅ Track complaint status with timeline
- ✅ Chat with Legal AI assistant
- ✅ View emergency helplines
- ✅ Profile management
- ✅ Hindi/English language switch

### 👮 Officer Features
- ✅ View assigned complaints
- ✅ Update complaint status (Under Review / Resolved / Rejected)
- ✅ Role-based dashboard

### 👑 Admin Features
- ✅ Dashboard with charts (Pie + Bar)
- ✅ Manage all users and roles
- ✅ Assign officers to complaints
- ✅ View all complaints
- ✅ Statistics overview

### 🤖 AI Features
- ✅ Crime classification (88.56% accuracy)
- ✅ Auto FIR generation
- ✅ Legal advice chatbot
- ✅ IPC section recommendations
- ✅ Batch crime prediction

---

## 🧠 AI Model

### Dataset
- **Name:** CrimeVsNoCrimeArticles.csv
- **Size:** 7,124 samples (perfectly balanced)
- **Classes:** Crime (1) / Not Crime (0)

### Model Pipeline
```
Text Input → TF-IDF Vectorizer → Logistic Regression → Prediction
```

### Model Configuration
```python
TfidfVectorizer(
    ngram_range=(1, 2),     # Unigrams + Bigrams
    max_features=10000,
    sublinear_tf=True,
    stop_words='english',
    min_df=2
)
LogisticRegression(
    C=1.0,
    max_iter=1000,
    random_state=42
)
```

### Performance
| Metric | Score |
|--------|-------|
| Accuracy | 88.56% |
| ROC-AUC | 95.32% |
| CV Mean | 89.39% |
| CV Std | ±0.39% |

---

## 📁 Project Structure

```
Projects/
├── legal-ai-backend/          # Spring Boot Backend
│   └── legal-ai-backend/
│       ├── src/main/java/com/legalai/
│       │   ├── config/        # Security, JWT, CORS config
│       │   ├── controller/    # REST API controllers
│       │   ├── dto/           # Data Transfer Objects
│       │   ├── model/         # MongoDB models
│       │   ├── repository/    # MongoDB repositories
│       │   ├── service/       # Business logic
│       │   └── util/          # JWT utilities
│       ├── src/main/resources/
│       │   └── application.properties
│       └── pom.xml
│
├── flask-ai-service/          # Python AI Microservice
│   ├── app.py                 # Flask application
│   ├── routes/
│   │   ├── crime_routes.py    # Crime prediction endpoints
│   │   ├── legal_routes.py    # Legal advice + chatbot
│   │   └── fir_routes.py      # FIR generation
│   ├── services/
│   │   └── train_model.py     # ML model training script
│   ├── models/
│   │   └── crime_classifier.pkl  # Trained model
│   └── dataset/
│       └── CrimeVsNoCrimeArticles.csv
│
└── legal-ai-frontend/         # React Frontend
    ├── src/
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Home.jsx
    │   │   ├── FileComplaint.jsx
    │   │   ├── MyComplaints.jsx
    │   │   ├── OfficerPanel.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Chatbot.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Helplines.jsx
    │   │   └── EvidenceUpload.jsx
    │   ├── LanguageContext.jsx
    │   ├── App.jsx
    │   └── index.css
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Java 24
- Python 3.10+
- Node.js 18+
- MongoDB 8.3

### Step 1 — Start MongoDB
```bash
# Run as Administrator
"C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe" --dbpath C:\data\db
```

### Step 2 — Train AI Model (First time only)
```bash
cd flask-ai-service
pip install scikit-learn pandas numpy joblib flask
python services/train_model.py
```

### Step 3 — Start Flask AI Service
```bash
cd flask-ai-service
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac
python app.py
# Runs on http://localhost:5000
```

### Step 4 — Start Spring Boot Backend
```bash
cd legal-ai-backend/legal-ai-backend
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-24
mvnw.cmd spring-boot:run
# Runs on http://localhost:8080
```

### Step 5 — Start React Frontend
```bash
cd legal-ai-frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Step 6 — Open Browser
```
http://localhost:5173
```

---

## 📡 API Reference

### Auth Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/profile | Get user profile |
| PUT | /api/auth/profile | Update profile |

### Complaint Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/complaints | File new complaint |
| GET | /api/complaints | Get user complaints |
| GET | /api/complaints/my-assigned | Get officer complaints |
| GET | /api/complaints/all | Get all complaints (Admin) |
| PUT | /api/complaints/{id}/status | Update complaint status |

### AI Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/ai/predict | Crime prediction |
| POST | /api/ai/predict/batch | Batch prediction |
| POST | /api/ai/legal-advice | Get legal advice |
| GET | /api/ai/legal-advice/all | All crime sections |
| POST | /api/ai/generate-fir | Generate FIR draft |
| POST | /ai/chat | Legal AI chatbot |

### FIR Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/fir/complaint/{id} | Get FIR by complaint |
| GET | /api/fir/all | Get all FIRs |

### Evidence Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/evidence/upload | Upload evidence file |
| GET | /api/evidence/complaint/{id} | Get evidence list |
| GET | /api/evidence/download/{id} | Download evidence |

### Helpline Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/helplines | Get all helplines |
| GET | /api/helplines/{crimeType} | Get helpline by type |

### Admin Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/admin/stats | Dashboard statistics |
| GET | /api/admin/users | Get all users |
| PUT | /api/admin/users/{id}/role | Update user role |
| POST | /api/admin/assign | Assign officer |

---

## 👥 User Roles

| Role | Permissions |
|------|------------|
| USER | File complaints, view own complaints, upload evidence, use chatbot |
| OFFICER | View assigned complaints, update complaint status |
| ADMIN | All USER + OFFICER permissions + dashboard + user management |

### Default Test Accounts
```
Admin  : priya2@test.com   / password123
Officer: officer@test.com  / officer123
User   : s@gmail.com       / (your password)
```

---

## 🗄️ Database Collections

| Collection | Description |
|-----------|-------------|
| users | User accounts with roles |
| complaints | Filed complaints with timeline |
| fir_drafts | AI-generated FIR drafts |
| crimeTypes | Crime type definitions |
| helplines | Emergency helpline numbers |
| evidence | Uploaded evidence metadata |

---

## 🔐 Security

- **JWT Authentication** — Stateless token-based auth
- **BCrypt Password Hashing** — Secure password storage
- **Role-Based Access Control** — USER / OFFICER / ADMIN
- **CORS Configuration** — Controlled cross-origin requests
- **Spring Security** — API endpoint protection

---

## 🌐 Multilingual Support

- 🇬🇧 English
- 🇮🇳 Hindi (हिंदी)

Switch using the language toggle button in the navbar.

---

## 📞 Emergency Helplines Included

| Service | Number |
|---------|--------|
| Police | 100 |
| Ambulance | 108 |
| Fire Brigade | 101 |
| National Emergency | 112 |
| Women Helpline | 1091 |
| Cyber Crime | 1930 |
| Legal Aid | 15100 |
| Childline | 1098 |

---

## 👩‍💻 Developer

**Project:** AI-Powered Legal Assistance & Crime Reporting System  
**Tech Stack:** Spring Boot + MongoDB + Python Flask + React  
**AI Model:** TF-IDF + Logistic Regression (88.56% accuracy)

---

## 📄 License

This project is built for educational and interview purposes.
