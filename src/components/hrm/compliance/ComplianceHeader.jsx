import React from 'react';
import { Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { incidentAPI } from '../../../services/api';
import toast from 'react-hot-toast';

export default function ComplianceHeader() {
  const navigate = useNavigate();

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
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
          Compliance
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track, manage, and record corporate disciplinary incidents
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 border border-gray-300 bg-white text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download size={14} />
          Export
        </button>
        <button
          onClick={() => navigate('/compliance/new')}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm flex-shrink-0"
        >
          <Plus size={15} />
          Record New Incident
        </button>
      </div>
    </div>
  );
}
