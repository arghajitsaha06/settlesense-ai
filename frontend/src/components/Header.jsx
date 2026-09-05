import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  LogOut,
  User,
  Menu,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header({ onMenuClick, onSearchTransaction }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const query = searchInput.trim().toUpperCase();
    if (onSearchTransaction) {
      onSearchTransaction(query);
    } else {
      navigate(`/transactions?search=${query}`);
    }
  };

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
    <header className="app-header">
      {/* MOBILE MENU TOGGLE */}
      <button className="btn-mobile-menu" onClick={onMenuClick}>
        <Menu size={20} />
      </button>

      {/* SEARCH BAR */}
      <form className="header-search-form" onSubmit={handleSearchSubmit}>
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search Transaction ID (e.g. TXN000000001)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="header-search-input"
        />
        <button type="submit" className="search-submit-btn">
          Find
        </button>
      </form>

      {/* HEADER RIGHT ACTIONS */}
      <div className="header-right-actions">
        {/* ENGINE STATUS BADGE */}
        <div className="system-status-indicator" title="FastAPI Reconciliation Engine is active">
          <span className="status-dot"></span>
          <span className="status-text">Recon Engine Online</span>
        </div>

        {/* NOTIFICATIONS DROPDOWN */}
        <div className="dropdown-wrapper">
          <button
            className="btn-header-icon"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={18} />
            <span className="notification-badge">3</span>
          </button>

          {showNotifications && (
            <div className="dropdown-menu notifications-menu">
              <div className="dropdown-header">
                <strong>Settlement Alerts</strong>
                <span className="badge-count">3 Unresolved</span>
              </div>
              <div className="notifications-list">
                <div className="notification-item">
                  <div className="notif-bullet warning"></div>
                  <div>
                    <p className="notif-msg">21,905 transactions marked FAILED</p>
                    <span className="notif-time">Gateway Layer</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notif-bullet info"></div>
                  <div>
                    <p className="notif-msg">10,829 transactions pending bank clearing</p>
                    <span className="notif-time">Partner Bank T+1</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notif-bullet alert"></div>
                  <div>
                    <p className="notif-msg">Amount mismatches detected in settlement batch</p>
                    <span className="notif-time">Exceptions Queue</span>
                  </div>
                </div>
              </div>
              <div className="dropdown-footer">
                <button
                  className="btn-dropdown-action"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate("/exceptions");
                  }}
                >
                  View All Exceptions →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* USER PROFILE PILL */}
        <div className="dropdown-wrapper">
          <button
            className="user-profile-pill"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="user-avatar-circle">{initials}</div>
            <div className="user-profile-meta">
              <span className="user-profile-name">{user?.name || "Banking User"}</span>
              <span className="user-profile-sub">
                {user?.customer_id ? `${user.customer_id}` : "Institutional"}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="dropdown-menu profile-menu">
              <div className="dropdown-header">
                <strong>{user?.name || "Verified User"}</strong>
                <span className="dropdown-user-email">{user?.email}</span>
              </div>
              <div className="profile-menu-links">
                <button
                  className="menu-link-btn"
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate("/profile");
                  }}
                >
                  <User size={15} />
                  <span>Account & Profile</span>
                </button>
                <button
                  className="menu-link-btn danger-link"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
