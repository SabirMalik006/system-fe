import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const analyticsData = [
  { month: 'Jan', hires: 45, exits: 12 },
  { month: 'Feb', hires: 52, exits: 18 },
  { month: 'Mar', hires: 38, exits: 15 },
  { month: 'Apr', hires: 65, exits: 22 },
  { month: 'May', hires: 58, exits: 19 },
  { month: 'Jun', hires: 72, exits: 25 },
  { month: 'Jul', hires: 68, exits: 20 },
  { month: 'Aug', hires: 80, exits: 28 },
];

export default function AnalyticsSection() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-gray-800">Main Analytics Card Container</h2>
        <div className="flex items-center gap-3">
          {[{ color: '#1a3a8f', label: 'New Hires' }, { color: '#60a5fa', label: 'Exits' }].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: l.color }} />
              <span className="text-xs text-gray-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analyticsData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }} />
            <Line type="monotone" dataKey="hires" name="New Hires" stroke="#1a3a8f" strokeWidth={2.5}
              dot={{ r: 3, fill: '#fff', stroke: '#1a3a8f', strokeWidth: 2 }} />
            <Line type="monotone" dataKey="exits" name="Exits" stroke="#60a5fa" strokeWidth={2}
              dot={false} strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
