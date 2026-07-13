import React, { useEffect } from "react";
import { ClipboardList, Calendar } from "lucide-react";

const inputCls =
  "w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors bg-white";
const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5";

function formatCnic(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 13);
  if (digits.length <= 5) return digits;
  if (digits.length <= 12) return digits.slice(0, 5) + '-' + digits.slice(5);
  return digits.slice(0, 5) + '-' + digits.slice(5, 12) + '-' + digits.slice(12);
}

export default function PersonalInformation({ values = {}, onChange }) {
  const v = (f) => values[f] || '';

  useEffect(() => {
    if (!values.gender && values.gender !== '') onChange('gender', '');
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
        <div className="w-5 h-5 rounded flex items-center justify-center">
          <ClipboardList className="text-blue-800" />
        </div>
        <h2 className="text-base font-semibold text-gray-900">
          Personal Information
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className={labelCls}>
            First Name <span className="text-red-400">*</span>
          </label>
          <input placeholder="e.g. Salar" className={inputCls}
            value={v('firstName')} onChange={e => onChange('firstName', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>
            Last Name <span className="text-red-400">*</span>
          </label>
          <input placeholder="e.g. Khan" className={inputCls}
            value={v('lastName')} onChange={e => onChange('lastName', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Date of Birth</label>
          <div className="relative">
            <input type="date" className={`${inputCls} pr-10`}
              value={v('dateOfBirth')} onChange={e => onChange('dateOfBirth', e.target.value)} />
            <Calendar size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className={labelCls}>Gender</label>
          <div className="relative">
            <select
              value={v('gender')}
              onChange={(e) => onChange('gender', e.target.value)}
              className={`${inputCls} appearance-none pr-8 cursor-pointer`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="12" height="12" viewBox="0 0 12 12" fill="none"
            >
              <path d="M2 4l4 4 4-4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div>
          <label className={labelCls}>
            CNIC / ID Number <span className="text-red-400">*</span>
          </label>
          <input placeholder="00000-0000000-0" maxLength={15} className={inputCls}
            value={v('cnic')} onChange={e => onChange('cnic', formatCnic(e.target.value))} />
        </div>
        <div>
          <label className={labelCls}>Phone Number</label>
          <input placeholder="+92 1904578484" className={inputCls}
            value={v('phone')} onChange={e => onChange('phone', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Email Address</label>
          <input type="email" placeholder="salarkhan@company.com" className={inputCls}
            value={v('email')} onChange={e => onChange('email', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>
            Emergency Contact (Name & Relationship)
          </label>
          <input placeholder="Zubair Khan (Brother) - +92 3457109357" className={inputCls}
            value={v('emergencyContact')} onChange={e => onChange('emergencyContact', e.target.value)} />
        </div>
      </div>
    </div>
  );
}
