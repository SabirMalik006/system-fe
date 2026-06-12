import React from 'react';
import { User } from 'lucide-react';

export default function PersonalInformation({ employee = {} }) {
  const fields = [
    { label: 'FULL NAME',      value: `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'N/A', col: 1 },
    { label: 'DATE OF BIRTH',  value: employee.dateOfBirth || 'N/A', col: 2 },
    { label: 'GENDER',         value: employee.gender ? employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1) : 'N/A', col: 1 },
    { label: 'CNIC / NATIONAL ID', value: employee.cnic || 'N/A', col: 2 },
    { label: 'PRIMARY PHONE',  value: employee.phone || 'N/A', col: 1 },
    { label: 'EMERGENCY CONTACT', value: employee.emergencyContact || 'N/A', col: 2 },
    { label: 'EMAIL ADDRESS',  value: employee.email || 'N/A', col: 'full' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
        <User size={14} className="text-blue-500" />
        <h2 className="text-sm font-bold text-gray-800">Personal Information</h2>
      </div>
     <div className="bg-gradient-to-br from-[#1565C0] to-[#0A2F5A] p-5">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {fields.filter(f => f.col !== 'full').map((f, i) => (
      <div key={i}>
        <div className="text-[12px] font-bold text-white tracking-widest uppercase mb-1">{f.label}</div>
        <div className="text-md font-semibold text-[#1E293B]">{f.value}</div>
      </div>
    ))}
    {fields.filter(f => f.col === 'full').map((f, i) => (
      <div key={i} className="sm:col-span-2">
        <div className="text-[12px] font-bold text-white tracking-widest uppercase mb-1">{f.label}</div>
        <div className="text-md font-semibold text-[#1E293B]">{f.value}</div>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}
