import React from 'react';
import { Triangle, Users, Clock, BarChart3 } from 'lucide-react';

export default function WorkforceShortageLiveStatus({ data }) {
  const d = data || {};
  const shortages = d.shortages || [];
  const attendanceUpdates = d.attendanceUpdates || [];
  const fieldPerformance = d.fieldPerformance || [];

  const latestAttendance = attendanceUpdates.length > 0
    ? attendanceUpdates[attendanceUpdates.length - 1]
    : { todayTotal: 0, late: 0 };

  const latestFieldPerf = fieldPerformance.length > 0
    ? fieldPerformance[fieldPerformance.length - 1]
    : null;

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-bold text-[#1e293b]">Workforce Shortage</h3>
          <p className="text-[10px] text-gray-500 mt-0.5">Live status</p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-sm">
          <Triangle size={16} strokeWidth={2.5} />
        </div>
      </div>

      {shortages.length > 0 ? (
        <div className="flex flex-col gap-2">
          {shortages.map((s, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] text-gray-700 font-semibold">{s.area || s.role || s.ge}</span>
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-gray-800">{s.current || 0}</span>
                  <span className="text-[10px] text-gray-400">/ {s.required || s.short || 0}</span>
                  {s.urgent && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">URGENT</span>}
                </div>
              </div>
              {i < shortages.length - 1 && <div className="w-full h-px bg-gray-100 my-1.5"></div>}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-[11px] text-gray-400 text-center py-4">No shortages reported</div>
      )}

      <div className="bg-gray-50/80 rounded-xl p-4 mt-1">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={14} className="text-[#3b82f6]" />
          <span className="text-[11px] font-bold text-[#1e293b]">Attendance Updates</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[20px] font-black text-[#1e293b]">{latestAttendance.todayTotal}</div>
            <div className="text-[9px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider">Today Total</div>
          </div>
          <div>
            <div className="text-[20px] font-black text-[#8b1a10]">{latestAttendance.late}</div>
            <div className="text-[9px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider">Late</div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50/80 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={14} className="text-[#3b82f6]" />
          <span className="text-[11px] font-bold text-[#1e293b]">Field Performance</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[20px] font-black text-[#1e293b]">{latestFieldPerf ? (latestFieldPerf.onField || latestFieldPerf.value || 0) : 0}</div>
            <div className="text-[9px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider">On Field</div>
          </div>
          <div>
            <div className="text-[20px] font-black text-[#059669]">{latestFieldPerf ? (latestFieldPerf.efficiencyPct || latestFieldPerf.pct || 0) : 0}%</div>
            <div className="text-[9px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider">Efficiency</div>
          </div>
        </div>
      </div>
    </div>
  );
}
