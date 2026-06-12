import React, { useState, useEffect } from 'react';
import { incidentAPI } from '../../../services/api';

export default function IncidentStatCards({ refreshKey }) {
  const [stats, setStats] = useState({ open: 0, closed: 0, escalated: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    incidentAPI.getKPIStats()
      .then(res => { if (mounted) setStats(res.data.data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [refreshKey]);

  const cards = [
    { label: 'OPEN CASES', value: stats.open, valueColor: 'text-gray-900', border: 'border-r border-gray-100' },
    { label: 'CLOSED', value: stats.closed, valueColor: 'text-gray-900', border: 'border-r border-gray-100' },
    { label: 'ESCALATED', value: stats.escalated, valueColor: 'text-red-500', border: '' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {cards.map((s, i) => (
          <div key={i} className="px-6 py-5 text-center">
            <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2">
              {s.label}
            </div>
            <div className={`text-4xl font-black leading-none ${s.valueColor}`}>
              {loading ? '-' : s.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
