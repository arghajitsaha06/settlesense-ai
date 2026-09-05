import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { forgotPasswordApi, resetPasswordApi } from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: Request token, 2: Reset password
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleRequestToken = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPasswordApi(email);
      setSuccessMsg(data.message || "Password reset token generated.");
      if (data.reset_token) {
        setResetToken(data.reset_token);
        // Automatically transition to reset password step with pre-filled token
        setStep(2);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail || "Unable to process password reset request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!resetToken || !newPassword) {
      setErrorMsg("Please provide both the reset token and your new password.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const data = await resetPasswordApi({
        email,
        reset_token: resetToken,
        new_password: newPassword,
      });
      setSuccessMsg(data.message || "Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.detail || "Invalid or expired reset token. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* LEFT HERO / BRANDING PANEL */}
      <div className="auth-brand-panel">
        <div className="auth-brand-top">
          <div className="brand-badge-pill">
            <KeyRound size={15} />
            <span>CREDENTIAL RECOVERY</span>
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
              Secure password recovery for banking personnel.
            </h2>
            <p className="auth-hero-desc">
              Multi-step token verification ensures strict access control to financial reconciliation records.
            </p>
          </div>
        </div>

        <div className="auth-brand-footer">
          <span>© 2026 SettleSense AI • Institutional Settlement System</span>
          <span className="security-tag">
            <ShieldCheck size={12} /> Cryptographic Token Validation
          </span>
        </div>
      </div>

      {/* RIGHT CARD */}
      <div className="auth-form-panel">
        <div className="auth-card">
          <Link to="/login" className="back-nav-link">
            <ArrowLeft size={16} />
            <span>Back to Login</span>
          </Link>

          <div className="auth-card-header">
            <span className="auth-sub-title">ACCOUNT SECURITY</span>
            <h2>{step === 1 ? "Reset your password" : "Enter new password"}</h2>
            <p>
              {step === 1
                ? "Enter your email address to generate a secure reset token."
                : "Enter the reset token and your new password."}
            </p>
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

          {step === 1 ? (
            <form onSubmit={handleRequestToken} className="auth-form">
              <div className="form-group">
                <label htmlFor="forgot-email">Registered Email Address</label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="analyst@bank.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary-auth" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Generating Token...</span>
                  </>
                ) : (
                  <>
                    <span>Generate Reset Token</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="reset-token">Password Reset Token</label>
                <input
                  id="reset-token"
                  type="text"
                  placeholder="Token string"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                />
                <span className="input-hint">Generated by the SettleSense authentication service</span>
              </div>

              <div className="form-group">
                <label htmlFor="reset-new-password">New Password (min 6 chars)</label>
                <input
                  id="reset-new-password"
                  type="password"
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <button type="submit" className="btn-primary-auth" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <span>Save New Password</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button
                type="button"
                className="btn-link-secondary"
                onClick={() => setStep(1)}
              >
                Use different email
              </button>
            </form>
          )}

          <div className="auth-card-footer">
            <span>Remembered your password?</span>{" "}
            <Link to="/login" className="auth-link-bold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
