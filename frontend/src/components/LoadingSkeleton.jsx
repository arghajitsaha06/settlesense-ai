export default function LoadingSkeleton({ rows = 5, type = "table" }) {
  if (type === "cards") {
    return (
      <div className="skeleton-cards-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton-card shimmer">
            <div className="skeleton-line short"></div>
            <div className="skeleton-line medium"></div>
            <div className="skeleton-line tiny"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="skeleton-table">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-row shimmer">
          <div className="skeleton-cell w-15"></div>
          <div className="skeleton-cell w-25"></div>
          <div className="skeleton-cell w-15"></div>
          <div className="skeleton-cell w-15"></div>
          <div className="skeleton-cell w-15"></div>
          <div className="skeleton-cell w-15"></div>
        </div>
      ))}
    </div>
  );
}
