import React, { useState, useEffect } from 'react';
import { History, Filter, Download, ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { stockInAPI } from '../../../services/api';

const statusStyles = {
  POSTED: 'bg-green-100 text-green-700',
  DRAFT: 'bg-yellow-100 text-yellow-700',
  PENDING: 'bg-blue-100 text-blue-700',
};

const headers = [
  { label: 'ENTRY ID', key: 'id' },
  { label: 'ITEM NAME / SKU', key: 'itemName' },
  { label: 'QUANTITY (UNIT)', key: 'qty' },
  { label: 'VENDOR', key: 'vendor' },
  { label: 'P.O. #', key: 'po' },
  { label: 'BATCH/LOT', key: 'batch' },
  { label: 'WAREHOUSE', key: 'warehouse' },
  { label: 'STATUS', key: 'status' },
  { label: 'TIMESTAMP', key: 'timestamp' },
];

export default function MasterSessionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState('All Status');

  useEffect(() => {
    fetchTransactions();
  }, [page, statusFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await stockInAPI.getTransactions(page, 10, statusFilter);
      setTransactions(response.data.transactions || []);
      setTotalPages(response.data.pagination?.pages || 1);
      setTotalRecords(response.data.pagination?.total || 0);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    // Implement export functionality
    console.log('Export clicked');
  };

  const startRecord = (page - 1) * 10 + 1;
  const endRecord = Math.min(page * 10, totalRecords);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <History size={16} className="text-blue-500" />
            <h2 className="text-base font-semibold text-[#2B8CEE]">Master Session History</h2>
          </div>
          <p className="text-xs text-gray-400 mt-0.5 ml-6">
            Comprehensive view of all stock-in transactions recorded in the current session.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-600 bg-white">
              <Filter size={12} />
              <span>{statusFilter}</span>
              <ChevronDown size={12} />
            </button>
          </div>
          <button onClick={handleExport} className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center">
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-300 rounded-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {headers.map((h) => (
                <th key={h.key} className="text-left py-2.5 px-2 text-[10px] font-bold text-gray-400 tracking-wider whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {h.label}
                    {['id', 'itemName', 'timestamp'].includes(h.key) && <ArrowUpDown size={9} className="text-gray-300" />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={headers.length} className="text-center py-8">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan={headers.length} className="text-center py-8">No transactions found</td></tr>
            ) : (
              transactions.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3.5 px-2"><span className="text-blue-500 font-semibold text-xs">{row.id}</span></td>
                  <td className="py-3.5 px-2">
                    <div className="font-semibold text-gray-900 text-sm">{row.itemName}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{row.sku}</div>
                  </td>
                  <td className="py-3.5 px-2"><span className="font-semibold text-gray-900">{row.qty}</span></td>
                  <td className="py-3.5 px-2 text-gray-600 text-xs">{row.vendor}</td>
                  <td className="py-3.5 px-2"><span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">{row.po}</span></td>
                  <td className="py-3.5 px-2 text-gray-500 text-xs">{row.batch}</td>
                  <td className="py-3.5 px-2 text-gray-600 text-xs">{row.warehouse}</td>
                  <td className="py-3.5 px-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${statusStyles[row.status] || 'bg-gray-100 text-gray-600'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-gray-400 text-xs whitespace-nowrap">{row.timestamp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 p-2 border border-gray-200">
        <span className="text-xs text-gray-500">
          Showing <strong>{startRecord}</strong> to <strong>{endRecord}</strong> of <strong>{totalRecords}</strong> records
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50">
            <ChevronLeft size={14} />
          </button>
          <span className="text-xs text-gray-600 px-2">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}