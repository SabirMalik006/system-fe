import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function LeaveVsApproval({ data }) {
  if (!data) {
    return (
      <div className="bg-white rounded-[20px] p-5 shadow-sm animate-pulse">
        <div className="h-5 w-48 bg-gray-200 rounded mb-5"></div>
        <div className="h-[280px] bg-gray-100 rounded"></div>
      </div>
    );
  }

  const chartData = Array.isArray(data) ? data : (data.chartData || data.leaveVsApproval || []);

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-[15px] font-bold text-[#1e293b]">Leave vs Approval Rate</h3>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">By department</p>
        </div>
      </div>
      <div className="h-[280px]">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#f1f5f9' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                labelStyle={{ fontWeight: 700, fontSize: 12, color: '#1e293b' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, fontWeight: 500 }} iconType="circle" iconSize={8} />
              <Line type="monotone" dataKey="requested" name="Requested" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3, fill: '#f59e0b' }} />
              <Line type="monotone" dataKey="approved" name="Approved" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3, fill: '#3b82f6' }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-[13px] text-gray-400">No leave data available</div>
        )}
      </div>
    </div>
  );
}
