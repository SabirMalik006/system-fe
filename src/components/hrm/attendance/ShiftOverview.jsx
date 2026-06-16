import React from "react";
import { Sun, Cloud, Moon } from "lucide-react";

const shiftConfig = [
  { icon: Sun,   label: "Morning Shift", time: "07:00 – 15:00", key: "Morning", iconBg: "bg-yellow-400/20", iconColor: "text-yellow-300" },
  { icon: Cloud, label: "General Shift", time: "09:00 – 17:00", key: "General", iconBg: "bg-blue-300/20",   iconColor: "text-blue-200"   },
  { icon: Moon,  label: "Night Shift",   time: "22:00 – 06:00", key: "Night",   iconBg: "bg-indigo-400/20", iconColor: "text-indigo-200" },
];

export default function ShiftOverview({ data }) {
  const shifts = data?.shifts || {};
  const overtimeHrs = data?.overtimeHrs || 0;
  const lateMinutes = data?.lateMinutes || 0;

  return (
    <div className="rounded-2xl p-4 h-full flex flex-col gap-3"
      style={{ background: "linear-gradient(135deg,#1a3a8f,#1565c0)" }}>
      <h3 className="text-[13px] font-bold text-white">Shift Overview</h3>

      <div className="flex flex-col gap-2">
        {shiftConfig.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2.5">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                  <Icon size={15} className={s.iconColor} />
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white leading-tight">{s.label}</p>
                  <p className="text-[10px] text-blue-200">{s.time}</p>
                </div>
              </div>
              <span className="text-[12px] font-bold text-white bg-white/20 px-2.5 py-0.5 rounded-full">
                {shifts[s.key] || 0}
              </span>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="bg-white/10 rounded-xl px-3 py-2">
          <p className="text-[18px] font-extrabold text-white leading-none">{overtimeHrs}</p>
          <p className="text-[9px] text-blue-200 mt-0.5">Overtime hrs this month</p>
        </div>
        <div className="bg-white/10 rounded-xl px-3 py-2">
          <p className="text-[18px] font-extrabold text-white leading-none">{lateMinutes?.toLocaleString()}</p>
          <p className="text-[9px] text-blue-200 mt-0.5">Late minutes total</p>
        </div>
      </div>
    </div>
  );
}
