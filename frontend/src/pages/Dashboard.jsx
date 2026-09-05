import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Eye,
  CreditCard,
  Sparkles,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import ConfidenceBadge from "../components/ConfidenceBadge";
import ReconciliationFlow from "../components/ReconciliationFlow";
import TransactionModal from "../components/TransactionModal";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { useAuth } from "../context/AuthContext";
import { getTransactions, RECONCILIATION_STATS } from "../api/api";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [selectedTxId, setSelectedTxId] = useState(null);
  const [selectedTxData, setSelectedTxData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoadingTransactions(true);
    getTransactions({ page: 1, pageSize: 8 })
      .then((res) => {
        if (isMounted) {
          setRecentTransactions(res.transactions || []);
          setLoadingTransactions(false);
        }
      })
      .catch((err) => {
        console.error("Dashboard failed to load transactions:", err);
        if (isMounted) setLoadingTransactions(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleInspectTransaction = (tx) => {
    setSelectedTxId(tx.transaction_id);
    setSelectedTxData(tx);
  };

  const handleHeaderSearch = (query) => {
    setSelectedTxId(query);
    setSelectedTxData(null);
  };

  // Determine greeting based on current time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN VIEW */}
      <div className="app-main-content">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onSearchTransaction={handleHeaderSearch}
        />

        <main className="dashboard-container">
          {/* WELCOME BANNER */}
          <section className="welcome-banner">
            <div className="welcome-text">
              <span className="welcome-badge">
                <Sparkles size={13} className="text-primary" /> REAL-TIME SETTLEMENT CONTROL
              </span>
              <h1>
                {greeting}, {user?.name ? user.name.split(" ")[0] : "Analyst"} 👋
              </h1>
              <p className="welcome-sub">
                Here's your transaction reconciliation overview across 550,000 Kaggle banking records.
              </p>
            </div>

            <div className="quick-action-pills">
              <button
                className="btn-quick-pill"
                onClick={() => navigate("/transactions")}
              >
                <span>Browse All Transactions</span>
                <ArrowRight size={14} />
              </button>
              <button
                className="btn-quick-pill outline"
                onClick={() => navigate("/reconciliation")}
              >
                <span>3-Way Reconciliation</span>
              </button>
              <button
                className="btn-quick-pill alert"
                onClick={() => navigate("/exceptions")}
              >
                <span>Exceptions Queue</span>
              </button>
            </div>
          </section>

          {/* KPI CARDS */}
          <section className="kpi-grid">
            <StatCard
              title="Total Transactions"
              value={RECONCILIATION_STATS.total.toLocaleString("en-IN")}
              subtitle="Full Kaggle Indian Banking Dataset"
              trend="↑ 100% indexed"
              icon={<TrendingUp size={20} />}
              type="blue"
            />

            <StatCard
              title="Successful Transactions"
              value={RECONCILIATION_STATS.successful.toLocaleString("en-IN")}
              subtitle="Gateway, Bank & Ledger matched"
              trend={RECONCILIATION_STATS.successRate}
              icon={<CheckCircle2 size={20} />}
              type="green"
            />

            <StatCard
              title="Pending Settlements"
              value={RECONCILIATION_STATS.pending.toLocaleString("en-IN")}
              subtitle="Awaiting partner bank clearance"
              trend="Requires Monitoring"
              icon={<Clock size={20} />}
              type="amber"
            />

            <StatCard
              title="Exceptions & Mismatches"
              value={RECONCILIATION_STATS.exceptions.toLocaleString("en-IN")}
              subtitle="21,905 Failed + 11,019 Reversed"
              trend="Needs Attention"
              icon={<AlertTriangle size={20} />}
              type="red"
            />
          </section>

          {/* RECONCILIATION HEALTH PIPELINE */}
          <section className="panel-card recon-health-panel">
            <div className="panel-card-header">
              <div>
                <span className="panel-sub-label">PIPELINE INTEGRITY</span>
                <h3>Reconciliation Health Architecture</h3>
                <p className="panel-caption">
                  Automated verification: Payment Gateway → Partner Bank Settlement → Internal General Ledger
                </p>
              </div>

              <div className="header-status-pill">
                <span className="live-pulse"></span>
                <span>All 3 Systems Synchronized</span>
              </div>
            </div>

            <div className="panel-card-body">
              <ReconciliationFlow
                gatewayStatus="Operational"
                bankStatus="Operational"
                ledgerStatus="Operational"
                gatewayMatch="99.8% matched"
                bankMatch="98.9% matched"
                ledgerMatch="99.5% matched"
              />
            </div>
          </section>

          {/* RECENT TRANSACTIONS TABLE */}
          <section className="panel-card">
            <div className="panel-card-header">
              <div>
                <span className="panel-sub-label">LIVE STREAM</span>
                <h3>Recent Settlement Transactions</h3>
                <p className="panel-caption">
                  Showing latest reconciled records with 3-system confirmation status
                </p>
              </div>

              <button
                className="btn-link-action"
                onClick={() => navigate("/transactions")}
              >
                <span>View all 550,000 transactions</span>
                <ArrowRight size={15} />
              </button>
            </div>

            <div className="panel-card-body table-responsive">
              {loadingTransactions ? (
                <LoadingSkeleton rows={6} />
              ) : recentTransactions.length === 0 ? (
                <div className="empty-state-box">
                  <p>No transaction records available.</p>
                </div>
              ) : (
                <table className="banking-table">
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>Amount</th>
                      <th>Payment Type</th>
                      <th>Settlement Date</th>
                      <th>Recon Status</th>
                      <th>AI Confidence</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((tx) => (
                      <tr key={tx.transaction_id} className="table-hover-row">
                        <td>
                          <div className="tx-id-badge">
                            <span className="tx-id-code">{tx.transaction_id}</span>
                            <span className="tx-id-sub">Verified Ref</span>
                          </div>
                        </td>
                        <td>
                          <div className="amount-cell">
                            <strong>
                              ₹
                              {Number(tx.amount || 0).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </strong>
                          </div>
                        </td>
                        <td>
                          <div className="type-badge-cell">
                            <CreditCard size={14} className="text-muted" />
                            <span>{tx.transaction_type || "UPI"}</span>
                          </div>
                        </td>
                        <td>
                          <span className="date-cell">{tx.transaction_date || "-"}</span>
                        </td>
                        <td>
                          <StatusBadge status={tx.status} />
                        </td>
                        <td>
                          <ConfidenceBadge confidence={tx.confidence} />
                        </td>
                        <td className="text-right">
                          <button
                            className="btn-table-action"
                            onClick={() => handleInspectTransaction(tx)}
                          >
                            <Eye size={14} />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* TRANSACTION DETAILS MODAL */}
      {selectedTxId && (
        <TransactionModal
          transactionId={selectedTxId}
          initialData={selectedTxData}
          onClose={() => {
            setSelectedTxId(null);
            setSelectedTxData(null);
          }}
        />
      )}
    </div>
  );
}
