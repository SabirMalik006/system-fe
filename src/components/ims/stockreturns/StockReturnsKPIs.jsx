import React, { useState, useEffect } from 'react';
import { RotateCcw, Clock, CheckSquare, XCircle, Zap } from 'lucide-react';
import { stockReturnAPI } from '../../../services/api';

export default function StockReturnsKPIs() {
  const [kpis, setKpis] = useState([
    { label: 'TOTAL RETURNS', value: '24', sub: '↗ 3 from last month', subColor: 'text-[#059669]', icon: RotateCcw },
    { label: 'PENDING POSTING', value: '3', sub: 'Awaiting confirmation', subColor: 'text-[#0F172A]', icon: Clock },
    { label: 'ITEMS RECOVERED', value: '142', sub: 'Units back in stock', subColor: 'text-[#1E4D7B]', icon: CheckSquare },
    { label: 'DAMAGED / DISPOSAL', value: '11', sub: 'Flagged for disposal', subColor: 'text-[#510208]', icon: XCircle },
    { label: 'AVG PROCESSING HRS', value: '142', sub: '↓ 0.3 hrs faster', subColor: 'text-[#1A6FC4]', icon: Zap },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      const response = await stockReturnAPI.getKPIs();
      const data = response.data.data;
      setKpis([
        { label: 'TOTAL RETURNS', value: data.totalReturns.value.toString(), sub: `${data.totalReturns.trend === 'up' ? '↗' : '↘'} ${Math.abs(data.totalReturns.change)} from last month`, subColor: 'text-[#059669]', icon: RotateCcw },
        { label: 'PENDING POSTING', value: data.pendingPosting.value.toString(), sub: data.pendingPosting.label, subColor: 'text-[#0F172A]', icon: Clock },
        { label: 'ITEMS RECOVERED', value: data.itemsRecovered.value.toString(), sub: data.itemsRecovered.label, subColor: 'text-[#1E4D7B]', icon: CheckSquare },
        { label: 'DAMAGED / DISPOSAL', value: data.damagedDisposal.value.toString(), sub: data.damagedDisposal.label, subColor: 'text-[#510208]', icon: XCircle },
        { label: 'AVG PROCESSING HRS', value: data.avgProcessingHours.value.toString(), sub: `${data.avgProcessingHours.trend === 'down' ? '↓' : '↑'} ${Math.abs(data.avgProcessingHours.change)} hrs faster`, subColor: 'text-[#1A6FC4]', icon: Zap },
      ]);
    } catch (error) {
      console.error('Failed to fetch KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 animate-pulse">
      {[...Array(5)].map((_, i) => <div key={i} className="bg-white rounded-xl h-28" />)}
    </div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {kpis.map((k, i) => {
        const Icon = k.icon;
        return (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#2563EB]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] sm:text-[12px] font-bold text-gray-400 uppercase">{k.label}</span>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-none mb-1.5">
              {k.value}
            </div>
            <div className={`text-[10px] sm:text-xs font-medium ${k.subColor}`}>{k.sub}</div>
          </div>
        );
      })}
    </div>
  );
}