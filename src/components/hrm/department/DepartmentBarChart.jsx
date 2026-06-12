import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../../../services/api';

const statusStyle = {
  Active: 'bg-[#3b82f6] text-white',
  'On Leave': 'bg-[#06b6d4] text-white',
  Suspended: 'bg-red-500 text-white',
  Terminated: 'bg-gray-500 text-white',
  Retired: 'bg-gray-400 text-white',
};

export default function DepartmentBarChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    employeeAPI.getDepartmentDist().then(({ data: res }) => {
      if (res.success) {
        const items = res.data.map(d => ({ label: d._id || 'Unassigned', count: d.count }));
        setData(items);
      }
    }).catch(() => {});
  }, []);

  if (data.length === 0) {
    return <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center text-gray-400 text-sm">No department data</div>;
  }

  const maxCount = Math.max(...data.map(d => d.count)) || 1;
  const barHeight = 28;
  const gap = 12;
  const totalHeight = data.length * (barHeight + gap) - gap;

  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <p className="text-[11px] font-bold text-gray-800 uppercase tracking-wide mb-4">Personnel by Department</p>
      <svg width="100%" height={totalHeight + 40} viewBox={`0 0 600 ${totalHeight + 40}`} preserveAspectRatio="xMidYMid meet">
        {data.map((d, i) => {
          const x = 0;
          const y = i * (barHeight + gap);
          const barW = (d.count / maxCount) * 400;
          return (
            <g key={i}>
              <text x={4} y={y + barHeight / 2 + 4} fontSize="11" fontWeight="600" fill="#334155">{d.label}</text>
              <rect x={130} y={y} width={barW} height={barHeight} rx="4" fill="#2563eb" opacity="0.8" />
              <text x={barW + 136} y={y + barHeight / 2 + 4} fontSize="11" fontWeight="700" fill="#475569">{d.count}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
