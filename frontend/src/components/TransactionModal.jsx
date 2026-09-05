import { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  Server,
  Building2,
  BookOpen,
  ArrowDown,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import StatusBadge from "./StatusBadge";
import ConfidenceBadge from "./ConfidenceBadge";
import { getTransaction } from "../api/api";

export default function TransactionModal({ transactionId, initialData, onClose }) {
  const [data, setData] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData && !!transactionId);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (transactionId && (!initialData || initialData.transaction_id !== transactionId)) {
      setLoading(true);
      setError(null);
      getTransaction(transactionId)
        .then((res) => {
          if (isMounted) {
            setData(res);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (isMounted) {
            setError(err.response?.data?.detail || "Unable to fetch transaction details from backend.");
            setLoading(false);
          }
        });
    } else if (initialData) {
      setData(initialData);
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [transactionId, initialData]);

  const handleCopyId = () => {
    if (data?.transaction_id) {
      navigator.clipboard.writeText(data.transaction_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!transactionId && !initialData) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <span className="modal-sub-label">RECONCILIATION AUDIT</span>
            <div className="modal-id-row">
              <h3>Transaction {data?.transaction_id || transactionId}</h3>
              <button
                className="btn-copy-id"
                onClick={handleCopyId}
                title="Copy Transaction Reference"
              >
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                <span>{copied ? "Copied" : "Copy ID"}</span>
              </button>
            </div>
          </div>
          <button className="btn-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="modal-body">
          {loading ? (
            <div className="modal-loading-state">
              <div className="spinner"></div>
              <p>Fetching 3-system reconciliation data from backend...</p>
            </div>
          ) : error ? (
            <div className="modal-error-state">
              <AlertTriangle size={36} className="text-danger" />
              <h4>Transaction Not Found</h4>
              <p>{error}</p>
              <button className="btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>
          ) : data ? (
            <>
              {/* TOP OVERVIEW CARD */}
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
                    {data.transaction_type || data.gateway?.payment_method || "UPI / Immediate"}
                  </div>
                </div>

                <div className="overview-metric">
                  <span className="overview-label">Transaction Date</span>
                  <div className="overview-value text-medium">
                    {data.transaction_date || data.gateway?.payment_date || "-"}
                  </div>
                </div>

                <div className="overview-metric">
                  <span className="overview-label">Reconciliation Status</span>
                  <div className="overview-value">
                    <StatusBadge status={data.status} />
                  </div>
                </div>

                <div className="overview-metric">
                  <span className="overview-label">AI Confidence</span>
                  <div className="overview-value">
                    <ConfidenceBadge confidence={data.confidence} />
                  </div>
                </div>
              </div>

              {/* 3-SYSTEM RECONCILIATION BREAKDOWN */}
              <div className="recon-systems-section">
                <div className="section-title-wrap">
                  <h4>3-Way System Reconciliation Audit</h4>
                  <span className="badge-audit">Source of Truth Verified</span>
                </div>

                {/* GATEWAY CARD */}
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
                        <span className="detail-val font-semibold">
                          {data.gateway.payment_status || "-"}
                        </span>
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
                    <p className="missing-text">No transaction record found in Payment Gateway database.</p>
                  )}
                </div>

                {/* CONNECTOR */}
                <div className="pipeline-vertical-divider">
                  <ArrowDown size={18} />
                  <span>Clearing & Settlement</span>
                </div>

                {/* BANK CARD */}
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
                        <span className="detail-val font-semibold">
                          {data.bank.settlement_status || "-"}
                        </span>
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

                {/* CONNECTOR */}
                <div className="pipeline-vertical-divider">
                  <ArrowDown size={18} />
                  <span>General Ledger Posting</span>
                </div>

                {/* LEDGER CARD */}
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
                        <span className="detail-val font-semibold">
                          {data.ledger.ledger_status || "-"}
                        </span>
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

              {/* EXCEPTIONS SECTION */}
              <div className="recon-exceptions-section">
                <h4>Reconciliation Diagnostics</h4>
                {data.exceptions && data.exceptions.length > 0 ? (
                  <div className="exceptions-list">
                    {data.exceptions.map((ex, idx) => (
                      <div key={idx} className="exception-alert-item">
                        <AlertTriangle size={18} className="text-danger" />
                        <div>
                          <strong>Exception Detected</strong>
                          <p>{ex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-exceptions-box">
                    <CheckCircle2 size={20} className="text-success" />
                    <div>
                      <strong>All Systems Balanced</strong>
                      <p>Gateway, Bank, and Ledger amounts and settlement dates reconcile without discrepancies.</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>

        {/* MODAL FOOTER */}
        <div className="modal-footer">
          <div className="modal-footer-hint">
            <ShieldCheck size={14} /> SettleSense AI Verification • HS256 Encrypted Session
          </div>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
