import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function WorkingHoursAnalysis({ data }) {
  const chartData = data && data.length > 0 ? data : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full">
      <h3 className="text-[13px] font-bold text-gray-900">Working Hours Analysis</h3>
      <p className="text-[10px] text-gray-400 mb-3">Avg vs Overtime vs Late</p>
      <div className="h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -32, bottom: 0 }} barSize={12} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 10 }} />
            <Bar dataKey="regular"  fill="#bfdbfe" radius={[3, 3, 0, 0]} stackId="a" />
            <Bar dataKey="overtime" fill="#38bdf8" radius={[3, 3, 0, 0]} stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-blue-200 inline-block" />
          <span className="text-[9px] text-gray-400">Regular</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-sky-400 inline-block" />
          <span className="text-[9px] text-gray-400">Overtime</span>
        </div>
      </div>
    </div>
  );
}
