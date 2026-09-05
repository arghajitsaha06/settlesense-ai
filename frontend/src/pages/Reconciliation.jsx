import { useState } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Server,
  Building2,
  BookOpen,
  Search,
  RotateCcw,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ReconciliationFlow from "../components/ReconciliationFlow";
import TransactionModal from "../components/TransactionModal";
import StatusBadge from "../components/StatusBadge";
import ConfidenceBadge from "../components/ConfidenceBadge";
import { RECONCILIATION_STATS, getTransaction } from "../api/api";

export default function Reconciliation() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inspectInput, setInspectInput] = useState("");
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectResult, setInspectResult] = useState(null);
  const [inspectError, setInspectError] = useState(null);
  const [selectedTxId, setSelectedTxId] = useState(null);

  const handleInspectSubmit = async (e) => {
    e?.preventDefault();
    if (!inspectInput.trim()) return;

    const query = inspectInput.trim().toUpperCase();
    const formattedId = query.startsWith("TXN")
      ? query
      : `TXN${query.padStart(9, "0")}`;

    setInspectLoading(true);
    setInspectError(null);
    setInspectResult(null);

    try {
      const data = await getTransaction(formattedId);
      setInspectResult(data);
    } catch (err) {
      setInspectError(
        err.response?.data?.detail || "Transaction not found in backend reconciliation store."
      );
    } finally {
      setInspectLoading(false);
    }
  };

  const handleQuickSample = (sampleId) => {
    setInspectInput(sampleId);
    setInspectLoading(true);
    setInspectError(null);
    setInspectResult(null);

    getTransaction(sampleId)
      .then((res) => {
        setInspectResult(res);
        setInspectLoading(false);
      })
      .catch((err) => {
        setInspectError(err.response?.data?.detail || "Unable to fetch sample.");
        setInspectLoading(false);
      });
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="dashboard-container">
          {/* HEADER */}
          <div className="page-header-row">
            <div>
              <span className="panel-sub-label">PIPELINE VERIFICATION</span>
              <h2>Reconciliation Management</h2>
              <p className="page-header-caption">
                Multi-layer transaction reconciliation across Payment Gateway, Partner Bank, and General Ledger
              </p>
            </div>

            <div className="page-header-actions">
              <span className="badge-inventory-count">
                Batch: 550,000 Transactions Reconciled
              </span>
            </div>
          </div>

          {/* OVERALL RECONCILIATION FLOW */}
          <section className="panel-card mb-6">
            <div className="panel-card-header">
              <div>
                <span className="panel-sub-label">ARCHITECTURE AUDIT</span>
                <h3>Active 3-System Reconciliation Pipeline</h3>
              </div>
              <span className="live-pill">
                <span className="live-dot"></span> Pipeline Active
              </span>
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

          {/* HEALTH BREAKDOWN CARDS */}
          <section className="kpi-grid mb-6">
            <div className="kpi-card kpi-green">
              <div className="kpi-top">
                <span className="kpi-title">Successful Reconciliations</span>
                <div className="kpi-icon-wrap kpi-icon-green">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <div className="kpi-value">{RECONCILIATION_STATS.successful.toLocaleString("en-IN")}</div>
              <div className="kpi-bottom">
                <span className="kpi-trend">92.05% Rate</span>
                <span className="kpi-subtitle">All 3 systems balanced</span>
              </div>
            </div>

            <div className="kpi-card kpi-amber">
              <div className="kpi-top">
                <span className="kpi-title">Pending Settlements</span>
                <div className="kpi-icon-wrap kpi-icon-amber">
                  <Clock size={18} />
                </div>
              </div>
              <div className="kpi-value">{RECONCILIATION_STATS.pending.toLocaleString("en-IN")}</div>
              <div className="kpi-bottom">
                <span className="kpi-trend">1.97% Rate</span>
                <span className="kpi-subtitle">Awaiting bank clearing</span>
              </div>
            </div>

            <div className="kpi-card kpi-red">
              <div className="kpi-top">
                <span className="kpi-title">Failed Transactions</span>
                <div className="kpi-icon-wrap kpi-icon-red">
                  <XCircle size={18} />
                </div>
              </div>
              <div className="kpi-value">{RECONCILIATION_STATS.failed.toLocaleString("en-IN")}</div>
              <div className="kpi-bottom">
                <span className="kpi-trend">3.98% Rate</span>
                <span className="kpi-subtitle">Gateway failure recorded</span>
              </div>
            </div>

            <div className="kpi-card kpi-purple">
              <div className="kpi-top">
                <span className="kpi-title">Reversed / Chargebacks</span>
                <div className="kpi-icon-wrap kpi-icon-purple">
                  <RotateCcw size={18} />
                </div>
              </div>
              <div className="kpi-value">{RECONCILIATION_STATS.reversed.toLocaleString("en-IN")}</div>
              <div className="kpi-bottom">
                <span className="kpi-trend">2.00% Rate</span>
                <span className="kpi-subtitle">Customer reversal logged</span>
              </div>
            </div>
          </section>

          {/* INTERACTIVE TRANSACTION RECONCILIATION INSPECTOR */}
          <section className="panel-card mb-6">
            <div className="panel-card-header">
              <div>
                <span className="panel-sub-label">INTERACTIVE RECONCILIATION TOOL</span>
                <h3>Live 3-System Audit Inspector</h3>
                <p className="panel-caption">
                  Query any transaction ID directly from the live backend database to view 3-way balance
                </p>
              </div>
            </div>

            <div className="panel-card-body">
              <form onSubmit={handleInspectSubmit} className="inspector-search-row">
                <div className="search-input-group flex-1">
                  <Search size={16} className="search-group-icon" />
                  <input
                    type="text"
                    placeholder="Enter Transaction ID (e.g. TXN000000001, TXN000000002)..."
                    value={inspectInput}
                    onChange={(e) => setInspectInput(e.target.value)}
                    className="input-filter-search"
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={inspectLoading}>
                  {inspectLoading ? "Inspecting..." : "Inspect Reconciliation"}
                </button>
              </form>

              <div className="quick-sample-tags">
                <span className="tag-label">Try sample transactions:</span>
                <button
                  type="button"
                  className="btn-sample-tag"
                  onClick={() => handleQuickSample("TXN000000001")}
                >
                  TXN000000001 (Success)
                </button>
                <button
                  type="button"
                  className="btn-sample-tag"
                  onClick={() => handleQuickSample("TXN000000002")}
                >
                  TXN000000002 (Success)
                </button>
                <button
                  type="button"
                  className="btn-sample-tag"
                  onClick={() => handleQuickSample("TXN000000003")}
                >
                  TXN000000003 (POS)
                </button>
              </div>

              {/* INSPECTOR RESULT CARD */}
              {inspectLoading && (
                <div className="inspector-loading">
                  <div className="spinner"></div>
                  <p>Querying backend reconciliation service...</p>
                </div>
              )}

              {inspectError && (
                <div className="alert-banner alert-banner-danger mt-4">
                  <AlertTriangle size={18} />
                  <span>{inspectError}</span>
                </div>
              )}

              {inspectResult && !inspectLoading && (
                <div className="live-inspect-result-wrap">
                  <div className="result-banner">
                    <div>
                      <span className="result-id">Transaction {inspectResult.transaction_id}</span>
                      <h4>
                        ₹
                        {Number(inspectResult.amount || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        • {inspectResult.transaction_type || "UPI"}
                      </h4>
                    </div>

                    <div className="result-badges">
                      <StatusBadge status={inspectResult.status} />
                      <ConfidenceBadge confidence={inspectResult.confidence} />
                      <button
                        className="btn-link-action ml-3"
                        onClick={() => setSelectedTxId(inspectResult.transaction_id)}
                      >
                        Full Audit Modal →
                      </button>
                    </div>
                  </div>

                  {/* 3 SYSTEM COMPARISON CARDS */}
                  <div className="inspect-cards-grid">
                    {/* GATEWAY */}
                    <div className="system-inspect-card">
                      <div className="system-inspect-top">
                        <Server size={18} className="text-primary" />
                        <h5>Gateway Layer</h5>
                      </div>
                      {inspectResult.gateway ? (
                        <div className="system-keyvals">
                          <div>
                            <span>Status:</span>
                            <strong className="text-success font-semibold">
                              {inspectResult.gateway.payment_status}
                            </strong>
                          </div>
                          <div>
                            <span>Amount:</span>
                            <strong>
                              ₹{Number(inspectResult.gateway.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </strong>
                          </div>
                          <div>
                            <span>Date:</span>
                            <strong>{inspectResult.gateway.payment_date}</strong>
                          </div>
                          <div>
                            <span>Method:</span>
                            <strong>{inspectResult.gateway.payment_method}</strong>
                          </div>
                          <div>
                            <span>Ref:</span>
                            <code className="text-xs">{inspectResult.gateway.gateway_reference}</code>
                          </div>
                        </div>
                      ) : (
                        <p className="text-danger">Record Missing</p>
                      )}
                    </div>

                    {/* BANK */}
                    <div className="system-inspect-card">
                      <div className="system-inspect-top">
                        <Building2 size={18} className="text-primary" />
                        <h5>Partner Bank Layer</h5>
                      </div>
                      {inspectResult.bank ? (
                        <div className="system-keyvals">
                          <div>
                            <span>Status:</span>
                            <strong className="text-success font-semibold">
                              {inspectResult.bank.settlement_status}
                            </strong>
                          </div>
                          <div>
                            <span>Amount:</span>
                            <strong>
                              ₹{Number(inspectResult.bank.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </strong>
                          </div>
                          <div>
                            <span>Date:</span>
                            <strong>{inspectResult.bank.settlement_date}</strong>
                          </div>
                          <div>
                            <span>Ref:</span>
                            <code className="text-xs">{inspectResult.bank.bank_reference}</code>
                          </div>
                        </div>
                      ) : (
                        <p className="text-danger">Record Missing</p>
                      )}
                    </div>

                    {/* LEDGER */}
                    <div className="system-inspect-card">
                      <div className="system-inspect-top">
                        <BookOpen size={18} className="text-primary" />
                        <h5>Internal Ledger Layer</h5>
                      </div>
                      {inspectResult.ledger ? (
                        <div className="system-keyvals">
                          <div>
                            <span>Status:</span>
                            <strong className="text-success font-semibold">
                              {inspectResult.ledger.ledger_status}
                            </strong>
                          </div>
                          <div>
                            <span>Amount:</span>
                            <strong>
                              ₹{Number(inspectResult.ledger.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </strong>
                          </div>
                          <div>
                            <span>Date:</span>
                            <strong>{inspectResult.ledger.entry_date}</strong>
                          </div>
                          <div>
                            <span>Ref:</span>
                            <code className="text-xs">{inspectResult.ledger.ledger_reference}</code>
                          </div>
                        </div>
                      ) : (
                        <p className="text-danger">Record Missing</p>
                      )}
                    </div>
                  </div>

                  {/* EXCEPTIONS OR SUCCESS */}
                  {inspectResult.exceptions && inspectResult.exceptions.length > 0 ? (
                    <div className="mt-4 alert-banner alert-banner-danger">
                      <AlertTriangle size={18} />
                      <div>
                        <strong>Reconciliation Exceptions:</strong>
                        <ul className="list-disc pl-5 mt-1 text-xs">
                          {inspectResult.exceptions.map((ex, idx) => (
                            <li key={idx}>{ex}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 alert-banner alert-banner-success">
                      <CheckCircle2 size={18} />
                      <span>Reconciliation Verified: Gateway, Bank, and Ledger are perfectly aligned.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* CONFIDENCE & RECON METRICS */}
          <section className="panel-card">
            <div className="panel-card-header">
              <div>
                <span className="panel-sub-label">ANALYTICS BREAKDOWN</span>
                <h3>Confidence Level Distribution</h3>
              </div>
            </div>

            <div className="panel-card-body">
              <div className="confidence-distribution-grid">
                <div className="conf-bar-item">
                  <div className="conf-bar-header">
                    <span>High Confidence (100% 3-Way Match)</span>
                    <strong>506,247 (92.0%)</strong>
                  </div>
                  <div className="conf-progress-track">
                    <div className="conf-progress-fill fill-green" style={{ width: "92%" }}></div>
                  </div>
                  <span className="conf-sub-text">Zero discrepancies across all 3 databases.</span>
                </div>

                <div className="conf-bar-item">
                  <div className="conf-bar-header">
                    <span>Medium Confidence (Reconciliation Exceptions)</span>
                    <strong>32,924 (6.0%)</strong>
                  </div>
                  <div className="conf-progress-track">
                    <div className="conf-progress-fill fill-amber" style={{ width: "6%" }}></div>
                  </div>
                  <span className="conf-sub-text">Failed transactions or chargebacks detected.</span>
                </div>

                <div className="conf-bar-item">
                  <div className="conf-bar-header">
                    <span>Low Confidence / In-Flight Clearing</span>
                    <strong>10,829 (2.0%)</strong>
                  </div>
                  <div className="conf-progress-track">
                    <div className="conf-progress-fill fill-red" style={{ width: "2%" }}></div>
                  </div>
                  <span className="conf-sub-text">Pending settlement window clearance.</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      {selectedTxId && (
        <TransactionModal
          transactionId={selectedTxId}
          onClose={() => setSelectedTxId(null)}
        />
      )}
    </div>
  );
}
