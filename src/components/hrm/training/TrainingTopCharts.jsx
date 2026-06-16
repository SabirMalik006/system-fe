import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#1a3a8f', '#60a5fa', '#bfdbfe'];

export default function TrainingTopCharts({ trendData, enrollmentData, categoryData, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border-2 border-[#2478B5] shadow-sm p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-48 mb-4" />
            <div className="h-[155px] bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const chartData = trendData && trendData.length > 0 ? trendData : [];

  const enrollData = enrollmentData ? [
    { name: 'Completed', value: enrollmentData.completed || 0, color: '#1a3a8f' },
    { name: 'Enrolled', value: enrollmentData.enrolled || 0, color: '#60a5fa' },
    { name: 'Absent', value: enrollmentData.absent || 0, color: '#bfdbfe' },
  ] : [];

  const totalEnroll = enrollmentData ? (enrollmentData.completed + enrollmentData.enrolled + enrollmentData.absent) : 0;
  const completionPct = totalEnroll > 0 ? Math.round((enrollmentData?.completed / totalEnroll) * 100) : 0;

  const pieChartData = enrollmentData ? [
    { value: enrollmentData.completed || 1, color: '#1a3a8f' },
    { value: (enrollmentData.enrolled || 0) - (enrollmentData.completed || 0) || 1, color: '#1E88E5' },
    { value: enrollmentData.absent || 1, color: '#0C3188' },
  ] : [{ value: 1, color: '#1a3a8f' }, { value: 1, color: '#1E88E5' }, { value: 1, color: '#0C3188' }];

  const programsByCategory = categoryData && categoryData.length > 0 ? categoryData : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

      {/* Training Completion Trend */}
      <div className="bg-white rounded-2xl border-2 border-[#2478B5] shadow-sm p-4">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-[13px] font-bold text-gray-900 leading-tight">
              Training Completion Trend
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Monthly enrolled vs completed {new Date().getFullYear()}
            </p>
          </div>
          <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md">LIV</span>
        </div>

        <div className="h-[155px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
              <defs>
                <linearGradient id="enrollGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#bfdbfe" stopOpacity={0.7} />
                  <stop offset="100%" stopColor="#bfdbfe" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a3a8f" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#1a3a8f" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 10 }} />
              <Area type="monotone" dataKey="enrolled" stroke="#93c5fd" strokeWidth={1.5} fill="url(#enrollGrad)" dot={false} />
              <Area type="monotone" dataKey="completed" stroke="#1a3a8f" strokeWidth={2} fill="url(#compGrad)" dot={false} />
              <Area type="monotone" dataKey="absent" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="4 3" fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center gap-4 mt-2">
          {[
            { color: '#93c5fd', label: 'Enrolled', dashed: false },
            { color: '#1a3a8f', label: 'Completed', dashed: false },
            { color: '#94a3b8', label: 'Absent', dashed: true },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-1">
              <svg width="16" height="6">
                <line x1="0" y1="3" x2="16" y2="3" stroke={l.color} strokeWidth={l.dashed ? 1.5 : 2} strokeDasharray={l.dashed ? '4 3' : undefined} />
              </svg>
              <span className="text-[9px] text-gray-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Enrollment Status */}
      <div className="bg-white rounded-2xl border-3 border-[#1E60AF] shadow-sm p-5">
        <h3 className="text-[13px] font-bold text-gray-900 leading-tight">Enrollment Status</h3>
        <p className="text-[10px] text-gray-400 mb-5">
          All programs {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>

        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0" style={{ width: 148, height: 148 }}>
            <PieChart width={148} height={148}>
              <Pie
                data={pieChartData}
                cx={70}
                cy={70}
                innerRadius={46}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {pieChartData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[22px] font-black text-gray-900 leading-none">{completionPct}%</span>
              <span className="text-[9px] text-gray-400 mt-0.5">Completion</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {enrollData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 border-2 border-[#2478B5] p-2 rounded-md">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <div>
                  <p className="text-[10px] text-gray-400 leading-none mb-0.5">{d.name}</p>
                  <p className="text-[18px] font-extrabold text-gray-900 leading-none">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs by Category */}
      <div
        className="rounded-2xl border border-gray-100 shadow-sm p-4"
        style={{ background: 'linear-gradient(135deg, #1E4D7B, #1E4D7B)' }}
      >
        <h3 className="text-[13px] font-bold text-white leading-tight">Programs by Category</h3>
        <p className="text-[10px] text-blue-200 mb-4">Participant enrollment count</p>

        <div className="flex flex-col gap-3.5">
          {programsByCategory.length === 0 ? (
            <p className="text-blue-200 text-[11px]">No data available</p>
          ) : (
            programsByCategory.map((p, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-blue-100 font-medium leading-tight truncate pr-2">
                    {p.label}
                  </span>
                  <span className="text-[11px] font-bold text-white flex-shrink-0">{p.count}</span>
                </div>
                <div className="h-1.5 bg-white rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: '#1A6FC4' }} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
