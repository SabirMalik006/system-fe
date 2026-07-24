import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { transferAPI } from '../../../services/api';

const statusStyles = {
  success: 'bg-[#e2f5e9] text-[#1f874c]',
  executed: 'bg-[#e2f5e9] text-[#1f874c]',
  pending: 'text-[#c46c24] bg-transparent',
  'in approval': 'text-[#47607a] bg-[#f0f4f8]',
  draft: 'text-white bg-transparent',
};

export default function QuickTransferHistory({ refreshKey }) {
  const [history, setHistory] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    transferAPI.getQuickHistory(100)
      .then(res => {
        if (!mounted) return;
        setHistory(res.data.data || []);
        setTotal(res.data.data?.length || 0);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [refreshKey]);

  const filtered = history.filter(h =>
    !search || h.employee?.toLowerCase().includes(search.toLowerCase()) || h.id?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  useEffect(() => { setPage(1); }, [search]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between p-5 pb-4">
        <h2 className="text-base font-bold text-gray-900">Quick Transfer History</h2>
        <div className="flex items-center gap-2 bg-[#274c77] rounded-lg px-3 py-2">
          <Search size={14} className="text-[#a8c6e8]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="bg-transparent text-xs text-white outline-none w-28 md:w-40 placeholder-[#a8c6e8]"
          />
        </div>
      </div>

      <div className="overflow-x-auto flex-1 pb-4">
        <table className="w-full min-w-[400px]">
          <thead>
            <tr className="bg-[#274c77] text-white">
              {['ORDER ID', 'EMPLOYEE', 'FROM → TO', 'STATUS'].map(h => (
                <th key={h} className="text-left py-3 px-4 text-[10px] md:text-xs font-bold tracking-wider uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-400">Loading...</td></tr>
            ) : paginated.length === 0 ? (
              <tr><td colSpan={4} className="py-8 text-center text-sm text-gray-400">No transfers found</td></tr>
            ) : (
              paginated.map((row, i) => {
                const sKey = row.status?.toLowerCase() || 'draft';
                const isHighlight = sKey === 'pending' || sKey === 'draft';
                return (
                  <tr
                    key={row._id || i}
                    className={`border-b border-gray-100 transition-colors ${isHighlight ? 'bg-[#3b82f6] text-white' : ''}`}
                  >
                    <td className="py-3 px-4">
                      <span className={`text-xs md:text-sm ${isHighlight ? 'text-blue-100' : 'text-gray-500'}`}>{row.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-bold ${isHighlight ? 'text-white' : 'text-gray-900'}`}>{row.employee}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold ${isHighlight ? 'text-white' : 'text-gray-800'}`}>{row.from} → {row.to}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[9px] md:text-xs font-bold px-2 py-1 rounded tracking-wider ${statusStyles[sKey] || statusStyles.draft}`}>
                        {row.statusLabel || row.status?.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-auto p-4 border-t border-gray-100">
        <span className="text-[11px] md:text-xs font-medium text-gray-500">
          Showing {paginated.length} of {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={page <= 1}
            className="px-3 py-1 bg-[#274c77] rounded text-white text-[11px] md:text-xs font-semibold hover:bg-blue-800 transition-colors disabled:opacity-40"
          >
            Prev
          </button>
          <span className="px-2 text-[11px] md:text-xs text-gray-500">{page} / {totalPages}</span>
          <button
            onClick={handleNext}
            disabled={page >= totalPages}
            className="px-3 py-1 bg-[#274c77] rounded text-white text-[11px] md:text-xs font-semibold hover:bg-blue-800 transition-colors disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
