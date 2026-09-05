import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Server,
  Building2,
  BookOpen,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import ConfidenceBadge from "../components/ConfidenceBadge";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getTransaction } from "../api/api";

export default function TransactionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    setLoading(true);
    setError(null);

    getTransaction(id)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.response?.data?.detail || "Transaction not found on backend.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleCopyId = () => {
    if (data?.transaction_id) {
      navigator.clipboard.writeText(data.transaction_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main-content">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="dashboard-container">
          <div className="detail-page-nav-bar">
            <button className="btn-back-link" onClick={() => navigate("/transactions")}>
              <ArrowLeft size={16} />
              <span>Back to Transactions</span>
            </button>
          </div>

          {loading ? (
            <div className="panel-card p-6">
              <LoadingSkeleton rows={6} />
            </div>
          ) : error ? (
            <div className="panel-card error-card-wrap">
              <AlertTriangle size={42} className="text-danger" />
              <h3>Transaction Not Found</h3>
              <p>{error}</p>
              <button className="btn-primary" onClick={() => navigate("/transactions")}>
                Return to Transactions
              </button>
            </div>
          ) : data ? (
            <>
              {/* HEADER BANNER */}
              <div className="panel-card mb-6">
                <div className="panel-card-header">
                  <div>
                    <span className="panel-sub-label">RECONCILIATION AUDIT RECORD</span>
                    <h2>Transaction {data.transaction_id}</h2>
                  </div>

                  <div className="detail-actions">
                    <button className="btn-copy-id" onClick={handleCopyId}>
                      {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                      <span>{copied ? "Copied" : "Copy ID"}</span>
                    </button>
                    <StatusBadge status={data.status} />
                  </div>
                </div>

                <div className="panel-card-body">
                  <div className="tx-overview-card">
                    <div className="overview-metric">
                      <span className="overview-label">Transaction Amount</span>
                      <div className="overview-value amount-highlight">
                        ₹
                        {Number(data.amount || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>

                    <div className="overview-metric">
                      <span className="overview-label">Payment Method</span>
                      <div className="overview-value text-medium">
                        {data.transaction_type || data.gateway?.payment_method || "UPI"}
                      </div>
                    </div>

                    <div className="overview-metric">
                      <span className="overview-label">Transaction Date</span>
                      <div className="overview-value text-medium">
                        {data.transaction_date || data.gateway?.payment_date || "-"}
                      </div>
                    </div>

                    <div className="overview-metric">
                      <span className="overview-label">AI Confidence</span>
                      <div className="overview-value">
                        <ConfidenceBadge confidence={data.confidence} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-WAY BREAKDOWN */}
              <div className="panel-card mb-6">
                <div className="panel-card-header">
                  <div>
                    <span className="panel-sub-label">PIPELINE AUDIT</span>
                    <h3>Gateway → Bank → Ledger 3-Way Audit</h3>
                  </div>
                  <span className="badge-audit">Source of Truth Reconciled</span>
                </div>

                <div className="panel-card-body">
                  {/* GATEWAY */}
                  <div className="recon-step-card">
                    <div className="step-header">
                      <div className="step-icon-title">
                        <div className="step-badge-icon icon-gateway">
                          <Server size={18} />
                        </div>
                        <div>
                          <h5>1. Payment Gateway</h5>
                          <span className="step-caption">Customer Ingestion Layer</span>
                        </div>
                      </div>
                      <div>
                        {data.gateway ? (
                          <StatusBadge status={data.gateway.payment_status} />
                        ) : (
                          <span className="badge-missing">Record Missing</span>
                        )}
                      </div>
                    </div>

                    {data.gateway ? (
                      <div className="step-details-grid">
                        <div className="detail-item">
                          <span className="detail-label">Amount</span>
                          <span className="detail-val">
                            ₹{Number(data.gateway.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Payment Status</span>
                          <span className="detail-val font-semibold">{data.gateway.payment_status || "-"}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Payment Date</span>
                          <span className="detail-val">{data.gateway.payment_date || "-"}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Payment Method</span>
                          <span className="detail-val">{data.gateway.payment_method || "-"}</span>
                        </div>
                        <div className="detail-item full-width">
                          <span className="detail-label">Gateway Reference</span>
                          <span className="detail-val mono">
                            {data.gateway.gateway_reference || `GW-${data.transaction_id}`}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="missing-text">No record found in Gateway system.</p>
                    )}
                  </div>

                  <div className="pipeline-vertical-divider">
                    <ArrowDown size={18} />
                    <span>Clearing & Settlement Window</span>
                  </div>

                  {/* BANK */}
                  <div className="recon-step-card">
                    <div className="step-header">
                      <div className="step-icon-title">
                        <div className="step-badge-icon icon-bank">
                          <Building2 size={18} />
                        </div>
                        <div>
                          <h5>2. Partner Bank Settlement</h5>
                          <span className="step-caption">Interbank Clearing Layer</span>
                        </div>
                      </div>
                      <div>
                        {data.bank ? (
                          <StatusBadge status={data.bank.settlement_status} />
                        ) : (
                          <span className="badge-missing">Record Missing</span>
                        )}
                      </div>
                    </div>

                    {data.bank ? (
                      <div className="step-details-grid">
                        <div className="detail-item">
                          <span className="detail-label">Amount</span>
                          <span className="detail-val">
                            ₹{Number(data.bank.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Settlement Status</span>
                          <span className="detail-val font-semibold">{data.bank.settlement_status || "-"}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Settlement Date</span>
                          <span className="detail-val">{data.bank.settlement_date || "-"}</span>
                        </div>
                        <div className="detail-item full-width">
                          <span className="detail-label">Bank Reference</span>
                          <span className="detail-val mono">
                            {data.bank.bank_reference || `BK-${data.transaction_id}`}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="missing-text">No settlement record found in Partner Bank files.</p>
                    )}
                  </div>

                  <div className="pipeline-vertical-divider">
                    <ArrowDown size={18} />
                    <span>General Ledger Journal Posting</span>
                  </div>

                  {/* LEDGER */}
                  <div className="recon-step-card">
                    <div className="step-header">
                      <div className="step-icon-title">
                        <div className="step-badge-icon icon-ledger">
                          <BookOpen size={18} />
                        </div>
                        <div>
                          <h5>3. General Ledger</h5>
                          <span className="step-caption">Internal Accounting Books</span>
                        </div>
                      </div>
                      <div>
                        {data.ledger ? (
                          <StatusBadge status={data.ledger.ledger_status} />
                        ) : (
                          <span className="badge-missing">Record Missing</span>
                        )}
                      </div>
                    </div>

                    {data.ledger ? (
                      <div className="step-details-grid">
                        <div className="detail-item">
                          <span className="detail-label">Amount</span>
                          <span className="detail-val">
                            ₹{Number(data.ledger.amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Ledger Status</span>
                          <span className="detail-val font-semibold">{data.ledger.ledger_status || "-"}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Entry Date</span>
                          <span className="detail-val">{data.ledger.entry_date || "-"}</span>
                        </div>
                        <div className="detail-item full-width">
                          <span className="detail-label">Ledger Reference</span>
                          <span className="detail-val mono">
                            {data.ledger.ledger_reference || `LD-${data.transaction_id}`}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="missing-text">No ledger entry posted for this transaction.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* EXCEPTIONS */}
              <div className="panel-card">
                <div className="panel-card-header">
                  <h3>Diagnostic Analysis & Exceptions</h3>
                </div>
                <div className="panel-card-body">
                  {data.exceptions && data.exceptions.length > 0 ? (
                    <div className="exceptions-list">
                      {data.exceptions.map((ex, i) => (
                        <div key={i} className="exception-alert-item">
                          <AlertTriangle size={18} className="text-danger" />
                          <div>
                            <strong>Exception Flag</strong>
                            <p>{ex}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-exceptions-box">
                      <CheckCircle2 size={20} className="text-success" />
                      <div>
                        <strong>Clean Reconciliation</strong>
                        <p>No exceptions detected. Transaction amounts, dates, and references are consistent.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}
