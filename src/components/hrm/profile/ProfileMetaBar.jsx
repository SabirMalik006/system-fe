import React from 'react';
import { User, Calendar, Edit3, Clock, History } from 'lucide-react';

export default function ProfileMetaBar({ employee = {} }) {
  const created = employee.createdAt ? new Date(employee.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A';
  const updated = employee.updatedAt ? new Date(employee.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';

  return (
    <div className="bg-white border-b border-gray-100 px-5 py-2 flex items-center gap-6 flex-wrap text-xs">
      <div className="flex items-center gap-1.5 text-gray-500">
        <User size={12} className="text-gray-400" />
        <span>Created by:</span>
        <span className="font-semibold text-[#1A6FC4]">System</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <Calendar size={12} className="text-gray-400" />
        <span>Created:</span>
        <span className="font-semibold text-[#1A6FC4]">{created}</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <Edit3 size={12} className="text-gray-400" />
        <span>Last Updated by:</span>
        <span className="font-semibold text-[#1A6FC4]">System</span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-500">
        <Clock size={12} className="text-gray-400" />
        <span>Last Updated:</span>
        <span className="font-semibold text-[#1A6FC4]">{updated}</span>
      </div>
      <button className="ml-auto flex items-center gap-1.5 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
        <History size={12} />
        View Change Log
      </button>
    </div>
  );
}
