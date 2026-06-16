import React from 'react';
import { Users, UserCheck, CheckSquare, Briefcase, Triangle } from 'lucide-react';

export default function HrmKPICards({ data }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-[#224467] rounded-xl p-5 text-white animate-pulse">
            <div className="h-4 w-24 bg-white/20 rounded mb-4"></div>
            <div className="h-8 w-16 bg-white/20 rounded mb-2"></div>
            <div className="h-3 w-20 bg-white/20 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const {
    totalEmployees = 0,
    activeEmployees = 0,
    activePct = 0,
    trainingParticipationPct = 0,
    disciplinaryCases = 0,
    criticalCount = 0,
    urgentLeaves = 0,
  } = data;

  const kpis = [
    { label: 'TOTAL EMPLOYEES', value: totalEmployees.toLocaleString(), sub: 'Available', icon: Users },
    { label: 'ACTIVE PERSONNEL', value: activeEmployees.toLocaleString(), badge: `${activePct}% Active`, icon: UserCheck },
    { label: "WORKFORCE KPI'S", value: '5', badge: `▼ ${urgentLeaves} URGENT`, icon: CheckSquare },
    { label: 'TRAINING PARTICIPATION', value: `${trainingParticipationPct}%`, badge: 'Status: Stable', icon: Briefcase },
    { label: 'DISCIPLINARY CASES', value: disciplinaryCases.toString(), badge: `▼ ${criticalCount} CRITICAL`, icon: Triangle, hasLightning: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {kpis.map((k, i) => {
        const Icon = k.icon;
        return (
          <div key={i} className="relative overflow-hidden bg-[#224467] rounded-xl p-5 text-white shadow-sm border border-[#1e3b5e]">
            {k.hasLightning && (
               <svg className="absolute right-[-10%] top-[-10%] h-[120%] text-white/[0.04] rotate-12" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
               </svg>
            )}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="text-[10px] font-bold text-blue-100 tracking-wider uppercase">{k.label}</div>
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Icon size={14} className="text-[#224467]" />
                </div>
              </div>
              <div className="text-[28px] font-black leading-none mb-1 text-white">{k.value}</div>
              {k.sub && <div className="text-[10px] text-[#93c5fd] font-medium tracking-wide mt-2 uppercase">{k.sub}</div>}
              {k.badge && <div className="flex items-center gap-1 text-[10px] font-medium text-[#93c5fd] mt-2 uppercase tracking-wide">{k.badge}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
