export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  type = "blue",
  trend,
}) {
  return (
    <div className={`kpi-card kpi-${type}`}>
      <div className="kpi-top">
        <span className="kpi-title">{title}</span>
        <div className={`kpi-icon-wrap kpi-icon-${type}`}>
          {icon}
        </div>
      </div>
      <div className="kpi-value">{value}</div>
      {(subtitle || trend) && (
        <div className="kpi-bottom">
          {trend && <span className="kpi-trend">{trend}</span>}
          {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
