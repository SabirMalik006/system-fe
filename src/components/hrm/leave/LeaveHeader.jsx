import React from 'react';
import { Search, ChevronDown, Download } from 'lucide-react';
import { leaveAPI } from '../../../services/api';
import toast from 'react-hot-toast';

export default function LeaveHeader() {
  const handleExport = async () => {
    try {
      const res = await leaveAPI.exportLeaves();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `leaves_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Leaves exported');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-xl font-black text-gray-900 leading-tight">
          Leave Management – Reports &{' '}
          <span className="text-blue-600">Analytics</span>
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Track organizational leave trends
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 bg-[#1a3a8f] hover:bg-blue-900 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
        >
          <Download size={13} />
          <span className="leading-tight text-center">Export<br />Report</span>
        </button>
      </div>
    </div>
  );
}
