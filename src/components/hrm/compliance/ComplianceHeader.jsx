import React from 'react';
import { Plus, Download } from 'lucide-react';
import { incidentAPI } from '../../../services/api';
import toast from 'react-hot-toast';

export default function ComplianceHeader({ onNewIncident }) {

  const handleExport = async () => {
    try {
      const res = await incidentAPI.exportIncidents();
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `incidents-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Export complete');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
          Compliance
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Track, manage, and record corporate disciplinary incidents
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
        >
          <Download size={13} />
          Export
        </button>
        <button
          onClick={onNewIncident}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors shadow-sm whitespace-nowrap"
        >
          <Plus size={14} />
          Record New Incident
        </button>
      </div>
    </div>
  );
}
