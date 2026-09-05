# SettleSense AI

> **AI-Powered 3-Way Transaction Reconciliation & Settlement Intelligence Platform**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.141.1-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB.svg?style=flat&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.2.2-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.18.0-47A248.svg?style=flat&logo=mongodb)](https://www.mongodb.com)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB.svg?style=flat&logo=python)](https://www.python.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📌 Overview

**SettleSense AI** is a production-grade banking and fintech operations platform built to solve the high-volume transaction reconciliation challenge across Indian commercial banking networks.

In modern financial operations, payments touch three separate, asynchronous systems:
1. **Payment Gateways** (Razorpay, PayU, PhonePe) — Real-time customer payment authorization ($T$)
2. **Partner Clearing Banks** (RBI NEFT, RTGS, IMPS, UPI) — Interbank clearing and settlement window ($T+1$)
3. **General Ledger ERPs** (SAP, Oracle Financials) — Internal accounting credit/debit records

Because these systems operate on differing protocols and batch cadences, traditional banks experience substantial settlement latency (3–5 business days), manual spreadsheet bottlenecks, and severe financial leakage. **SettleSense AI** automates 3-way triangulation, detects discrepancies in real time, and provides an institutional-grade control center.

---

## 👥 Project Team

* **ARGHAJIT SAHA** — *System Architecture & Full-Stack Integration*
* **AMRIT RAJ RAI** — *Backend & Data Engineering*
* **ARJUN TIWARI** — *Reconciliation Logic & Validation*

---

## 🚀 Key Features

* **Automated 3-Way Reconciliation Pipeline:**  
  Harmonizes records across Payment Gateway, Partner Bank, and General Ledger with automated status and confidence assignment (`HIGH`, `MEDIUM`, `LOW`).

* **High-Throughput Scalability (550,000 Records):**  
  Ingests and queries a complete 550,000-record Kaggle Indian Banking transactions dataset with sub-50ms API lookups.

* **Smart 22-Record Pagination:**  
  Enterprise transaction management hub rendering 22 transactions per page with dynamic total tracking (*"Showing X–Y of 550,000 transactions"*).

* **Automated Exception Root-Cause Diagnostics:**  
  Identifies missing gateway records, un-cleared bank settlements, ledger journal posting omissions, amount mismatches, and customer chargebacks.

* **Interactive 3-System Audit Inspector:**  
  Enables operators to query any transaction ID (e.g. `TXN000000001`) and inspect Gateway, Bank, and Ledger values side-by-side.

* **Institutional Banking Security:**  
  Enterprise authentication featuring PBKDF2/SHA-256 cryptographic password hashing, unique MongoDB indexing, and HS256 JWT bearer token protection with automatic 401 session expiry handling.

* **Modern Indian Banking UI/UX:**  
  Clean cards, deep navy primary color (`#0A2540`, `#075FBD`), subtle elevation, responsive grid layouts, and Lucide financial iconography.

---

## 📊 Dataset & Ground Truth Distribution

The platform reconciles a real-world **550,000 Kaggle Indian Banking Transactions Dataset** across three generated reconciliation views:

| View Name | File | Records | Key Tracked Fields |
| :--- | :--- | :--- | :--- |
| **Payment Gateway** | `gateway.csv` | **550,000** | `transaction_id`, `amount`, `payment_status`, `payment_date`, `payment_method`, `gateway_reference` |
| **Partner Bank** | `bank.csv` | **550,000** | `transaction_id`, `amount`, `settlement_status`, `settlement_date` ($T+1$), `bank_reference` |
| **Internal Ledger**| `ledger.csv` | **550,000** | `transaction_id`, `amount`, `ledger_status`, `entry_date`, `ledger_reference` |

### Reconciliation Breakdown:
* **Successful (3-Way Matched):** `506,247` transactions (**92.05%**)
* **Failed (Gateway Rejected):** `21,905` transactions (**3.98%**)
* **Reversed (Chargebacks/Disputes):** `11,019` transactions (**2.00%**)
* **Pending (In-Flight Bank Clearance):** `10,829` transactions (**1.97%**)

---

## 🛠️ System Architecture

```
settlesense-ai/
├── backend/
│   ├── main.py                          # FastAPI ASGI application & route controllers
│   ├── auth/
│   │   ├── auth_models.py               # Pydantic schemas (Signup, Login, ForgotPassword)
│   │   └── auth_service.py              # MongoDB connection, PBKDF2 hashing, JWT service
│   ├── models/
│   │   └── transaction_models.py        # TransactionResponse & Reconciliation schemas
│   ├── services/
│   │   └── transaction_service.py       # Pandas 3-way triangulation & confidence engine
│   └── data/
│       ├── indian_banking_transactions.csv  # Kaggle source dataset (550,000 rows)
│       ├── gateway.csv                  # Gateway reconciliation view
│       ├── bank.csv                     # Bank settlement view
│       └── ledger.csv                   # Ledger accounting view
└── frontend/
    ├── src/
    │   ├── api/api.js                   # Centralized Axios client with JWT interceptor
    │   ├── context/AuthContext.jsx      # Global auth state & persistent session store
    │   ├── components/                  # Sidebar, Header, StatCard, StatusBadge, etc.
    │   ├── pages/                       # Login, Signup, ForgotPassword, Dashboard, etc.
    │   ├── App.jsx                      # React Router 7 protected route hierarchy
    │   └── App.css                      # Modern institutional banking design system
    ├── vite.config.js                   # Vite dev server with /api reverse proxy
    └── package.json
```

---

## ⚙️ Installation & Running Locally

### Prerequisites
* **Python 3.10+** (Python 3.13 recommended)
* **Node.js 18+** & **npm**
* **MongoDB** (running locally on `mongodb://localhost:27017`)

---

### Step 1: Run the Backend (FastAPI)

```powershell
# Open terminal in project root
cd backend
..\venv\Scripts\uvicorn.exe main:app --host 127.0.0.1 --port 8000
```

* **API Root:** `http://127.0.0.1:8000`
* **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`

---

### Step 2: Run the Frontend (React + Vite)

```powershell
# Open a second terminal
cd frontend
npm install    # (if running for the first time)
npm run dev
```

* **Web Application:** `http://127.0.0.1:5173`

---

### Step 3: Build for Production

```powershell
cd frontend
npm run build
```

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register new settlement analyst (`name`, `email`, `password`, `customer_id`) |
| `POST` | `/api/auth/login` | Authenticate user & issue HS256 JWT access token |
| `POST` | `/api/auth/forgot-password` | Generate cryptographic password reset token |
| `POST` | `/api/auth/reset-password` | Update account password using verified token |
| `GET` | `/api/transaction/{id}` | Real-time 3-way reconciliation data for specified transaction ID |

---

## 📜 Presentation & Documentation

* **PowerPoint Presentation Deck:** [`SettleSense_AI_Presentation.pptx`](./SettleSense_AI_Presentation.pptx) (10 widescreen 16:9 slides)
* **Slide Notes & Walkthrough:** [`.gemini/walkthrough.md`](.gemini/walkthrough.md)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
