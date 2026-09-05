import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import ConfidenceBadge from "../components/ConfidenceBadge";
import TransactionModal from "../components/TransactionModal";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getExceptions, RECONCILIATION_STATS } from "../api/api";

export default function Exceptions() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ALL");
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTxId, setSelectedTxId] = useState(null);
  const [selectedTxData, setSelectedTxData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getExceptions({ page: 1, pageSize: 22, type: activeTab })
      .then((res) => {
        if (isMounted) {
          setExceptions(res.exceptions || []);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching exceptions:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="dashboard-container">
          {/* HEADER ROW */}
          <div className="page-header-row">
            <div>
              <span className="panel-sub-label">ANOMALY RESOLUTION</span>
              <h2>Exceptions Management Queue</h2>
              <p className="page-header-caption">
                Investigate and resolve transactions with reconciliation mismatches, missing records, or clearance delays
              </p>
            </div>

            <div className="page-header-actions">
              <span className="badge-inventory-count badge-alert-count">
                <AlertTriangle size={14} /> Total Exceptions: {RECONCILIATION_STATS.exceptions.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* EXCEPTION KPI SUMMARY CARDS */}
          <section className="kpi-grid mb-6">
            <div className="kpi-card kpi-red">
              <div className="kpi-top">
                <span className="kpi-title">Failed Transactions</span>
                <div className="kpi-icon-wrap kpi-icon-red">
                  <XCircle size={18} />
                </div>
              </div>
              <div className="kpi-value">{RECONCILIATION_STATS.failed.toLocaleString("en-IN")}</div>
              <div className="kpi-bottom">
                <span className="kpi-trend">Gateway Level</span>
                <span className="kpi-subtitle">Rejected payment status</span>
              </div>
            </div>

            <div className="kpi-card kpi-purple">
              <div className="kpi-top">
                <span className="kpi-title">Reversals & Chargebacks</span>
                <div className="kpi-icon-wrap kpi-icon-purple">
                  <RotateCcw size={18} />
                </div>
              </div>
              <div className="kpi-value">{RECONCILIATION_STATS.reversed.toLocaleString("en-IN")}</div>
              <div className="kpi-bottom">
                <span className="kpi-trend">Reversal Initiated</span>
                <span className="kpi-subtitle">Customer or acquirer dispute</span>
              </div>
            </div>

            <div className="kpi-card kpi-amber">
              <div className="kpi-top">
                <span className="kpi-title">Pending Clearance</span>
                <div className="kpi-icon-wrap kpi-icon-amber">
                  <Clock size={18} />
                </div>
              </div>
              <div className="kpi-value">{RECONCILIATION_STATS.pending.toLocaleString("en-IN")}</div>
              <div className="kpi-bottom">
                <span className="kpi-trend">Bank Clearing Window</span>
                <span className="kpi-subtitle">Awaiting settlement file</span>
              </div>
            </div>

            <div className="kpi-card kpi-blue">
              <div className="kpi-top">
                <span className="kpi-title">System Resolution Status</span>
                <div className="kpi-icon-wrap kpi-icon-blue">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="kpi-value">Auto-Flagged</div>
              <div className="kpi-bottom">
                <span className="kpi-trend">100% Monitored</span>
                <span className="kpi-subtitle">Diagnostic trace enabled</span>
              </div>
            </div>
          </section>

          {/* EXCEPTION FILTER TABS */}
          <div className="exceptions-nav-tabs">
            <button
              className={`tab-btn ${activeTab === "ALL" ? "active" : ""}`}
              onClick={() => setActiveTab("ALL")}
            >
              All Exceptions
            </button>
            <button
              className={`tab-btn ${activeTab === "GATEWAY_FAILED" ? "active" : ""}`}
              onClick={() => setActiveTab("GATEWAY_FAILED")}
            >
              Gateway Failed
            </button>
            <button
              className={`tab-btn ${activeTab === "BANK_MISSING" ? "active" : ""}`}
              onClick={() => setActiveTab("BANK_MISSING")}
            >
              Missing Bank Settlement
            </button>
            <button
              className={`tab-btn ${activeTab === "LEDGER_MISSING" ? "active" : ""}`}
              onClick={() => setActiveTab("LEDGER_MISSING")}
            >
              Missing Ledger Record
            </button>
            <button
              className={`tab-btn ${activeTab === "AMOUNT_MISMATCH" ? "active" : ""}`}
              onClick={() => setActiveTab("AMOUNT_MISMATCH")}
            >
              Amount Mismatch
            </button>
            <button
              className={`tab-btn ${activeTab === "REVERSED" ? "active" : ""}`}
              onClick={() => setActiveTab("REVERSED")}
            >
              Reversed
            </button>
            <button
              className={`tab-btn ${activeTab === "PENDING" ? "active" : ""}`}
              onClick={() => setActiveTab("PENDING")}
            >
              Pending
            </button>
          </div>

          {/* EXCEPTIONS TABLE */}
          <section className="panel-card">
            <div className="panel-card-header">
              <div>
                <span className="panel-sub-label">ANOMALIES AUDIT LIST</span>
                <h3>Discrepancy Records</h3>
              </div>
              <span className="badge-audit">Live Backend Diagnostics</span>
            </div>

            <div className="panel-card-body table-responsive">
              {loading ? (
                <LoadingSkeleton rows={8} />
              ) : exceptions.length === 0 ? (
                <div className="empty-state-box">
                  <CheckCircle2 size={36} className="text-success" />
                  <h4>No exceptions in this category</h4>
                  <p>All filtered records in this queue have been reconciled or are balanced.</p>
                </div>
              ) : (
                <table className="banking-table">
                  <thead>
                    <tr>
                      <th>Transaction Reference</th>
                      <th>Amount</th>
                      <th>Settlement Date</th>
                      <th>Recon Status</th>
                      <th>Reason / Discrepancy Flag</th>
                      <th>Confidence</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exceptions.map((item) => (
                      <tr key={item.transaction_id} className="table-hover-row">
                        <td>
                          <div className="tx-id-badge">
                            <span className="tx-id-code">{item.transaction_id}</span>
                            <span className="tx-id-sub">System ID</span>
                          </div>
                        </td>
                        <td>
                          <div className="amount-cell">
                            <strong>
                              ₹
                              {Number(item.amount || 0).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </strong>
                          </div>
                        </td>
                        <td>
                          <span className="date-cell">{item.transaction_date || "-"}</span>
                        </td>
                        <td>
                          <StatusBadge status={item.status} />
                        </td>
                        <td>
                          <div className="exception-reason-cell">
                            <AlertTriangle size={14} className="text-danger flex-shrink-0" />
                            <span>
                              {item.exceptionReason ||
                                (item.exceptions && item.exceptions[0]) ||
                                "Reconciliation discrepancy detected"}
                            </span>
                          </div>
                        </td>
                        <td>
                          <ConfidenceBadge confidence={item.confidence} />
                        </td>
                        <td className="text-right">
                          <button
                            className="btn-table-action"
                            onClick={() => {
                              setSelectedTxId(item.transaction_id);
                              setSelectedTxData(item);
                            }}
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
