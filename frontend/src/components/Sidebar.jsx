import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  ShieldCheck,
  AlertTriangle,
  User,
  LogOut,
  HelpCircle,
  Building,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose}></div>}

      <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
        {/* BRAND */}
        <div className="sidebar-brand">
          <div className="brand-logo-icon">
            <Building size={22} className="text-white" />
          </div>
          <div className="brand-text">
            <h2>SettleSense AI</h2>
            <p>Reconciliation Platform</p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <ArrowLeftRight size={18} />
            <span>Transactions</span>
          </NavLink>

          <NavLink
            to="/reconciliation"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <ShieldCheck size={18} />
            <span>Reconciliation</span>
          </NavLink>

          <NavLink
            to="/exceptions"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <AlertTriangle size={18} />
            <span>Exceptions</span>
            <span className="nav-badge-pill">Alerts</span>
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
            onClick={onClose}
          >
            <User size={18} />
            <span>Profile</span>
          </NavLink>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="sidebar-footer">
          <div className="sidebar-help-card">
            <div className="help-icon-title">
              <HelpCircle size={16} />
              <strong>Settlement Ops</strong>
            </div>
            <p>Automated 3-way match across Gateway, Bank & Ledger.</p>
          </div>

          <button className="btn-sidebar-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
