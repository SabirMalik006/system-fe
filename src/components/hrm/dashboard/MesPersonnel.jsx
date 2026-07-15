import React from 'react';
import { Users, ChevronRight } from 'lucide-react';

export default function MesPersonnel({ data }) {
  if (!data) {
    return (
      <div className="bg-white rounded-[20px] shadow-sm flex flex-col h-[480px] animate-pulse">
        <div className="px-5 pt-5 pb-3">
          <div className="h-6 w-40 bg-gray-200 rounded mb-3"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const units = data.units || [
    { name: 'DW&CE', percentage: 7.51 },
    { name: 'CMES COMCOAST', percentage: 41.38 },
    { name: 'CMES COMKAR', percentage: 15.85 },
    { name: 'CMES COMLOG', percentage: 12.20 },
    { name: 'CME COMPAK', percentage: 12.20 },
    { name: 'CME ISLD / LHR', percentage: 14.82 },
    { name: 'CMES ORMARA', percentage: 8.24 },
  ];

  const onDuty = data.onDuty ?? 0;
  const standbyStaff = data.standbyStaff ?? 0;

  const barColors = [
    'bg-[#3b82f6]',
    'bg-[#1e40af]',
    'bg-[#2563eb]',
    'bg-[#60a5fa]',
    'bg-[#1d4ed8]',
    'bg-[#93c5fd]',
    'bg-[#3b82f6]',
  ];

  const maxPct = Math.max(...units.map(u => u.percentage || 0), 1);

  return (
    <div className="bg-white rounded-[20px] shadow-sm flex flex-col h-[480px]">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-sm">
              <Users size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1e293b]">MES Personnel</h3>
              <p className="text-[10px] text-gray-400 font-medium">Last 30 Days</p>
            </div>
          </div>
        </div>

        <div className="mt-3 mb-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Headquarter</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-3 space-y-2.5">
        {units.map((unit, i) => (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-[#1e293b]">{unit.name}</span>
              <span className="text-[10px] font-bold text-gray-500">{unit.percentage || 0}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${barColors[i % barColors.length]}`}
                style={{ width: `${((unit.percentage || 0) / maxPct) * 100}%` }}
              />
            </div>
            <span className="text-[9px] text-gray-400 font-medium">Workforce</span>
          </div>
        ))}
      </div>

      <div className="px-5 pb-4 pt-2 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-[#ecfdf5] rounded-xl px-3 py-2.5 text-center">
            <p className="text-[18px] font-black text-[#059669]">{onDuty}</p>
            <p className="text-[9px] font-bold text-[#059669] uppercase tracking-wider">On Duty</p>
          </div>
          <div className="bg-[#fffbeb] rounded-xl px-3 py-2.5 text-center">
            <p className="text-[18px] font-black text-[#d97706]">{standbyStaff}</p>
            <p className="text-[9px] font-bold text-[#d97706] uppercase tracking-wider">Standby Staff</p>
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#3b82f6] hover:text-[#1d4ed8] transition-colors py-1">
          View Personnel Details
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
