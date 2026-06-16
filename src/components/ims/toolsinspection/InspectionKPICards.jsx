import React from 'react';
import { Package, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const defaultCards = [
  { label: 'Total Assigned Kits', key: 'totalAssigned', icon: Package },
  { label: 'Pending Inspection', key: 'pendingInspection', icon: Clock },
  { label: 'Passed', key: 'passed', icon: CheckCircle },
  { label: 'Failed / Damaged', key: 'failed', icon: XCircle },
  { label: 'Due Today', key: 'dueToday', icon: AlertTriangle },
];

function Skeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="bg-gray-200 rounded-xl p-4 animate-pulse">
          <div className="w-8 h-8 bg-gray-300 rounded-lg mb-3" />
          <div className="h-3 bg-gray-300 rounded w-3/4 mb-2" />
          <div className="h-6 bg-gray-300 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function InspectionKPICards({ data, loading }) {
  if (loading) return <Skeleton />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {defaultCards.map((card, i) => {
        const Icon = card.icon;
        const value = data?.[card.key] ?? 0;
        const bg = i % 2 === 0 ? 'bg-[#1a3a8f]' : 'bg-[#1565c0]';
        return (
          <div key={card.key} className={`${bg} rounded-xl p-4 text-white`}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Icon size={14} className="text-white" />
              </div>
            </div>
            <div className="text-[13px] font-bold text-white/90 tracking-wider uppercase mb-1">{card.label}</div>
            <div className="text-2xl font-black leading-none text-white">{String(value).padStart(2, '0')}</div>
          </div>
        );
      })}
    </div>
  );
}
