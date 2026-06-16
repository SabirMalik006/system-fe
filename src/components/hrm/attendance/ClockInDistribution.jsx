import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function ClockInDistribution({ data }) {
  const chartData = data && data.length > 0 ? data.map(d => ({
    ...d,
    shade: Math.min(1, Math.max(0.2, (d.count || 0) / 350)),
  })) : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-full">
      <h3 className="text-[13px] font-bold text-gray-900">Clock-In Distribution</h3>
      <p className="text-[10px] text-gray-400 mb-3">Hourly employee check-ins today</p>
      <div className="h-[130px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: -32, bottom: 0 }} barSize={18}>
            <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 10 }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((d, i) => <Cell key={i} fill={`rgba(56,189,248,${d.shade || 0.5})`} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
