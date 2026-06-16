import React from 'react';
import { Users, MoreHorizontal } from 'lucide-react';

export default function MesPersonnel({ data }) {
  if (!data) {
    return (
      <div className="bg-white rounded-[20px] shadow-sm flex flex-col h-[340px] animate-pulse">
        <div className="px-5 pt-5 pb-3">
          <div className="h-16 w-48 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  const personnel = data.personnel || [];
  const totalCount = data.totalCount || data.total || 0;

  const statusColors = {
    active: { dot: "#10b981", bg: "#ecfdf5", text: "On Site" },
    away: { dot: "#f59e0b", bg: "#fffbeb", text: "Away" },
    inactive: { dot: "#94a3b8", bg: "#f8fafc", text: "Offline" },
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm flex flex-col h-[340px]">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-sm">
              <Users size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1e293b]">MES Personnel</h3>
              <p className="text-[10px] text-gray-400 font-medium">{totalCount} total</p>
            </div>
          </div>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex mb-2 gap-1.5">
          {['All', 'Online', 'Away', 'Offline'].map((f, i) => (
            <button key={i}
              className={`text-[9px] font-bold px-3 py-1.5 rounded-lg transition-colors ${i === 0 ? 'bg-[#1e293b] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-1">
        {personnel.length > 0 ? personnel.slice(0, 8).map((p, i) => {
          const status = statusColors[p.status] || statusColors.inactive;
          return (
            <div key={i} className="flex items-center justify-between py-2 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-[#3b82f6] text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
                    {p.avatar
                      ? <img src={p.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                      : (p.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || p.role?.slice(0, 2) || '??')}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ backgroundColor: status.dot }}></div>
                </div>
                <div>
                  <div className="text-[12px] font-bold text-[#1e293b]">{p.name}</div>
                  <div className="text-[9px] text-gray-400 font-medium">{p.role}</div>
                  {p.count > 0 && <div className="text-[9px] text-gray-400">{p.count} employees</div>}
                </div>
              </div>
              <div className="text-[9px] font-bold px-2 py-1 rounded-full" style={{ backgroundColor: status.bg, color: status.dot }}>
                {status.text}
              </div>
            </div>
          );
        }) : (
          <div className="text-[11px] text-gray-400 text-center py-8">No MES personnel data</div>
        )}
      </div>
    </div>
  );
}
