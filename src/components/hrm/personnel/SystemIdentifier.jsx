import React from 'react';
import { FilePlus } from 'lucide-react';

export default function SystemIdentifier({ value, onChange }) {
  return (
    <div className="bg-gradient-to-r from-[#1A6FC4] via-[#2B5681] to-[#3793CE] rounded-md px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-md font-bold text-[#0F172A] tracking-widest uppercase">
          System Identifier
        </span>
        <button className="flex items-center bg-white gap-1.5 border border-white/40 text-[#2478B5] text-sm font-bold px-3 py-1 rounded-sm hover:bg-white/10 transition-colors tracking-wide">
          NEW RECORD
        </button>
      </div>
      <label className="block text-sm font-semibold text-white mb-1.5">
        Employee ID <span className="text-red-600">*</span>
      </label>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. EMP-4328"
        className="w-full bg-white rounded-md px-4 py-3 text-sm font-bold mt-2 text-[#6B7280] placeholder-gray-400 outline-none border-2 border-transparent focus:border-blue-300 transition-colors shadow-sm"
      />
    </div>
  );
}
