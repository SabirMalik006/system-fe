import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Zap } from 'lucide-react';

const defaultCards = [
  { label: 'Total Requests', value: '0', badge: 'Last 6 Months', badgeStyle: 'bg-blue-500/30 text-blue-200', icon: Calendar, iconBg: 'bg-blue-500/30', bg: 'bg-[#1a3a8f]', trend: null },
  { label: 'Pending Approvals', value: '0', badge: null, badgeStyle: '', icon: Clock, iconBg: 'bg-orange-500/30', bg: 'bg-[#1a3a8f]', trend: null },
  { label: 'Approved Leaves', value: '0', badge: null, icon: CheckCircle, iconBg: 'bg-teal-500/20', bg: 'bg-[#1a3a8f]', trend: null, trendColor: 'text-teal-300' },
  { label: 'Rejected Requests', value: '0', badge: null, icon: XCircle, iconBg: 'bg-blue-400/20', bg: 'bg-[#1a3a8f]', trend: null },
  { label: 'Avg. Processing Time', value: '0 Days', valueSize: 'text-2xl', badge: null, icon: Zap, iconBg: 'bg-blue-300/20', bg: 'bg-[#1a3a8f]', trend: null },
];

export default function LeaveKPICards({ data }) {
  const d = data || {};
  const cards = [
    { ...defaultCards[0], value: d.totalRequests?.toLocaleString() || '0', badge: d.totalRequests ? 'Last 6 Months' : null },
    { ...defaultCards[1], value: d.pendingCount?.toString() || '0', badge: d.urgentCount > 0 ? `${d.urgentCount} URGENT` : null, badgeStyle: d.urgentCount > 0 ? 'bg-red-500 text-white' : 'bg-blue-500/30 text-blue-200' },
    { ...defaultCards[2], value: d.approvedCount?.toLocaleString() || '0', trend: d.trend || null },
    { ...defaultCards[3], value: d.rejectedCount?.toLocaleString() || '0' },
    { ...defaultCards[4], value: `${d.avgProcessingTime || '0'} Days` },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div key={i} className={`${card.bg} rounded-xl p-4 relative overflow-hidden`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`w-8 h-8 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <Icon size={15} className="text-white" />
              </div>
              <div className="text-right">
                {card.badge && <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${card.badgeStyle}`}>{card.badge}</span>}
                {card.trend && <span className={`text-[10px] font-bold ${card.trendColor}`}>{card.trend}</span>}
              </div>
            </div>
            <div className={`${card.valueSize || 'text-3xl'} font-black text-white leading-none mb-1`}>{card.value}</div>
            <div className="text-[11px] text-blue-200 font-medium">{card.label}</div>
          </div>
        );
      })}
    </div>
  );
}
