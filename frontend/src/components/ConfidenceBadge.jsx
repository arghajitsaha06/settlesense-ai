import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

export default function ConfidenceBadge({ confidence }) {
  const normalized = (confidence || "MEDIUM").toUpperCase();

  switch (normalized) {
    case "HIGH":
      return (
        <span className="badge-confidence badge-conf-high">
          <ShieldCheck size={12} className="badge-icon" />
          <span>High (100%)</span>
        </span>
      );
    case "LOW":
      return (
        <span className="badge-confidence badge-conf-low">
          <ShieldAlert size={12} className="badge-icon" />
          <span>Low</span>
        </span>
      );
    case "MEDIUM":
    default:
      return (
        <span className="badge-confidence badge-conf-medium">
          <Shield size={12} className="badge-icon" />
          <span>Medium</span>
        </span>
      );
  }
}
