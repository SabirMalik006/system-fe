import React, { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import {
  RotateCcw,
  Search,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Eye,
  Edit3,
  Trash2,
  FileText,
  XCircle,
} from "lucide-react";
import { stockOutAPI } from "../../../services/api";
import { exportToCSV } from "../../../utils/exportUtils";
import { useAuth } from "../../../contexts/AuthContext";

export default function RecentIssuanceHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [viewModalRow, setViewModalRow] = useState(null);
  const [editModalRow, setEditModalRow] = useState(null);
  const [editForm, setEditForm] = useState({ itemName: '', quantity: 0, issuedTo: '', department: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirmRow, setDeleteConfirmRow] = useState(null);
  const menuRef = useRef(null);
  const { user } = useAuth();

  const closeMenu = useCallback(() => setOpenMenuId(null), []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    if (openMenuId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId, closeMenu]);

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

  const handleDelete = async () => {
    const row = deleteConfirmRow;
    if (!row) return;
    try {
      await stockOutAPI.deleteTransaction(row._mongoId);
      setTransactions((prev) => prev.filter((t) => t._mongoId !== row._mongoId));
      setTotalRecords((prev) => prev - 1);
      setOpenMenuId(null);
      setDeleteConfirmRow(null);
      toast.success("Transaction deleted successfully");
    } catch (err) {
      console.error("Failed to delete:", err);
      setDeleteConfirmRow(null);
      toast.error("Failed to delete transaction.");
    }
  };

  const handleEditClick = (row) => {
    setEditForm({
      itemName: row.item || '',
      quantity: parseInt(row.qty) || 0,
      issuedTo: row.officer || '',
      department: row.dept || '',
      notes: ''
    });
    setEditModalRow(row);
    setOpenMenuId(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    if (!editModalRow) return;
    setSaving(true);
    try {
      await stockOutAPI.updateStockOut(editModalRow._mongoId, editForm);
      toast.success("Transaction updated successfully");
      setEditModalRow(null);
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update transaction");
    } finally {
      setSaving(false);
    }
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
                        <div className="flex items-center gap-2 relative">
                          <button
                            onClick={() => setViewModalRow(row)}
                            title="View Details"
                            className="p-1 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDownloadReceipt(row)}
                            title="Download Receipt"
                            className="p-1 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          >
                            <Download size={16} />
                          </button>
                          <div ref={openMenuId === row.id ? menuRef : null}>
                            <button
                              onClick={() =>
                                setOpenMenuId(openMenuId === row.id ? null : row.id)
                              }
                              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical size={16} className="text-gray-400" />
                            </button>
                            {openMenuId === row.id && (
                              <div className="absolute right-0 top-full mt-1 z-50 w-40 bg-white border border-gray-200 rounded-xl shadow-lg py-1">
                                {['dwece', 'cmes', 'ages_ges'].includes(user?.role) && (
                                  <button
                                    onClick={() => handleEditClick(row)}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <Edit3 size={13} className="text-indigo-500" />
                                    Edit
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    handleDownloadReceipt(row);
                                    setOpenMenuId(null);
                                  }}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <FileText size={13} className="text-green-500" />
                                  Download Receipt
                                </button>
                                <hr className="my-1 border-gray-100" />
                                <button
                                  onClick={() => {
                                    setDeleteConfirmRow(row);
                                    setOpenMenuId(null);
                                  }}
                                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={13} />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
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

      {deleteConfirmRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-red-600">Delete Transaction</h3>
              <button
                onClick={() => setDeleteConfirmRow(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete transaction <strong>{deleteConfirmRow.id}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmRow(null)}
                className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {viewModalRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900">Transaction Details</h3>
              <button
                onClick={() => setViewModalRow(null)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-semibold text-blue-600">{viewModalRow.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="text-gray-800">{viewModalRow.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="text-gray-800">{viewModalRow.time} {viewModalRow.ampm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Item Issued</span>
                <span className="text-gray-800">{viewModalRow.item}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quantity</span>
                <span className="text-gray-800">{viewModalRow.qty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Requesting Officer</span>
                <span className="text-gray-800">{viewModalRow.officer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Department</span>
                <span className="text-gray-800">{viewModalRow.dept}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Status</span>
                <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full ${viewModalRow.statusStyle}`}>
                  {viewModalRow.status}
                </span>
              </div>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setViewModalRow(null)}
                className="px-4 py-2 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editModalRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditModalRow(null)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 bg-indigo-600">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                  <Edit3 size={13} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white">Edit Transaction</h3>
                  <p className="text-[9px] text-indigo-200">{editModalRow.id}</p>
                </div>
              </div>
              <button onClick={() => setEditModalRow(null)} className="p-1 hover:bg-white/10 rounded-lg text-indigo-200 transition-colors">
                <XCircle size={14} />
              </button>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-[10px] font-medium text-gray-500 block mb-1">Item Name</label>
                <input name="itemName" value={editForm.itemName} onChange={handleEditChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-gray-500 block mb-1">Quantity</label>
                <input name="quantity" type="number" value={editForm.quantity} onChange={handleEditChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-gray-500 block mb-1">Requesting Officer</label>
                <input name="issuedTo" value={editForm.issuedTo} onChange={handleEditChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-gray-500 block mb-1">Department</label>
                <input name="department" value={editForm.department} onChange={handleEditChange}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-400" />
              </div>
              <div>
                <label className="text-[10px] font-medium text-gray-500 block mb-1">Notes</label>
                <textarea name="notes" value={editForm.notes} onChange={handleEditChange} rows={2}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-indigo-400 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setEditModalRow(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleEditSave} disabled={saving}
                className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
