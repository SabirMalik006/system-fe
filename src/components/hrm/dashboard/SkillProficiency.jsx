import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SkillProficiency({ data }) {
  if (!data) {
    return (
      <div className="bg-white rounded-[20px] p-5 shadow-sm animate-pulse">
        <div className="h-5 w-40 bg-gray-200 rounded mb-5"></div>
        <div className="h-[280px] bg-gray-100 rounded"></div>
      </div>
    );
  }

  const chartData = data.chartData || [];

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-bold text-[#1e293b]">Skill Proficiency</h3>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">Current vs target across key trades</p>
        </div>
      </div>
      <div className="h-[280px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <YAxis dataKey="skill" type="category" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                labelStyle={{ fontWeight: 700, fontSize: 12, color: '#1e293b' }}
              />
              <Bar dataKey="target" name="Target" fill="#93c5fd" radius={[0, 4, 4, 0]} barSize={12} />
              <Bar dataKey="current" name="Current" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-[13px] text-gray-400">No training data available</div>
        )}
      </div>
    </div>
  );
}
