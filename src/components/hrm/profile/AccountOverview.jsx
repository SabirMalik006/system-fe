import React from 'react';
import { TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export default function AccountOverview({ employee = {} }) {
  const isActive = employee.employmentStatus === 'Active';
  const statusColor = isActive ? 'text-green-600' : 'text-red-500';
  const bgStatus = isActive ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="bg-[#1A6FC433] rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp size={18} className="text-[#1A6FC4]" />
        <h2 className="text-md font-bold text-[#1A6FC4]">Account Overview</h2>
      </div>

      <div className={`flex items-center justify-between p-2 rounded-lg mb-3 ${bgStatus}`}>
        <span className="text-sm text-[#1E293B]">Employment Status</span>
        <span className={`flex items-center gap-1 text-sm font-bold ${statusColor}`}>
          {isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
          {employee.employmentStatus || 'Active'}
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[#1E293B]">Remaining Leaves</span>
        <span className="text-sm font-bold text-[#2478B5]">14 Days</span>
      </div>

      <div className="mb-2">
        <div className="flex items-center justify-between text-xs mb-1 bg-[#1A6FC4] py-2.5 px-4 rounded-sm text-white">
          <span className="text-white text-sm">Healthcare</span>
          <span className="font-bold text-black text-sm">100%</span>
        </div>
      </div>

      {!isActive && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600 font-medium">
            This employee account is {employee.employmentStatus?.toLowerCase() || 'inactive'}
          </p>
        </div>
      )}
    </div>
  );
}
