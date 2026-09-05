import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name || !email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    const res = await signup({
      name,
      email,
      password,
      customer_id: customerId.trim() || undefined,
    });

    if (res.success) {
      setSuccessMsg("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } else {
      setErrorMsg(res.error || "Unable to create account. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT HERO / BRANDING PANEL */}
      <div className="auth-brand-panel">
        <div className="auth-brand-top">
          <div className="brand-badge-pill">
            <ShieldCheck size={15} />
            <span>OPERATOR ONBOARDING</span>
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
              Join India's leading transaction reconciliation platform.
            </h2>
            <p className="auth-hero-desc">
              Create your operator account to monitor 3-way reconciliation pipelines,
              investigate exceptions, and maintain audit trails across high-volume banking systems.
            </p>

            <div className="auth-highlights-grid">
              <div className="auth-highlight-item">
                <div className="highlight-icon-box">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong>Role-Based Security</strong>
                  <p>Enterprise JWT authorization with secure password hashing.</p>
                </div>
              </div>

              <div className="auth-highlight-item">
                <div className="highlight-icon-box">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <strong>Instant Dashboard Access</strong>
                  <p>Access live reconciliation statistics and transaction queries immediately.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-brand-footer">
          <span>© 2026 SettleSense AI • Institutional Settlement System</span>
          <span className="security-tag">
            <Lock size={12} /> 256-bit SSL / MongoDB Auth
          </span>
        </div>
      </div>

      {/* RIGHT SIGNUP CARD */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-card-header">
            <span className="auth-sub-title">NEW OPERATOR ENROLLMENT</span>
            <h2>Create an account</h2>
            <p>Enter your details to register as a settlement analyst.</p>
          </div>

          {errorMsg && (
            <div className="alert-banner alert-banner-danger">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="alert-banner alert-banner-success">
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="signup-name">Full Name *</label>
              <input
                id="signup-name"
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-email">Work Email *</label>
              <input
                id="signup-email"
                type="email"
                placeholder="priya.sharma@bank.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-password">Password (min 6 characters) *</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="signup-custid">Customer / Operator ID (Optional)</label>
              <input
                id="signup-custid"
                type="text"
                placeholder="e.g. CUST015796"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              />
              <span className="input-hint">Reference ID for banking audit trail logs</span>
            </div>

            <button type="submit" className="btn-primary-auth" disabled={loading}>
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-card-footer">
            <span>Already have an account?</span>{" "}
            <Link to="/login" className="auth-link-bold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
