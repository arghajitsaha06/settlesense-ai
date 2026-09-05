import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please provide both email and password.");
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.error || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT HERO / BRANDING PANEL */}
      <div className="auth-brand-panel">
        <div className="auth-brand-top">
          <div className="brand-badge-pill">
            <ShieldCheck size={15} />
            <span>FINTECH SETTLEMENT INTELLIGENCE</span>
          </div>

          <div className="auth-brand-hero">
            <div className="auth-logo-row">
              <div className="auth-logo-icon">
                <Building2 size={28} className="text-white" />
              </div>
              <div>
                <h1>SettleSense AI</h1>
                <p className="auth-logo-tagline">AI-Powered Transaction Reconciliation</p>
              </div>
            </div>

            <h2 className="auth-hero-heading">
              Intelligent 3-way reconciliation for modern banking operations.
            </h2>
            <p className="auth-hero-desc">
              Reconcile Gateway, Core Banking, and General Ledger records in real-time.
              Detect mismatches, missing settlements, and exceptions with AI-driven confidence scoring.
            </p>

            <div className="auth-highlights-grid">
              <div className="auth-highlight-item">
                <div className="highlight-icon-box">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong>Automated 3-Way Matching</strong>
                  <p>Harmonizes Gateway (T), Bank Settlement (T+1), and Ledger entries.</p>
                </div>
              </div>

              <div className="auth-highlight-item">
                <div className="highlight-icon-box">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong>550,000+ Scalable Architecture</strong>
                  <p>Handles high-volume Indian banking transactions seamlessly.</p>
                </div>
              </div>

              <div className="auth-highlight-item">
                <div className="highlight-icon-box">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong>Automated Exception Diagnostics</strong>
                  <p>Flags missing records, clearing delays, and amount anomalies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-brand-footer">
          <span>© 2026 SettleSense AI • Institutional Settlement System</span>
          <span className="security-tag">
            <Lock size={12} /> 256-bit SSL / JWT Authenticated
          </span>
        </div>
      </div>

      {/* RIGHT LOGIN CARD */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <span className="auth-sub-title">SECURE OPERATOR ACCESS</span>
            <h2>Welcome back</h2>
            <p>Enter your credentials to access the reconciliation console.</p>
          </div>

          {errorMsg && (
            <div className="alert-banner alert-banner-danger">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email">Official Email Address</label>
              <input
                id="login-email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div className="label-with-link">
                <label htmlFor="login-password">Password</label>
                <Link to="/forgot-password" className="text-link-sm">
                  Forgot password?
                </Link>
              </div>
              <input
                id="login-password"
                type="password"
                placeholder="Enter your secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary-auth" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-security-callout">
            <ShieldCheck size={18} className="text-primary" />
            <div>
              <strong>Secure Banking Infrastructure</strong>
              <p>All operations are logged and monitored under RBI compliance guidelines.</p>
            </div>
          </div>

          <div className="auth-card-footer">
            <span>New settlement analyst?</span>{" "}
            <Link to="/signup" className="auth-link-bold">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
