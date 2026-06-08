import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Search, ChevronDown, Filter, Calendar, ArrowUpDown,
  ChevronLeft, ChevronRight, Download, Trash2, Printer,
} from "lucide-react";
import { stockReturnAPI } from "../../../services/api";
import { exportToCSV } from "../../../utils/exportUtils";

const headers = [
  { label: "RETURN ID", key: "id" },
  { label: "DATE LOGGED", key: "date" },
  { label: "INVENTORY ITEM", key: "item" },
  { label: "QTY", key: "qty" },
  { label: "REASON", key: "reason" },
  { label: "CONDITION", key: "condition" },
  { label: "RETURNING STAFF", key: "staff" },
  { label: "ORIGIN UNIT", key: "origin" },
  { label: "STATUS", key: "status" },
  { label: "ACTIONS", key: "actions" },
];

export default function StockReturnsTable() {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState("");
  const [reason, setReason] = useState("All Reasons");
  const [status, setStatus] = useState("All Status");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  useEffect(() => { fetchTransactions(); }, [page, search, reason, status, dateRange]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await stockReturnAPI.getTransactions(page, limit, search, reason, status, dateRange);
      if (response.data.success) {
        setTableData(response.data.transactions);
        setTotalPages(response.data.pagination.pages);
        setTotalRecords(response.data.pagination.total);
      }
    } catch (error) {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => { setSearch(e.target.value); setPage(1); };

  const handleExport = () => {
    if (tableData.length === 0) { toast("No data to export"); return; }
    const exportHeaders = headers.filter((h) => h.key !== "actions");
    exportToCSV(tableData, exportHeaders, "stock_returns_history");
    toast.success("Exported to CSV");
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete return ${row.id}? This will reverse stock changes.`)) return;
    try {
      const response = await stockReturnAPI.deleteReturn(row._id);
      if (response.data.success) {
        toast.success("Return deleted");
        fetchTransactions();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete return");
    }
  };

  const handlePrintReceipt = (row) => {
    const html = `<!DOCTYPE html><html><head><title>Stock Return Receipt</title><style>
      body { font-family: monospace; padding: 20px; }
      h1 { text-align: center; }
      .details { margin: 10px 0; }
      .details p { margin: 4px 0; }
    </style></head><body>
      <h1>STOCK RETURN RECEIPT</h1>
      <div class="details">
        <p><strong>Return ID:</strong> ${row.id}</p>
        <p><strong>Date Logged:</strong> ${row.date}</p>
        <p><strong>Item:</strong> ${row.item}</p>
        <p><strong>Quantity:</strong> ${row.qty}</p>
        <p><strong>Reason:</strong> ${row.reason}</p>
        <p><strong>Condition:</strong> ${row.condition}</p>
        <p><strong>Returning Staff:</strong> ${row.staff}</p>
        <p><strong>Origin Unit:</strong> ${row.origin}</p>
        <p><strong>Status:</strong> ${row.status}</p>
      </div>
      <p style="text-align:center;color:#888;margin-top:30px;">Generated: ${new Date().toLocaleString()}</p>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4">
      <Toaster position="top-right" />
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64 bg-white">
          <Search size={13} className="text-gray-400 flex-shrink-0" />
          <input placeholder="Search Return ID, item, staff..." className="text-xs text-gray-600 outline-none bg-transparent w-full placeholder-gray-400" value={search} onChange={handleSearchChange} />
        </div>
        <div className="flex-1" />
        <div className="flex flex-wrap items-center gap-2">
          <select className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-sm px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-[#0F172A] bg-white hover:bg-gray-50 outline-none"
            value={reason} onChange={e => { setReason(e.target.value); setPage(1); }}>
            <option>All Reasons</option>
            <option>DAMAGED</option><option>EXPIRED</option><option>EXCESS</option>
            <option>DEFECTIVE</option><option>PROJECT_END</option>
          </select>
          <select className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-sm px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-[#0F172A] bg-white hover:bg-gray-50 outline-none"
            value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
            <option>All Status</option>
            <option>PENDING</option><option>APPROVED</option><option>RESTOCKED</option><option>QUARANTINED</option>
          </select>
          <select className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-sm px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-[#0F172A] bg-white hover:bg-gray-50 outline-none"
            value={dateRange} onChange={e => { setDateRange(e.target.value); setPage(1); }}>
            <option>Last 30 Days</option><option>Last 90 Days</option><option>All</option>
          </select>
          <button onClick={handleExport} className="flex items-center gap-1.5 border border-gray-200 rounded-sm px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-[#3B82F6] bg-white hover:bg-gray-50">
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {headers.map((h) => (
                <th key={h.key} className="text-left py-2 sm:py-2.5 px-2 sm:px-3 text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-wider whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {h.label}
                    {!["actions","qty","reason","condition","staff","origin"].includes(h.key) && <ArrowUpDown size={9} className="text-gray-300" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={headers.length} className="text-center py-10 text-gray-400">Loading transactions...</td></tr>
            ) : tableData.length === 0 ? (
              <tr><td colSpan={headers.length} className="text-center py-10 text-gray-400">No transactions found</td></tr>
            ) : tableData.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 sm:py-3.5 px-2 sm:px-3"><span className="text-blue-500 font-semibold text-[10px] sm:text-xs">{row.id}</span></td>
                <td className="py-3 sm:py-3.5 px-2 sm:px-3 text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">{row.date}</td>
                <td className="py-3 sm:py-3.5 px-2 sm:px-3"><span className="font-bold text-gray-900 text-[10px] sm:text-xs uppercase">{row.item}</span></td>
                <td className="py-3 sm:py-3.5 px-2 sm:px-3 font-semibold text-gray-900 text-[10px] sm:text-xs">{row.qty}</td>
                <td className="py-3 sm:py-3.5 px-2 sm:px-3"><span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded ${row.reasonStyle}`}>{row.reason}</span></td>
                <td className="py-3 sm:py-3.5 px-2 sm:px-3"><span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded ${row.condStyle}`}>{row.condition}</span></td>
                <td className="py-3 sm:py-3.5 px-2 sm:px-3 text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">{row.staff}</td>
                <td className="py-3 sm:py-3.5 px-2 sm:px-3 text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">{row.origin}</td>
                <td className="py-3 sm:py-3.5 px-2 sm:px-3"><span className={`text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${row.statusStyle}`}>{row.status}</span></td>
                <td className="py-3 sm:py-3.5 px-2 sm:px-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handlePrintReceipt(row)} title="Print Receipt" className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors"><Printer size={14} /></button>
                    <button onClick={() => handleDelete(row)} title="Delete" className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100">
        <span className="text-[10px] sm:text-xs text-gray-500">SHOWING <strong>{tableData.length > 0 ? (page - 1) * limit + 1 : 0}-{Math.min(page * limit, totalRecords)}</strong> OF <strong>{totalRecords}</strong> STOCK RECORDS</span>
        <div className="flex items-center gap-1.5">
          <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="w-6 h-6 sm:w-7 sm:h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"><ChevronLeft size={13} className="text-gray-400" /></button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i + 1} onClick={() => setPage(i + 1)} className={`w-6 h-6 sm:w-7 sm:h-7 rounded text-[10px] sm:text-xs font-semibold transition-colors ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="w-6 h-6 sm:w-7 sm:h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"><ChevronRight size={13} className="text-gray-400" /></button>
        </div>
      </div>
    </div>
  );
}
