import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { ChevronDown } from 'lucide-react';
import { stockInAPI } from '../../../services/api';
import GraphContainer from '../../common/GraphContainer';

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-lg text-xs">
      <div className="font-semibold mb-1">{label}</div>
      <div className="text-gray-500">Volume: <strong>{payload[0]?.value}</strong></div>
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
    if (categoryData.length === 0) return (
      <div className="flex flex-col items-center justify-center h-[250px] text-gray-400 text-xs italic">
        No category data found
      </div>
    );

    let startAngle = -90;
    const CX = 125, CY = 125, R_OUT = 105, R_IN = 70;
    const total = categoryData.reduce((sum, c) => sum + parseFloat(c.pct || 0), 0);
    const totalItems = categoryData.reduce((sum, c) => sum + (c.count || 0), 0);
    
    return (
      <div className="flex flex-col items-center">
        <svg width="250" height="250" viewBox="0 0 250 250">
          {categoryData.map((s, i) => {
            const sweep = (parseFloat(s.pct || 0) / total) * 360;
            const res = (
              <circle 
                key={i} 
                cx={CX} 
                cy={CY} 
                r={90} 
                fill="none" 
                stroke={s.color} 
                strokeWidth="30" 
                strokeDasharray={`${(sweep / 360) * 565} 565`} 
                strokeDashoffset={-((startAngle - 90) / 360) * 565} 
              />
            );
            startAngle += sweep;
            return res;
          })}
          <text x={CX} y={CY + 2} textAnchor="middle" fontSize="32" fontWeight="800" fill="#0f172a">{totalItems}</text>
          <text x={CX} y={CY + 22} textAnchor="middle" fontSize="10" fill="#0F172A" fontWeight={600}>TOTAL ITEMS</text>
        </svg>
      </div>
    );
  };

  return (
    <GraphContainer loading={loading} error={error} className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-[#2B8CEE] rounded flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="5" width="2" height="6" rx="0.5" fill="#2563eb"/>
              <rect x="5" y="3" width="2" height="8" rx="0.5" fill="#2563eb"/>
              <rect x="9" y="1" width="2" height="10" rx="0.5" fill="#2563eb"/>
            </svg>
          </div>
          <span className="text-[#2B8CEE] font-semibold text-md">Analytics & Insights</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">TIMEFRAME:</span>
          <button onClick={() => setDays(days === 7 ? 30 : 7)} 
            className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600">
            Last {days}
            <ChevronDown size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border border-[#2B8CEE] rounded-xl p-4 lg:col-span-2">
          <h3 className="font-bold text-[#0F172A] text-base">Goods Receipt Trend</h3>
          <div className="h-[220px] mt-4">
            {weekData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={weekData} margin={{ top: 10, right: 10, left: -30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Bar dataKey="volume" fill="#6B8CAE" radius={[6, 6, 0, 0]} barSize={34} />
                  <Line type="monotone" dataKey="volume" stroke="#1e3a5f" strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm italic">
                No receipt data for this period
              </div>
            )}
          </div>
        </div>

        <div className="border border-[#2B8CEE] rounded-xl p-4">
          <h3 className="font-bold text-gray-900 text-base">Category Distribution</h3>
          <CategoryDonut />
          <div className="mt-2 flex flex-col gap-2">
            {categoryData.map((c, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  <span className="text-sm font-semibold text-[#0EA5E9]">{c.label}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: c.color }}>{c.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GraphContainer>
  );
}