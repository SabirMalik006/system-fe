import React, { useState, useEffect } from "react";
import {
  RotateCcw,
  Search,
  ChevronDown,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { stockOutAPI } from "../../../services/api";
import { exportToCSV } from "../../../utils/exportUtils";

export default function RecentIssuanceHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchTransactions();
  }, [page, search, statusFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockOutAPI.getTransactions(
        page,
        10,
        search,
        statusFilter,
      );
      setTransactions(response.data.transactions || []);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalRecords(response.data.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to fetch issuance history:", error);
      setError("Failed to load issuance history.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleExport = () => {
    if (transactions.length === 0) {
      alert("No data to export");
      return;
    }

    const exportHeaders = [
      { label: "Transaction ID", key: "id" },
      { label: "Date", key: "date" },
      { label: "Time", key: "time" },
      { label: "Item Issued", key: "item" },
      { label: "Quantity", key: "qty" },
      { label: "Requesting Officer", key: "officer" },
      { label: "Department", key: "dept" },
      { label: "Status", key: "status" },
    ];

    exportToCSV(transactions, exportHeaders, "issuance_history");
  };

  const handleDownloadReceipt = (row) => {
    const receiptContent = `
STOCK OUT / ISSUANCE RECEIPT
----------------------------
Transaction ID: ${row.id}
Timestamp: ${row.date} ${row.time} ${row.ampm}
Item Issued: ${row.item}
Quantity: ${row.qty}
Requesting Officer: ${row.officer}
Department: ${row.dept}
Status: ${row.status}
----------------------------
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_out_${row.id}.txt`;
    link.click();
  };

  const startRecord = totalRecords === 0 ? 0 : (page - 1) * 10 + 1;
  const endRecord = Math.min(page * 10, totalRecords);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 min-h-[400px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <RotateCcw size={18} className="text-blue-500" />
          <h2 className="text-lg font-bold text-blue-600">
            Recent Issuance History
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-full sm:w-56">
            <Search size={13} className="text-gray-400" />
            <input
              value={search}
              onChange={handleSearch}
              placeholder="Search by ID or Officer..."
              className="text-xs outline-none text-gray-600 w-full bg-transparent"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-xs text-[#3B82F6]"
          >
            <Download size={13} />
            Download
          </button>
        </div>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center py-12 text-red-500">
          <AlertCircle size={40} className="mb-2 opacity-20" />
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-4 text-xs font-bold text-blue-600 underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 text-[10px] font-bold text-gray-400">
                    Transaction ID
                  </th>
                  <th className="text-left py-3 px-2 text-[10px] font-bold text-gray-400">
                    Timestamp
                  </th>
                  <th className="text-left py-3 px-2 text-[10px] font-bold text-gray-400">
                    Item Issued
                  </th>
                  <th className="text-left py-3 px-2 text-[10px] font-bold text-gray-400">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-2 text-[10px] font-bold text-gray-400">
                    Requesting Officer
                  </th>
                  <th className="text-left py-3 px-2 text-[10px] font-bold text-gray-400">
                    Department
                  </th>
                  <th className="text-left py-3 px-2 text-[10px] font-bold text-gray-400">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 text-[10px] font-bold text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="relative">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-20">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                        <span className="text-xs text-gray-400">
                          Loading history...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-20 text-gray-400">
                      <RotateCcw
                        size={40}
                        className="mx-auto mb-2 opacity-10"
                      />
                      <span className="text-sm italic">
                        No issuance history found
                      </span>
                    </td>
                  </tr>
                ) : (
                  transactions.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-5 px-2">
                        <span className="text-blue-500 font-bold text-sm">
                          {row.id}
                        </span>
                      </td>
                      <td className="py-5 px-2">
                        <div className="flex items-start gap-2">
                          <div className="text-sm text-gray-700">
                            {row.date}
                          </div>
                          <div className="w-px h-8 bg-gray-200" />
                          <div>
                            <div className="text-sm font-semibold">
                              {row.time}
                            </div>
                            <div className="text-xs text-gray-400">
                              {row.ampm}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-5 px-2">
                        <span className="text-sm text-gray-800">
                          {row.item}
                        </span>
                      </td>
                      <td className="py-5 px-2">
                        <span className="text-sm text-gray-700">{row.qty}</span>
                      </td>
                      <td className="py-5 px-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {row.officer}
                        </span>
                      </td>
                      <td className="py-5 px-2">
                        <span className="text-sm text-gray-600">
                          {row.dept}
                        </span>
                      </td>
                      <td className="py-5 px-2">
                        <span
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${row.statusStyle}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-5 px-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDownloadReceipt(row)}
                            title="Download Receipt"
                            className="p-1 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          >
                            <Download size={16} />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg">
                            <MoreVertical size={16} className="text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">
              Showing <strong>{startRecord}</strong> to{" "}
              <strong>{endRecord}</strong> of <strong>{totalRecords}</strong>{" "}
              records
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="flex items-center gap-1 px-2">
                <span className="text-sm font-bold text-gray-900">{page}</span>
                <span className="text-sm text-gray-400">/</span>
                <span className="text-sm text-gray-400">{totalPages}</span>
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
