import React from 'react';
import { Briefcase } from 'lucide-react';

export default function ProfessionalEmployment({ employee = {} }) {
  const fields = [
    { label: 'DESIGNATION',          value: employee.designation || 'N/A' },
    { label: 'DATE OF APPOINTMENT',  value: employee.joiningDate || 'N/A' },
    { label: 'DATE OF PRESENT STATION', value: employee.joiningDate || 'N/A' },
    { label: 'DEPARTMENT',           value: employee.department || employee.trade || 'N/A' },
    { label: 'UNIT',                 value: employee.unit || 'N/A' },
    { label: 'DATE OF SUPER ANNUATION', value: 'N/A' },
    { label: 'SUPERVISOR',           value: 'N/A', isTag: true },
    { label: 'WORK MODE',            value: employee.employmentType || 'Permanent', isTag: true },
    { label: 'LOCATION',             value: employee.geAe || 'N/A' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
        <Briefcase size={14} className="text-blue-500" />
        <h2 className="text-sm font-bold text-gray-800">Professional Employment</h2>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {fields.map((f, i) => (
            <div key={i}>
              <div className="text-[9px] font-bold text-gray-400 tracking-widest uppercase mb-1">{f.label}</div>
              {f.isTag && f.label === 'WORK MODE' ? (
                <span className="inline-block text-xs font-semibold bg-blue-600 text-white px-3 py-1 rounded-lg">{f.value}</span>
              ) : f.isTag ? (
                <div className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-[8px] text-white font-black flex-shrink-0">GE</span>
                  <span className="text-sm font-semibold text-gray-800">{f.value}</span>
                </div>
              ) : (
                <div className="text-sm font-semibold text-gray-800">{f.value}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
