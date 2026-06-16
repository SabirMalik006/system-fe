import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function KPIStrip({ data }) {
  if (!data) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-xl p-4 min-h-[90px] animate-pulse" style={{ background: "linear-gradient(135deg,#1a3a8f 0%,#1565c0 100%)" }} />
        ))}
      </div>
    );
  }

  const kpis = [
    { label: "TOTAL EMPLOYEES", value: data.totalEmployees?.toLocaleString() || "0", sub: "Active workforce", badge: null },
    { label: "PRESENT TODAY", value: data.presentToday?.toLocaleString() || "0", sub: null, badge: { text: `${data.attendanceRate || 0}%`, up: true } },
    { label: "LATE ARRIVALS", value: data.lateToday?.toLocaleString() || "0", sub: null, badge: { text: `${data.lateToday && data.totalEmployees ? Math.round(data.lateToday / data.totalEmployees * 100) : 0}%`, up: false } },
    { label: "ABSENT", value: data.absentToday?.toLocaleString() || "0", sub: null, badge: { text: `${data.absentToday && data.totalEmployees ? Math.round(data.absentToday / data.totalEmployees * 100) : 0}%`, up: false } },
    { label: "ON LEAVE", value: data.onLeaveToday?.toLocaleString() || "0", sub: "Approved leaves", badge: null },
    { label: "AVG. WORK HRS", value: `${data.avgWorkHrs || "0"}h`, sub: null, badge: { text: `OT: ${data.overtimeHrs || "0"}h`, up: true } },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
      {kpis.map((k, i) => (
        <div
          key={i}
          className="rounded-xl p-4 flex flex-col justify-between min-h-[90px]"
          style={{ background: "linear-gradient(135deg,#1a3a8f 0%,#1565c0 100%)" }}
        >
          <p className="text-[9px] font-bold tracking-widest text-blue-200 uppercase">{k.label}</p>
          <p className="text-[26px] font-extrabold text-white leading-none mt-1">{k.value}</p>
          {k.sub && <p className="text-[10px] text-blue-200 mt-1">{k.sub}</p>}
          {k.badge && (
            <div className={`flex items-center gap-1 mt-1 w-fit px-1.5 py-0.5 rounded text-[10px] font-bold ${
              k.badge.up ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
            }`}>
              {k.badge.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {k.badge.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
