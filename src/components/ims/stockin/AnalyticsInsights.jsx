import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { stockInAPI } from '../../../services/api';
import GraphContainer from '../../common/GraphContainer';

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#D7E6F8] rounded-xl p-3 shadow-lg text-xs">
      <div className="font-bold text-[#0F172A] text-sm mb-1.5">{label}</div>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-sm bg-[#1A8FA0]" />
        <span className="text-[#475569]">Receipt Volume: <strong className="text-[#0F172A]">{payload[0]?.value}</strong></span>
      </div>
      <div className="mt-1.5 pt-1.5 border-t border-gray-100">
        <span className="text-[#94a3b8]">Trend: </span>
        <span className="text-[#0B4E89] font-semibold">{payload[0]?.value} units</span>
      </div>
    </div>
  );
};

export default function AnalyticsInsights() {
  const [trendData, setTrendData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchData();
  }, [days]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [trendRes, categoryRes] = await Promise.all([
        stockInAPI.getTrend(days),
        stockInAPI.getCategoryDistribution()
      ]);
      
      setTrendData(trendRes.data.data || []);
      setCategoryData(categoryRes.data.categories || []);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setError("Unable to connect to inventory analytics service.");
    } finally {
      setLoading(false);
    }
  };

  const weekData = trendData;

  const CategoryDonut = () => {
    if (!categoryData || categoryData.length === 0) return (
      <div className="flex flex-col items-center justify-center h-[220px] text-gray-400 text-xs italic">
        No category data found
      </div>
    );

    const total = categoryData.reduce((sum, c) => sum + (c.count || 0), 0);
    const CX = 110, CY = 110, r = 80, stroke = 24;
    const circumference = 2 * Math.PI * r;

    let cumulativePct = 0;

    return (
      <div className="flex flex-col items-center justify-center relative my-2">
        <svg width="220" height="220" viewBox="0 0 220 220">
          {categoryData.map((s, i) => {
            const count = s.count || 0;
            const pct = total > 0 ? count / total : 0;
            const dash = pct * circumference;
            // Subtract small gap between segments for clear visual separation
            const segmentDash = Math.max(0, dash - 3);
            const gap = circumference - segmentDash;
            const rotation = cumulativePct * 360 - 90;
            cumulativePct += pct;

            return (
              <circle
                key={i}
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={`${segmentDash} ${gap}`}
                transform={`rotate(${rotation} ${CX} ${CY})`}
                className="transition-all duration-300 hover:opacity-80 hover:stroke-[28] cursor-pointer"
              >
                <title>{`${s.label}: ${count} items (${Math.round(pct * 100)}%)`}</title>
              </circle>
            );
          })}
          {/* Center White Circle */}
          <circle cx={CX} cy={CY} r={r - stroke / 2 - 3} fill="white" className="drop-shadow-sm" />

          <text x={CX} y={CY - 2} textAnchor="middle" fontSize="28" fontWeight="800" fill="#0F172A">
            {total}
          </text>
          <text x={CX} y={CY + 18} textAnchor="middle" fontSize="9" fill="#1A8FA0" fontWeight={700} letterSpacing="0.08em">
            TOTAL ITEMS
          </text>
        </svg>
      </div>
    );
  };

  return (
    <GraphContainer loading={loading} error={error} className="p-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-[#2B8CEE] rounded flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="5" width="2" height="6" rx="0.5" fill="#2563eb"/>
              <rect x="5" y="3" width="2" height="8" rx="0.5" fill="#2563eb"/>
              <rect x="9" y="1" width="2" height="10" rx="0.5" fill="#2563eb"/>
            </svg>
          </div>
          <span className="text-[#1E6BB8] font-semibold text-md">Analytics & Insights</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">TIMEFRAME:</span>
          <button onClick={() => setDays(days === 7 ? 30 : 7)} 
            className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700">
            Last {days}
            <ChevronDown size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="border border-[#2B8CEE] rounded-xl p-4 lg:col-span-2 flex flex-col">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-5 bg-[#1A8FA0] rounded-full" />
            <h3 className="font-extrabold text-[#0F172A] text-lg tracking-tight">Goods Receipt Trend</h3>
          </div>
          <div className="flex-1 min-h-0">
            {weekData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weekData} margin={{ top: 10, right: 10, left: -15, bottom: 5 }}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1A8FA0" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#1A8FA0" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8f1f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} width={35} />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(26,143,160,0.06)' }} />
                  <Bar dataKey="volume" fill="url(#barGrad)" radius={[4, 4, 0, 0]} barSize={32} />
                  <Line type="monotone" dataKey="volume" stroke="#0B4E89" strokeWidth={2.5} dot={{ r: 3, fill: '#0B4E89', strokeWidth: 1, stroke: '#fff' }} activeDot={{ r: 5, fill: '#0B4E89', strokeWidth: 2, stroke: '#fff' }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
                No receipt data for this period
              </div>
            )}
          </div>
        </div>

        <div className="border border-[#2B8CEE] rounded-xl p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[#0F172A] text-base mb-1">Category Distribution</h3>
            <CategoryDonut />
          </div>
          <div className="mt-2 flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
            {categoryData.map((c, i) => {
              const total = categoryData.reduce((sum, item) => sum + (item.count || 0), 0);
              const pct = c.pct !== undefined ? c.pct : (total > 0 ? Math.round((c.count / total) * 100) : 0);
              return (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-2 rounded-lg border border-gray-100 bg-gray-50/60 hover:bg-white hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span 
                      className="w-3.5 h-3.5 rounded-full flex-shrink-0 shadow-xs border border-white" 
                      style={{ background: c.color }} 
                    />
                    <span className="text-xs font-bold text-[#1E293B]">{c.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#475569]">{c.count} items</span>
                    <span 
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white shadow-xs"
                      style={{ background: c.color }}
                    >
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GraphContainer>
  );
}