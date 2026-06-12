import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ComplianceHeader() {
  const navigate = useNavigate();

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
      <button
        onClick={() => navigate('/compliance/new')}
        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm flex-shrink-0"
      >
        <Plus size={15} />
        Record New Incident
      </button>
    </div>
  );
}
