import React, { useState, useEffect, useRef } from "react";
import {
  History,
  Filter,
  Download,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Trash2,
  Loader2,
  AlertCircle,
  Printer,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { stockInAPI } from "../../../services/api";
import { exportToCSV } from "../../../utils/exportUtils";
import toast, { Toaster } from 'react-hot-toast';
import ConfirmModal from '../../common/ConfirmModal';
import { useAuth } from '../../../contexts/AuthContext';

const statusStyles = {
  POSTED: "bg-green-100 text-green-700",
  DRAFT: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-blue-100 text-blue-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

const approvalRoles = ['dwece', 'cmes', 'ages_ges', 'super_admin'];

const headers = [
  { label: "ENTRY ID", key: "id" },
  { label: "ITEM NAME / SKU", key: "itemName" },
  { label: "QUANTITY (UNIT)", key: "qty" },
  { label: "VENDOR", key: "vendor" },
  { label: "P.O. #", key: "po" },
  { label: "BATCH/LOT", key: "batch" },
  { label: "WAREHOUSE", key: "warehouse" },
  { label: "STATUS", key: "status" },
  { label: "TIMESTAMP", key: "timestamp" },
  { label: "ACTIONS", key: "actions" },
];

export default function MasterSessionHistory() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approving, setApproving] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const canApprove = user && approvalRoles.includes(user.role);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, statusFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockInAPI.getTransactions(page, 10, statusFilter);
      setTransactions(response.data.transactions || []);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalRecords(response.data.pagination?.total || 0);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setError("Failed to load transaction history.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const response = await stockInAPI.deleteTransaction(deleteTarget.mongoId);
      if (response.data.success) {
        toast.success("Transaction deleted successfully");
        setDeleteTarget(null);
        fetchTransactions();
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      toast.error("Failed to delete transaction");
    }
  };

  const handleApprove = async (row) => {
    setApproving(row._mongoId);
    try {
      const response = await stockInAPI.approveTransaction(row._mongoId);
      if (response.data.success) {
        toast.success(`Stock In ${row.id} approved! Stock updated.`);
        fetchTransactions();
      }
    } catch (error) {
      console.error("Failed to approve transaction:", error);
      toast.error(error.response?.data?.message || 'Failed to approve');
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    try {
      const response = await stockInAPI.rejectTransaction(rejectTarget._mongoId, rejectReason);
      if (response.data.success) {
        toast.success(`Stock In ${rejectTarget.id} rejected`);
        setRejectTarget(null);
        setRejectReason('');
        fetchTransactions();
      }
    } catch (error) {
      console.error("Failed to reject transaction:", error);
      toast.error(error.response?.data?.message || 'Failed to reject');
    }
  };

  const handleExport = async () => {
    if (transactions.length === 0) {
      toast("No data to export");
      return;
    }

    const exportHeaders = headers.filter((h) => h.key !== "actions");

    exportToCSV(transactions, exportHeaders, "stock_in_history");
  };

  const handlePrintReceipt = (row) => {
    const printWin = window.open('', '_blank');
    printWin.document.write(`
      <html>
        <head>
          <title>Stock In Receipt - ${row.id}</title>
          <style>
            @media print { @page { margin: 0.5in; } body { font-family: monospace; font-size: 14px; } }
            body { font-family: monospace; padding: 20px; max-width: 400px; margin: 0 auto; }
            h1 { text-align: center; font-size: 18px; margin-bottom: 4px; }
            .divider { border-top: 1px dashed #000; margin: 12px 0; }
            .row { display: flex; justify-content: space-between; padding: 4px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>STOCK IN RECEIPT</h1>
          <div class="divider"></div>
          <div class="row"><span class="label">Entry ID:</span><span>${row.id}</span></div>
          <div class="row"><span class="label">Item:</span><span>${row.itemName}</span></div>
          <div class="row"><span class="label">SKU:</span><span>${row.sku}</span></div>
          <div class="row"><span class="label">Quantity:</span><span>${row.qty}</span></div>
          <div class="row"><span class="label">Vendor:</span><span>${row.vendor}</span></div>
          <div class="row"><span class="label">P.O. #:</span><span>${row.po}</span></div>
          <div class="row"><span class="label">Batch/Lot:</span><span>${row.batch}</span></div>
          <div class="row"><span class="label">Warehouse:</span><span>${row.warehouse}</span></div>
          <div class="row"><span class="label">Status:</span><span>${row.status}</span></div>
          <div class="row"><span class="label">Timestamp:</span><span>${row.timestamp}</span></div>
          <div class="divider"></div>
          <p style="text-align:center;font-size:12px;color:#666;">Generated on: ${new Date().toLocaleString()}</p>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => { printWin.print(); }, 300);
  };

  const handleDownloadReceipt = (row) => {
    const receiptContent = `
STOCK IN RECEIPT
----------------
Entry ID: ${row.id}
Item: ${row.itemName}
SKU: ${row.sku}
Quantity: ${row.qty}
Vendor: ${row.vendor}
P.O. #: ${row.po}
Batch/Lot: ${row.batch}
Warehouse: ${row.warehouse}
Status: ${row.status}
Timestamp: ${row.timestamp}
----------------
Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([receiptContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `receipt_${row.id}.txt`;
    link.click();
  };

  const startRecord = totalRecords === 0 ? 0 : (page - 1) * 10 + 1;
  const endRecord = Math.min(page * 10, totalRecords);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 min-h-[400px]">
      <Toaster position="top-right" />
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <History size={16} className="text-blue-500" />
            <h2 className="text-base font-semibold text-[#2B8CEE]">
              Master Session History
            </h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 ml-6">
            Comprehensive view of all stock-in transactions recorded in the
            current session.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 bg-white"
            >
              <Filter size={12} />
              <span>{statusFilter}</span>
              <ChevronDown size={12} />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                {["All Status", "POSTED", "DRAFT", "PENDING", "APPROVED", "REJECTED"].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setPage(1);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${statusFilter === s ? 'text-blue-600 font-semibold bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleExport}
            className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center"
          >
            <Download size={14} />
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
          <div className="overflow-x-auto border border-gray-300 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {headers.map((h) => (
                    <th
                      key={h.key}
                      className="text-left py-2.5 px-2 text-[10px] font-bold text-gray-400 tracking-wider whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1">
                        {h.label}
                        {["id", "itemName", "timestamp"].includes(h.key) && (
                          <ArrowUpDown size={9} className="text-gray-300" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="relative">
                {loading ? (
                  <tr>
                    <td colSpan={headers.length} className="py-20">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
                        <span className="text-xs text-gray-400">
                          Loading records...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length} className="text-center py-20">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <History size={40} className="mb-2 opacity-10" />
                        <span className="text-sm italic">
                          No transactions found
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3.5 px-2">
                        <span className="text-blue-500 font-semibold text-xs">
                          {row.id}
                        </span>
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="font-semibold text-gray-900 text-sm">
                          {row.itemName}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {row.sku}
                        </div>
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="font-semibold text-gray-900">
                          {row.qty}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-600 text-xs">
                        {row.vendor}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">
                          {row.po}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-500 text-xs">
                        {row.batch}
                      </td>
                      <td className="py-3.5 px-2 text-gray-600 text-xs">
                        {row.warehouse}
                      </td>
                      <td className="py-3.5 px-2">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusStyles[row.status] || "bg-gray-100 text-gray-600"}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-gray-400 text-xs whitespace-nowrap">
                        {row.timestamp}
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-2">
                          {canApprove && row.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(row)}
                                disabled={approving === row._mongoId}
                                title="Approve Stock In"
                                className="p-1 hover:bg-green-50 text-green-600 rounded transition-colors disabled:opacity-50"
                              >
                                {approving === row._mongoId ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : (
                                  <CheckCircle size={14} />
                                )}
                              </button>
                              <button
                                onClick={() => setRejectTarget(row)}
                                title="Reject Stock In"
                                className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handlePrintReceipt(row)}
                            title="Print Receipt"
                            className="p-1 hover:bg-gray-100 text-gray-600 rounded transition-colors"
                          >
                            <Printer size={14} />
                          </button>
                          <button
                            onClick={() => handleDownloadReceipt(row)}
                            title="Download Receipt"
                            className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors"
                          >
                            <Download size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget({ id: row.id, mongoId: row._mongoId })}
                            title="Delete"
                            className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4 p-2 border border-gray-200 rounded-lg">
            <span className="text-xs text-gray-500">
              Showing <strong>{startRecord}</strong> to{" "}
              <strong>{endRecord}</strong> of <strong>{totalRecords}</strong>{" "}
              records
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
                className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <div className="flex items-center gap-1 px-2">
                <span className="text-xs font-bold text-gray-900">{page}</span>
                <span className="text-xs text-gray-400">/</span>
                <span className="text-xs text-gray-400">{totalPages}</span>
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || loading}
                className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete transaction ${deleteTarget?.id}? This will also reverse the stock change.`}
      />

      <ConfirmModal
        isOpen={!!rejectTarget}
        onClose={() => { setRejectTarget(null); setRejectReason(''); }}
        onConfirm={handleReject}
        title="Reject Stock In"
        message={
          <div>
            <p className="text-xs text-gray-600 mb-3">
              Are you sure you want to reject transaction <strong>{rejectTarget?.id}</strong>?
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Reason for rejection (required)..."
              className="w-full border border-gray-200 rounded-lg p-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-red-400 resize-none"
              rows={3}
            />
          </div>
        }
        confirmText="Reject"
        variant="danger"
      />
    </div>
  );
}
