import React, { useState, useEffect } from 'react';
import { Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { transferAPI } from '../../../services/api';

const statusStyles = {
  Executed: 'bg-[#e2f5e9] text-[#1f874c]',
  Success: 'bg-[#e2f5e9] text-[#1f874c]',
  'In Approval': 'bg-[#f0f4f8] text-[#47607a]',
  Pending: 'bg-[#fff3cd] text-[#c46c24]',
  Draft: 'bg-gray-100 text-gray-600',
};

export default function RecentTransferOrders({ refreshKey }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    transferAPI.getAll({ limit: 10 })
      .then(res => { if (mounted) setOrders(res.data.data || []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [refreshKey]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5">
        <h2 className="text-lg font-bold text-gray-900">Recent Transfer Orders Detailed</h2>
        <button
          onClick={() => navigate('/inter-unit-transfer')}
          className="text-xs font-bold text-[#274c77] hover:text-blue-800 transition-colors text-right max-w-[100px] leading-tight flex flex-col"
        >
          <span>View All</span>
          <span>Records</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-[#274c77] text-white">
              {['EMPLOYEE DETAILS', 'CURRENT STATION', 'NEW POSTING', 'HARD AREA TRANSFER', 'RELEASE DATE', 'STATUS', 'ACTIONS'].map(h => (
                <th key={h} className={`text-left px-5 py-3 text-[10px] font-bold tracking-wider uppercase ${h === 'STATUS' || h === 'ACTIONS' || h === 'HARD AREA TRANSFER' ? 'text-center' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-sm text-gray-400">No transfer orders found</td></tr>
            ) : (
              orders.map((row, i) => {
                const initials = row.employeeName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '—';
                const ss = statusStyles[row.status] || statusStyles.Draft;
                return (
                  <tr key={row._id || i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                          style={{ background: '#ebf4ff', color: '#1a73e8' }}
                        >
                          {initials}
                        </div>
                        <div className="text-[11px] font-semibold text-gray-500">
                          {row.employeeId || row.employeeName}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-bold text-gray-900 leading-tight">{row.sourceUnit || '—'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-xs font-bold text-gray-900 leading-tight">{row.destinationUnit || '—'}</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${
                        row.hardAreaTransfer
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {row.hardAreaTransfer ? 'On' : 'Off'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-gray-900 whitespace-nowrap">
                      {row.effectiveDate || '—'}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${ss}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/inter-unit-transfer/${row._id}`)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Eye size={16} className="text-gray-700" />
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const res = await transferAPI.exportTransfers();
                              const url = URL.createObjectURL(new Blob([res.data]));
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `transfers-${Date.now()}.csv`;
                              link.click();
                              URL.revokeObjectURL(url);
                              toast.success('Report downloaded');
                            } catch (err) {
                              toast.error('Export failed');
                            }
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <FileText size={16} className="text-gray-700" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
