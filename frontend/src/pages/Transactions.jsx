import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  ArrowLeftRight,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CreditCard,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatusBadge from "../components/StatusBadge";
import ConfidenceBadge from "../components/ConfidenceBadge";
import TransactionModal from "../components/TransactionModal";
import LoadingSkeleton from "../components/LoadingSkeleton";
import { getTransactions, RECONCILIATION_STATS } from "../api/api";

export default function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 22; // Exactly 22 transactions per page as required

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [activeSearch, setActiveSearch] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(RECONCILIATION_STATS.total);
  const [totalPages, setTotalPages] = useState(Math.ceil(RECONCILIATION_STATS.total / 22));
  const [loading, setLoading] = useState(true);

  const [selectedTxId, setSelectedTxId] = useState(null);
  const [selectedTxData, setSelectedTxData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getTransactions({
      page,
      pageSize,
      search: activeSearch,
      status: statusFilter,
      type: typeFilter,
    })
      .then((res) => {
        if (isMounted) {
          setTransactions(res.transactions || []);
          setTotal(res.total || RECONCILIATION_STATS.total);
          setTotalPages(res.totalPages || Math.ceil((res.total || RECONCILIATION_STATS.total) / pageSize));
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, activeSearch, statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchInput.trim());
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setActiveSearch("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setPage(1);
    setSearchParams({});
  };

  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, total);

  // Generate numbered pagination buttons
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (page >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main-content">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onSearchTransaction={(q) => {
            setSearchInput(q);
            setActiveSearch(q);
            setPage(1);
          }}
        />

        <main className="dashboard-container">
          {/* PAGE TITLE & ACTION */}
          <div className="page-header-row">
            <div>
              <span className="panel-sub-label">SETTLEMENT INVENTORY</span>
              <h2>All Transactions</h2>
              <p className="page-header-caption">
                Browse and audit complete settlement transactions (22 records per page)
              </p>
            </div>

            <div className="page-header-actions">
              <span className="badge-inventory-count">
                Total: {total.toLocaleString("en-IN")} Records
              </span>
            </div>
          </div>

          {/* FILTER & SEARCH BAR */}
          <section className="filter-controls-panel">
            <form onSubmit={handleSearchSubmit} className="search-filter-form">
              <div className="search-input-group">
                <Search size={16} className="search-group-icon" />
                <input
                  type="text"
                  placeholder="Search by Transaction ID (e.g. TXN000000001)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="input-filter-search"
                />
              </div>

              <div className="filter-dropdowns-group">
                <div className="select-wrap">
                  <label htmlFor="filter-status">Status:</label>
                  <select
                    id="filter-status"
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="SUCCESS">Success</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                    <option value="REVERSED">Reversed</option>
                    <option value="EXCEPTION">Exception</option>
                  </select>
                </div>

                <div className="select-wrap">
                  <label htmlFor="filter-type">Type:</label>
                  <select
                    id="filter-type"
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="ALL">All Payment Types</option>
                    <option value="UPI">UPI</option>
                    <option value="CARD">Card / Debit</option>
                    <option value="POS">POS Terminal</option>
                    <option value="NETBANKING">NetBanking</option>
                  </select>
                </div>

                <button type="submit" className="btn-filter-apply">
                  Apply
                </button>

                {(activeSearch || statusFilter !== "ALL" || typeFilter !== "ALL") && (
                  <button
                    type="button"
                    className="btn-filter-reset"
                    onClick={handleResetFilters}
                    title="Reset all filters"
                  >
                    <RotateCcw size={14} />
                    <span>Reset</span>
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* TRANSACTIONS TABLE PANEL */}
          <section className="panel-card">
            <div className="panel-card-header table-info-header">
              <div className="showing-indicator">
                <strong>
                  Showing {startRecord.toLocaleString("en-IN")}–{endRecord.toLocaleString("en-IN")} of{" "}
                  {total.toLocaleString("en-IN")} transactions
                </strong>
                <span className="showing-sub">
                  Page {page} of {totalPages.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="table-header-meta">
                <span className="meta-pill">Page Size: 22</span>
              </div>
            </div>

            <div className="panel-card-body table-responsive">
              {loading ? (
                <LoadingSkeleton rows={10} />
              ) : transactions.length === 0 ? (
                <div className="empty-state-box">
                  <ArrowLeftRight size={36} className="text-muted" />
                  <h4>No matching transactions found</h4>
                  <p>Try clearing your search query or selecting a different status filter.</p>
                  <button className="btn-secondary" onClick={handleResetFilters}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                <table className="banking-table">
                  <thead>
                    <tr>
                      <th>Transaction ID</th>
                      <th>Amount</th>
                      <th>Payment Type</th>
                      <th>Transaction Date</th>
                      <th>Status</th>
                      <th>Confidence</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.transaction_id} className="table-hover-row">
                        <td>
                          <div className="tx-id-badge">
                            <span className="tx-id-code">{tx.transaction_id}</span>
                            <span className="tx-id-sub">System ID</span>
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
                            onClick={() => {
                              setSelectedTxId(tx.transaction_id);
                              setSelectedTxData(tx);
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

            {/* PAGINATION FOOTER */}
            {!loading && totalPages > 1 && (
              <div className="panel-card-footer pagination-footer">
                <div className="pagination-info">
                  Showing {startRecord.toLocaleString("en-IN")}–{endRecord.toLocaleString("en-IN")} of{" "}
                  {total.toLocaleString("en-IN")} transactions
                </div>

                <div className="pagination-controls">
                  <button
                    className="btn-page-nav"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} />
                    <span>Previous</span>
                  </button>

                  <div className="page-number-buttons">
                    {getPageNumbers().map((pNum, idx) =>
                      pNum === "..." ? (
                        <span key={`ellipsis-${idx}`} className="page-ellipsis">
                          ...
                        </span>
                      ) : (
                        <button
                          key={`page-${pNum}`}
                          className={`btn-page-num ${page === pNum ? "active" : ""}`}
                          onClick={() => setPage(Number(pNum))}
                        >
                          {pNum}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="btn-page-nav"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    <span>Next</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* TRANSACTION MODAL */}
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
