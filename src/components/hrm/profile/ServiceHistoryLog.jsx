import React from 'react';
import { History, Download, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { employeeAPI } from '../../../services/api';

export default function ServiceHistoryLog({ employee = {} }) {
  const history = (employee.serviceHistory || []).length > 0
    ? employee.serviceHistory.map((entry, i) => ({
        designation: entry.designation || 'N/A',
        dept: entry.company || 'N/A',
        unit: 'N/A',
        start: entry.fromDate || 'N/A',
        end: entry.toDate || 'Present',
        remark: 'Recorded',
        remarkStyle: 'bg-[#2563EB] text-white',
      }))
    : [
        { designation: 'Current Position', dept: 'Current Department', unit: employee.unit || 'N/A', start: employee.joiningDate || 'N/A', end: 'Present', remark: 'Current', remarkStyle: 'bg-[#2563EB] text-white' },
      ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <History size={14} className="text-blue-500" />
          <h2 className="text-sm font-bold text-gray-800">Service History Log</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#1565C0] font-semibold bg-[#E3F2FD] px-4 py-2 rounded-xl">{history.length} Records</span>
          <button
            onClick={async () => {
              try {
                const res = await employeeAPI.exportEmployees();
                const url = URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.download = `employee-${employee.employeeId || employee._id || 'report'}-service-history.csv`;
                link.click();
                URL.revokeObjectURL(url);
                toast.success('Export complete');
              } catch (err) {
                toast.error('Export failed');
              }
            }}
            className="flex items-center gap-1 text-xs font-semibold border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={12} />
            Export CSV
          </button>
          <button
            onClick={() => toast.success('Add entry form will open')}
            className="flex items-center gap-1 text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={12} />
            Add Entry
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['DESIGNATION', 'UNIT', 'START DATE', 'END DATE', 'REMARKS'].map(h => (
                <th key={h}
                  className="text-left px-4 py-2.5 text-[9px] font-bold text-[#FFFFFFA6] tracking-wider"
                  style={{ background: 'linear-gradient(135deg, #1A6FC4, #0C355E)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-xs font-bold text-gray-900">{row.designation}</div>
                  <div className="text-[10px] text-gray-400">{row.dept}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                    <span className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">C</span>
                    {row.unit}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{row.start}</td>
                <td className="px-4 py-3">
                  {row.end === 'Present'
                    ? <span className="text-[10px] font-bold bg-[#00C8E0] text-white px-3 py-0.5 rounded-full">{row.end}</span>
                    : <span className="text-xs text-gray-600 whitespace-nowrap">{row.end}</span>
                  }
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${row.remarkStyle}`}>{row.remark}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-gray-100">
        <p className="text-[13px] text-[#7A8BA5]">Records are immutable. Corrections must be added as new entries with remarks.</p>
      </div>
    </div>
  );
}
