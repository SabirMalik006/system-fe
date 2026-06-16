import React from "react";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const colorMap = { 0: "bg-gray-300", 1: "bg-blue-800", 2: "bg-blue-400" };

export default function AttendanceHeatmap({ data }) {
  const weeks = data?.weeks || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full">
      <h3 className="text-[13px] font-bold text-gray-900 mb-3">
        Attendance Heatmap – {data?.month ? new Date(data.year || new Date().getFullYear(), data.month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </h3>

      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {days.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-bold text-gray-500">{d}</div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1.5">
            {week.map((val, di) => (
              <div key={di} className={`h-8 rounded-lg ${colorMap[val] || "bg-gray-100"}`} />
            ))}
          </div>
        ))}
        {weeks.length === 0 && (
          <div className="text-center text-[11px] text-gray-400 py-6">No data available</div>
        )}
      </div>

      <div className="flex items-center gap-3 mt-3">
        {[
          { color: "bg-gray-300", label: "Low"  },
          { color: "bg-blue-800", label: "Mid"  },
          { color: "bg-blue-400", label: "High" },
        ].map((l, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className={`w-3 h-3 rounded-sm inline-block ${l.color}`} />
            <span className="text-[9px] text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
