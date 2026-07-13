import React from "react";
import { Briefcase, Calendar } from "lucide-react";

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors bg-white";
const labelCls = "block text-xs font-semibold text-gray-800 mb-1.5";

const empTypes = ["Permanent", "Contract", "Temporary"];
const empStatuses = ["Draft", "Active", "On Leave", "Suspended", "Terminated", "Retired"];
const cmesUnits = [
  "CMES ISB/LHR",
  "CMES COMPAK",
  "CMES ORMARA",
  "CMES COMLOG",
  "CMES COMCOAST",
  "CMES COMKAR",
];
const geAeOptions = [
  "GE SOUTH", "GE EAST", "GE KARSAZ", "AGE MANORA", "GE FLEET",
  "AGE MEHRAN", "GE TURBAT", "GE LOGISTIC", "GE MARIPUR", "GE GAWADAR",
  "GE EASTERN", "GE ORMARA", "GE ISLAMABAD", "GE LAHORE",
];

export default function ProfessionalInformation({ values = {}, onChange }) {
  const v = (f) => values[f] || '';
  const selType = values.employmentType || 'Permanent';
  const selStatus = values.employmentStatus || 'Active';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
        <div className="w-6 h-6 rounded flex items-center justify-center">
          <Briefcase size={16} className="text-blue-800" />
        </div>
        <h2 className="text-base font-semibold text-gray-900">Professional Information</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls}>Designation</label>
          <input placeholder="e.g. Senior Technician" className={inputCls}
            value={v('designation')} onChange={e => onChange('designation', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Trade</label>
          <input placeholder="e.g. B&R, E&M, F&S..." className={inputCls}
            value={v('trade')} onChange={e => onChange('trade', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls}>Employment Type</label>
          <div className="flex items-center gap-4 mt-1">
            {empTypes.map((t) => (
              <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                <div
                  onClick={() => onChange('employmentType', t)}
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                    selType === t ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-white"
                  }`}
                >
                  {selType === t && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-sm text-gray-700">{t}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Employment Status</label>
          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            {empStatuses.map((s) => (
              <button
                key={s}
                onClick={() => onChange('employmentStatus', s)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                  selStatus === s
                    ? "bg-[#1A6FC4] text-white"
                    : "bg-[#7FB3D34D] text-gray-800 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls}>Unit / Branch</label>
          <div className="relative">
            <select
              value={v('unit') || 'CMES ISB/LHR'}
              onChange={(e) => onChange('unit', e.target.value)}
              className={`${inputCls} appearance-none pr-8 cursor-pointer`}
            >
              {cmesUnits.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div>
          <label className={labelCls}>GEs/AEs</label>
          <div className="relative">
            <select
              value={v('geAe') || 'GE SOUTH'}
              onChange={(e) => onChange('geAe', e.target.value)}
              className={`${inputCls} appearance-none pr-8 cursor-pointer`}
            >
              {geAeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 4l4 4 4-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Joining Date</label>
          <div className="relative">
            <input type="date" className={`${inputCls} pr-10`}
              value={v('joiningDate')} onChange={e => onChange('joiningDate', e.target.value)} />
            <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
