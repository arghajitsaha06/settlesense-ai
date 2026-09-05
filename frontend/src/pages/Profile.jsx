import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  ShieldCheck,
  Key,
  Building,
  LogOut,
  CheckCircle2,
  Lock,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="dashboard-container">
          <div className="page-header-row">
            <div>
              <span className="panel-sub-label">OPERATOR PROFILE</span>
              <h2>Account & Credentials</h2>
              <p className="page-header-caption">
                Manage your authenticated session and institutional profile
              </p>
            </div>
          </div>

          <div className="profile-layout-grid">
            {/* USER PROFILE CARD */}
            <div className="panel-card profile-user-card">
              <div className="profile-hero-top">
                <div className="profile-avatar-large">{initials}</div>
                <div className="profile-titles">
                  <h3>{user?.name || "Settlement Analyst"}</h3>
                  <span className="profile-email-sub">{user?.email}</span>
                  <div className="profile-tier-badge">
                    <ShieldCheck size={14} />
                    <span>{user?.tier || "Institutional Banking"}</span>
                  </div>
                </div>
              </div>

              <div className="profile-info-list">
                <div className="profile-info-row">
                  <div className="info-row-left">
                    <User size={16} className="text-muted" />
                    <span>Full Name</span>
                  </div>
                  <strong>{user?.name || "N/A"}</strong>
                </div>

                <div className="profile-info-row">
                  <div className="info-row-left">
                    <Mail size={16} className="text-muted" />
                    <span>Email Address</span>
                  </div>
                  <strong>{user?.email || "N/A"}</strong>
                </div>

                <div className="profile-info-row">
                  <div className="info-row-left">
                    <Key size={16} className="text-muted" />
                    <span>Customer / Operator ID</span>
                  </div>
                  <strong className="mono">{user?.customer_id || "CUST015796"}</strong>
                </div>

                <div className="profile-info-row">
                  <div className="info-row-left">
                    <Building size={16} className="text-muted" />
                    <span>Institution</span>
                  </div>
                  <strong>SettleSense Banking Network</strong>
                </div>

                <div className="profile-info-row">
                  <div className="info-row-left">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Auth Provider</span>
                  </div>
                  <span className="badge-status badge-success">MongoDB Auth / JWT</span>
                </div>
              </div>

              <div className="profile-actions-bottom">
                <button className="btn-sidebar-logout w-full" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Sign out of SettleSense AI</span>
                </button>
              </div>
            </div>

            {/* SECURITY & SESSION CARD */}
            <div className="panel-card profile-security-card">
              <div className="panel-card-header">
                <div>
                  <span className="panel-sub-label">SESSION ENCRYPTION</span>
                  <h3>Security & Access Token</h3>
                </div>
                <span className="badge-audit">HS256 Verified</span>
              </div>

              <div className="panel-card-body">
                <div className="security-notice-box">
                  <Lock size={20} className="text-primary" />
                  <div>
                    <strong>Active JWT Session</strong>
                    <p>
                      Your authenticated token is validated on every API call to the FastAPI backend.
                      Sessions expire automatically after inactivity for banking security.
                    </p>
                  </div>
                </div>

                <div className="token-display-wrap mt-4">
                  <span className="token-label">Access Token (Masked):</span>
                  <code className="token-code-block">
                    {token
                      ? `${token.slice(0, 24)}••••••••••••••••••••••••••••••••••••${token.slice(-16)}`
                      : "No active token"}
                  </code>
                </div>

                <div className="security-checklist mt-6">
                  <h4>Security Specifications</h4>
                  <div className="checklist-item">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Password Hashing: PBKDF2 / SHA-256</span>
                  </div>
                  <div className="checklist-item">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Database: MongoDB with Unique Index Enforced</span>
                  </div>
                  <div className="checklist-item">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>Dataset: 550,000 Verified Kaggle Indian Banking Records</span>
                  </div>
                  <div className="checklist-item">
                    <CheckCircle2 size={16} className="text-success" />
                    <span>API Transport: RESTful JSON over FastAPI</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
