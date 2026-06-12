import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function SystemAccount({ value = false, onChange }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2478B5] rounded-xl flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">System Account</div>
            <div className="text-xs text-gray-400 mt-0.5">Provision a User account for this personnel member.</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 font-medium">
            {value ? 'Enabled' : 'Disabled'}
          </span>
          <button
            onClick={() => onChange(!value)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
              value ? 'bg-blue-600' : 'bg-[#64748B]'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                value ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
