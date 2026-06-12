import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../../../services/api';

const kpiDefaults = [
  { icon: 'users', label: 'Total Employees', value: '0', sub: '~ Loading...', subColor: 'text-gray-100' },
  { icon: 'active', label: 'Active', value: '0', sub: 'Loading...', subColor: 'text-gray-300' },
  { icon: 'leave', label: 'On Leave', value: '0', sub: '~ Loading...', subColor: 'text-gray-100' },
  { icon: 'pending', label: 'Pending Updates', value: '0', sub: 'Loading...', subColor: 'text-gray-100' },
  { icon: 'suspended', label: 'Suspended', value: '0', sub: 'Loading...', subColor: 'text-gray-100' },
];

const icons = {
  users: (
    <svg className="w-5 h-5 text-[#244f77]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  active: (
    <svg className="w-5 h-5 text-[#244f77]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  leave: (
    <svg className="w-5 h-5 text-[#244f77]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  pending: (
    <svg className="w-5 h-5 text-[#244f77]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  suspended: (
    <svg className="w-5 h-5 text-[#244f77]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
};

export default function DepartmentKPICards() {
  const [kpiData, setKpiData] = useState(kpiDefaults);

  useEffect(() => {
    employeeAPI.getKPIStats().then(({ data }) => {
      if (data.success) {
        const d = data.data;
        setKpiData([
          { ...kpiDefaults[0], value: (d.totalEmployees || 0).toLocaleString(), sub: '~ +2.5%' },
          { ...kpiDefaults[1], value: (d.active || 0).toLocaleString(), sub: 'Stable parity' },
          { ...kpiDefaults[2], value: (d.onLeave || 0).toLocaleString(), sub: '~ -6.1%' },
          { ...kpiDefaults[3], value: (d.pendingUpdates || 0).toLocaleString(), sub: '1 High Priority' },
          { ...kpiDefaults[4], value: (d.suspended || 0).toLocaleString(), sub: 'Needs Review' },
        ]);
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {kpiData.map((kpi, i) => (
        <div key={i} className="bg-[#244a70] rounded-xl p-4 flex items-center gap-3 border border-[#325a81] shadow-sm">
          <div className="bg-white rounded-lg p-2.5 flex-shrink-0 shadow-sm">{icons[kpi.icon]}</div>
          <div>
            <p className="text-xs text-blue-100 font-medium leading-tight">{kpi.label}</p>
            <p className="text-xl font-bold text-white leading-tight mt-1">{kpi.value}</p>
            <p className={`text-[10px] font-medium mt-1 ${kpi.subColor}`}>{kpi.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
