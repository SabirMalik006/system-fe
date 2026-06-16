import React, { useState, useEffect } from 'react';
import { ClipboardCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toolKitAPI } from '../../services/api';

export default function InspectionAlert() {
  const [pending, setPending] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    toolKitAPI.getKPIStats()
      .then(res => { if (res.data.success) setPending(res.data.data.pendingInspection); })
      .catch(() => {});
  }, []);

  if (pending === null || pending === 0) return null;

  return (
    <div className="mb-4 mx-4">
      <div className="bg-gradient-to-r from-[#1565c0] to-[#1a3a8f] rounded-xl shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <ClipboardCheck size={18} className="text-white" />
          </div>
          <div>
            <div className="text-white text-sm font-bold">{pending} Tool Kit{pending !== 1 ? 's' : ''} Pending Inspection</div>
            <div className="text-white/70 text-[11px]">Requires immediate attention</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/tools-inspection')}
          className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        >
          View <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
