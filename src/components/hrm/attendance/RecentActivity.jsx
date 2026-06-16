import React from "react";

export default function RecentActivity({ data }) {
  const activities = data && data.length > 0 ? data : [];

  return (
    <div className="bg-white rounded-2xl border border-blue-200 shadow-sm p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[13px] font-bold text-gray-900">Recent Activity</h3>
        <span className="text-[10px] text-gray-400">Today's log</span>
      </div>
      <div className="flex flex-col gap-3">
        {activities.length > 0 ? activities.map((a, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${a.dotColor || 'bg-blue-600'}`} />
            <div>
              <p className="text-[11px] font-medium text-gray-800 leading-snug">{a.name}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{a.meta}</p>
            </div>
          </div>
        )) : (
          <p className="text-[11px] text-gray-400 text-center py-4">No recent activity</p>
        )}
      </div>
    </div>
  );
}
