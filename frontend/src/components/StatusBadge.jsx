import { CheckCircle2, Clock, XCircle, RotateCcw, AlertTriangle } from "lucide-react";

export default function StatusBadge({ status }) {
  const normalized = (status || "UNKNOWN").toUpperCase();

  switch (normalized) {
    case "SUCCESS":
    case "SETTLED":
    case "COMPLETED":
      return (
        <span className="badge-status badge-success">
          <CheckCircle2 size={13} className="badge-icon" />
          <span>SUCCESS</span>
        </span>
      );

    case "PENDING":
      return (
        <span className="badge-status badge-pending">
          <Clock size={13} className="badge-icon" />
          <span>PENDING</span>
        </span>
      );

    case "FAILED":
    case "REJECTED":
      return (
        <span className="badge-status badge-failed">
          <XCircle size={13} className="badge-icon" />
          <span>FAILED</span>
        </span>
      );

    case "REVERSED":
      return (
        <span className="badge-status badge-reversed">
          <RotateCcw size={13} className="badge-icon" />
          <span>REVERSED</span>
        </span>
      );

    case "EXCEPTION":
    default:
      return (
        <span className="badge-status badge-exception">
          <AlertTriangle size={13} className="badge-icon" />
          <span>EXCEPTION</span>
        </span>
      );
  }
}
