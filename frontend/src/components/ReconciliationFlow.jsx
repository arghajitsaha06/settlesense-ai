import { ArrowRight, Server, Building2, BookOpen, CheckCircle2 } from "lucide-react";

export default function ReconciliationFlow({
  gatewayStatus = "Operational",
  bankStatus = "Operational",
  ledgerStatus = "Operational",
  gatewayMatch = "99.8% matched",
  bankMatch = "98.9% matched",
  ledgerMatch = "99.5% matched",
}) {
  return (
    <div className="recon-flow-wrapper">
      <div className="recon-system-node">
        <div className="node-icon-box gateway-icon">
          <Server size={22} />
        </div>
        <div className="node-info">
          <div className="node-header">
            <h4>Payment Gateway</h4>
            <span className="node-status-tag status-healthy">
              <CheckCircle2 size={12} /> {gatewayStatus}
            </span>
          </div>
          <p className="node-detail">{gatewayMatch}</p>
          <span className="node-system-code">GW-ENGINE • REALTIME</span>
        </div>
      </div>

      <div className="flow-connector">
        <div className="connector-line"></div>
        <div className="connector-arrow">
          <ArrowRight size={18} />
        </div>
        <span className="connector-label">T+1 Settlement</span>
      </div>

      <div className="recon-system-node">
        <div className="node-icon-box bank-icon">
          <Building2 size={22} />
        </div>
        <div className="node-info">
          <div className="node-header">
            <h4>Partner Bank</h4>
            <span className="node-status-tag status-healthy">
              <CheckCircle2 size={12} /> {bankStatus}
            </span>
          </div>
          <p className="node-detail">{bankMatch}</p>
          <span className="node-system-code">CORE BANKING • NEFT/RTGS/UPI</span>
        </div>
      </div>

      <div className="flow-connector">
        <div className="connector-line"></div>
        <div className="connector-arrow">
          <ArrowRight size={18} />
        </div>
        <span className="connector-label">General Ledger</span>
      </div>

      <div className="recon-system-node">
        <div className="node-icon-box ledger-icon">
          <BookOpen size={22} />
        </div>
        <div className="node-info">
          <div className="node-header">
            <h4>Internal Ledger</h4>
            <span className="node-status-tag status-healthy">
              <CheckCircle2 size={12} /> {ledgerStatus}
            </span>
          </div>
          <p className="node-detail">{ledgerMatch}</p>
          <span className="node-system-code">FINANCIAL BOOKS • BALANCED</span>
        </div>
      </div>
    </div>
  );
}
