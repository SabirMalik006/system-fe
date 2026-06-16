import React from 'react';

const colors = ['#1a3a8f', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd'];

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = now - d;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days === 1 ? 'Yesterday' : `${days}d ago`;
}

export default function InspectionBottomStats({ deptStats, conditionSummary, recentActivity, loading }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* By Department */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Kits by Department</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : deptStats.length === 0 ? (
          <p className="text-xs text-gray-400">No data available</p>
        ) : (
          <div className="space-y-3">
            {deptStats.map((d, i) => (
              <div key={d.department}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{d.department}</span>
                  <span className="text-xs font-bold text-gray-800">{d.kits} kits</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${d.percentage}%`, background: colors[i % colors.length] }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Recent Activity</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : recentActivity.length === 0 ? (
          <p className="text-xs text-gray-400">No recent activity</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-gray-900">{a.kitId || a._id}</div>
                  <div className="text-[10px] text-gray-400">{a.employeeName} · {timeAgo(a.updatedAt)}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  a.status === 'Passed' ? 'bg-green-100 text-green-700' :
                  a.status === 'Failed' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Condition Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <h3 className="text-sm font-bold text-gray-800 mb-4">Condition Summary</h3>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : conditionSummary.length === 0 ? (
          <p className="text-xs text-gray-400">No data available</p>
        ) : (
          <div className="space-y-3">
            {conditionSummary.map((c, i) => (
              <div key={c.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                    <span className="text-xs text-gray-600">{c.label}</span>
                  </div>
                  <span className="text-xs font-bold text-gray-800">{c.value} kits</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${c.percentage}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
