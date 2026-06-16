import React from 'react';
import {
  ComposedChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
      <div className="font-bold mb-1.5 text-gray-700">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: p.fill || p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function LeaveCharts({ data }) {
  const barData = data?.barData || [];
  const pieData = data?.pieData || [
    { name: 'Annual Leave', value: 0, color: '#1a3a8f' },
    { name: 'Sick Leave',   value: 0, color: '#3b82f6' },
    { name: 'Casual Leave', value: 0, color: '#93c5fd' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">Leave Request vs Approval</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {[
                { color: '#1a3a8f', label: 'Requested' },
                { color: '#60a5fa', label: 'Approved' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: l.color }} />
                  <span className="text-xs text-gray-500">{l.label}</span>
                </div>
              ))}
            </div>
            <button className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg">6 Months</button>
          </div>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={barData.length > 0 ? barData : [{ month: 'No data', requested: 0, approved: 0 }]} barGap={3} barCategoryGap="30%" margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
              <Bar dataKey="requested" name="Requested" fill="#1a3a8f" radius={[3,3,0,0]} barSize={18} />
              <Bar dataKey="approved"  name="Approved"  fill="#60a5fa" radius={[3,3,0,0]} barSize={18} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Leave Type Distribution</h3>
        <div className="flex justify-center mb-3">
          <PieChart width={170} height={170}>
            <Pie data={pieData} cx={80} cy={80} innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
              {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
            </Pie>
          </PieChart>
        </div>
        <div className="flex flex-col gap-2.5 mt-1">
          {pieData.map((d, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: d.color }} />
                <span className="text-xs text-gray-600">{d.name}</span>
              </div>
              <span className="text-xs font-bold text-gray-900">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
