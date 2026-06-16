import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { transferAPI } from '../../../services/api';

export default function TransferKPICards({ refreshKey }) {
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, pending: 0, interUnitPct: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    transferAPI.getKPIStats()
      .then(res => { if (mounted) setStats(res.data.data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [refreshKey]);

  const cards = [
    {
      label: 'TOTAL TRANSFERS',
      value: loading ? '—' : stats.total.toLocaleString(),
      trend: '+12%',
      trendUp: true,
      bg: 'bg-[#274c77]',
    },
    {
      label: 'THIS MONTH',
      value: loading ? '—' : String(stats.thisMonth),
      sub: 'Current',
      bg: 'bg-[#274c77]',
    },
    {
      label: 'PENDING ORDERS',
      value: loading ? '—' : String(stats.pending),
      sub: 'Action Req.',
      bg: 'bg-[#274c77]',
    },
    {
      label: 'INTER-UNIT TRANSFERS',
      value: loading ? '—' : `${stats.interUnitPct}%`,
      sub: 'All Time',
      bg: 'bg-[#1a73e8]',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className={`${card.bg} rounded-xl p-5 text-white flex flex-col justify-between h-28 relative overflow-hidden shadow-md`}>
          <div>
            <div className="text-[10px] font-bold tracking-widest text-[#a8c6e8] uppercase mb-1">
              {card.label}
            </div>
            <div className="text-3xl font-bold">{card.value}</div>
          </div>
          {card.trend && (
            <div className={`absolute bottom-5 right-5 flex items-center gap-1 text-xs font-bold ${card.trendUp ? 'text-[#4cceac]' : 'text-red-400'}`}>
              {card.trend}
              {card.trendUp && <ArrowUp size={12} strokeWidth={3} />}
            </div>
          )}
          {card.sub && (
            <div className="absolute bottom-5 right-5 text-[10px] font-bold opacity-70 tracking-widest uppercase">
              {card.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
