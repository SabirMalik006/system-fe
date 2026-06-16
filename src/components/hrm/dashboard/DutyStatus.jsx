import React from 'react';
import { Shield } from 'lucide-react';

export default function DutyStatus({ data }) {
  if (!data) {
    return (
      <div className="bg-white rounded-[20px] p-5 shadow-sm animate-pulse">
        <div className="h-5 w-24 bg-gray-200 rounded mb-4"></div>
        <div className="h-[120px] w-[120px] bg-gray-200 rounded-full mx-auto mb-4"></div>
      </div>
    );
  }

  const statuses = data.statuses || [];
  const colors = ["#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"];
  const total = statuses.reduce((a, s) => a + (s.value || 0), 0);

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-[#1e293b]">Duty Status</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Personnel on site & off site</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-[#1e293b] text-white flex items-center justify-center shadow-sm">
          <Shield size={16} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex items-center justify-center my-2">
        <div className="relative w-[120px] h-[120px]">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3"
              strokeDasharray={`100 0`} strokeDashoffset="0" />
            {statuses.map((s, i) => {
              const pct = s.pct || 0;
              const offset = statuses.slice(0, i).reduce((a, x) => a + (x.pct || 0), 0);
              return (
                <circle key={i} cx="18" cy="18" r="15.915"
                  fill="none" stroke={colors[i % colors.length]}
                  strokeWidth="3"
                  strokeDasharray={`${Math.max(pct, 0.5)} ${Math.max(100 - pct, 0)}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-[22px] font-black text-[#1e293b]">{total}</div>
              <div className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Total</div>
            </div>
          </div>
        </div>
      </div>

      {statuses.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-1">
          {statuses.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: colors[i % colors.length] }}></div>
                <span className="text-[11px] text-gray-600 font-medium">{s.label || s.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-800">{s.value || 0}</span>
                <span className="text-[10px] text-gray-400">{s.pct || 0}%</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[11px] text-gray-400 text-center py-2">No attendance data for today</div>
      )}
    </div>
  );
}
