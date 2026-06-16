import React from 'react';

export default function ProfileKPICards({ employee = {} }) {
  const tenure = employee.joiningDate
    ? Math.floor((Date.now() - new Date(employee.joiningDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) + ' yr'
    : 'N/A';

  const rating = employee.rating || 0;
  const tasksCompleted = rating > 0 ? Math.round(rating * 7.2) : '—';
  const utilization = rating > 0 ? Math.min(100, Math.round(rating * 9.5 + 10)) + '%' : '—';

  const stats = [
    { value: tasksCompleted, label: 'Tasks Completed', bg: 'bg-gradient-to-br from-[#1A6FC4] to-[#0C355E]' },
    { value: '—', label: 'Tasks Overdue', bg: 'bg-gradient-to-br from-[#1A6FC4] to-[#0C355E]' },
    { value: utilization, label: 'Utilization', bg: 'bg-gradient-to-br from-[#1A6FC4] to-[#0C355E]' },
    { value: tenure, label: 'Tenure', bg: 'bg-gradient-to-br from-[#1A6FC4] to-[#0C355E]' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-12">
      {stats.map((s, i) => (
        <div key={i} className={`${s.bg} rounded-xl px-6 py-4 text-white`}>
          <div className="text-4xl font-medium leading-none mb-1">{s.value}</div>
          <div className="text-md font-medium text-white">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
