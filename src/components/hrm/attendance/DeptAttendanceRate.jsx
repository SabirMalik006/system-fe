import React from "react";

export default function DeptAttendanceRate({ data }) {
  const depts = data && data.length > 0 ? data : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full">
      <h3 className="text-[13px] font-bold text-gray-900">Dept. Attendance Rate</h3>
      <p className="text-[10px] text-gray-400 mb-4">Today's presence %</p>
      <div className="flex flex-col gap-3">
        {depts.length > 0 ? depts.map((d, i) => (
          <div key={i}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-gray-700 font-medium">{d.label}</span>
              <span className="text-[11px] font-bold text-gray-900">{d.pct}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${d.pct}%`, background: "linear-gradient(90deg,#1a3a8f,#38bdf8)" }}
              />
            </div>
          </div>
        )) : (
          <p className="text-[11px] text-gray-400 text-center py-4">No data available</p>
        )}
      </div>
    </div>
  );
}
