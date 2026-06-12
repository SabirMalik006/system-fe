import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Info, TrendingDown, TrendingUp } from 'lucide-react';
import { incidentAPI } from '../../../services/api';

const TYPE_COLORS = {
  Tardiness: '#1a4fa0',
  Misconduct: '#3b82f6',
  Performance: '#60a5fa',
  Insubordination: '#f59e0b',
  Other: '#cbd5e1',
};

const SEVERITY_COLORS = {
  'Verbal Warning': '#22c55e',
  'Written Warning': '#f59e0b',
  'Final Warning': '#ef4444',
  Suspension: '#dc2626',
};

export default function IncidentCharts({ refreshKey }) {
  const [typeDist, setTypeDist] = useState({});
  const [trend, setTrend] = useState([]);
  const [severityDist, setSeverityDist] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      incidentAPI.getTypeDist(),
      incidentAPI.getMonthlyTrend(),
      incidentAPI.getSeverityDist(),
    ])
      .then(([typeRes, trendRes, sevRes]) => {
        if (!mounted) return;
        setTypeDist(typeRes.data.data);
        setTrend(trendRes.data.data);
        setSeverityDist(sevRes.data.data);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [refreshKey]);

  const totalType = Object.values(typeDist).reduce((a, b) => a + b, 0);
  const pieData = Object.entries(typeDist).map(([name, value]) => ({
    name,
    value,
    color: TYPE_COLORS[name] || '#cbd5e1',
  }));

  const totalSev = Object.values(severityDist).reduce((a, b) => a + b, 0);
  const sevData = Object.entries(severityDist).map(([name, value]) => ({
    name,
    value,
    color: SEVERITY_COLORS[name] || '#94a3b8',
    pct: totalSev ? Math.round((value / totalSev) * 100) : 0,
  }));

  const trendTotal = trend.reduce((a, b) => a + b.value, 0);
  const prevHalf = trend.slice(0, 3).reduce((a, b) => a + b.value, 0);
  const curHalf = trend.slice(3).reduce((a, b) => a + b.value, 0);
  const pctChange = prevHalf ? Math.round(((curHalf - prevHalf) / prevHalf) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Type Distribution (Donut) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800">Incident Type Distribution</h3>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <Info size={14} className="text-gray-400" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-[110px] h-[110px] flex-shrink-0">
            <PieChart width={110} height={110}>
              <Pie
                data={pieData}
                cx={50}
                cy={50}
                innerRadius={34}
                outerRadius={52}
                paddingAngle={2}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-xl font-black text-gray-900 leading-none">{totalType}</div>
              <div className="text-[9px] text-gray-400 font-medium">TOTAL</div>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {pieData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-gray-600">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-800">
                  {totalType ? Math.round((d.value / totalType) * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800">Incident Trends (6 Mo)</h3>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded ${
              pctChange >= 0 ? 'text-red-500 bg-red-50' : 'text-green-600 bg-green-50'
            }`}>
              {pctChange >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {pctChange >= 0 ? '+' : ''}{pctChange}%
            </span>
          </div>
        </div>

        <div className="h-[130px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={trend}
              barSize={24}
              margin={{ top: 5, right: 5, left: -30, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }}
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              />
              <Bar dataKey="value" name="Incidents" radius={[4, 4, 0, 0]}>
                {trend.map((entry, i) => (
                  <Cell key={i} fill={i === trend.length - 1 ? '#1d4ed8' : '#bfdbfe'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Severity Distribution (horizontal bar) */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800">Severity Distribution</h3>
        </div>
        <div className="flex flex-col gap-3">
          {sevData.map((d, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: d.color }} />
                  <span className="text-xs text-gray-600">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-800">{d.value}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{ width: `${d.pct}%`, background: d.color }}
                />
              </div>
            </div>
          ))}
          {!loading && sevData.every(d => d.value === 0) && (
            <p className="text-xs text-gray-400 text-center py-4">No data yet</p>
          )}
        </div>
      </div>

      {/* Full type distribution bar chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800">Incidents by Type</h3>
        </div>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pieData}
              layout="vertical"
              barSize={18}
              margin={{ top: 5, right: 20, left: 5, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }}
                cursor={{ fill: 'rgba(0,0,0,0.03)' }}
              />
              <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
