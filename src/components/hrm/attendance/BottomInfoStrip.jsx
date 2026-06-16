import React from "react";

export default function BottomInfoStrip({ pendingCount = 0 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-[13px] font-bold text-gray-900">Pending Approvals</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Leave and overtime requests awaiting manager review.</p>
        </div>
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 ml-4">
          {pendingCount}
        </span>
      </div>
      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm px-5 py-4">
        <p className="text-[13px] font-bold text-gray-900">Recent Activity</p>
        <p className="text-[11px] text-gray-400 mt-0.5">Latest check-ins, edits, and status changes across all departments.</p>
      </div>
    </div>
  );
}
