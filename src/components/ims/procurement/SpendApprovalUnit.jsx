import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { purchaseRequestAPI } from '../../../services/api';

const deptColors = { Plumbing: '#0891B2', Electrical: '#2166A0', Painting: '#2196F3', Carpentry: '#1152D4' };

export default function SpendApprovalUnit() {
  const [spendData, setSpendData] = useState([]);
  const [approvalData, setApprovalData] = useState([]);
  const [unitData, setUnitData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      purchaseRequestAPI.getAll(1, 1),
    ]).then(() => Promise.all([
      fetchSpend(),
      fetchApproval(),
      fetchUnits(),
    ])).catch(() => toast.error('Failed to load charts'))
    .finally(() => setLoading(false));
  }, []);

  const fetchSpend = async () => {
    try {
      const res = await purchaseRequestAPI.getAll(1, 1000);
      const requests = res.data.requests;
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const data = months.map((month, i) => {
        const row = { month };
        const monthReqs = requests.filter(r => new Date(r.createdAt).getMonth() === i);
        Object.keys(deptColors).forEach(dept => {
          const total = monthReqs.reduce((s, pr) => {
            return s + (pr.items || []).filter(item => item.category === dept).reduce((ss, it) => ss + it.qty * it.unitPrice, 0);
          }, 0);
          row[dept] = total > 0 ? Math.round(total / 1000) : 0;
        });
        return row;
      });
      setSpendData(data);
    } catch (e) { setSpendData([]); }
  };

  const fetchApproval = async () => {
    try {
      const res = await purchaseRequestAPI.getAll(1, 1000);
      const requests = res.data.requests;
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const data = months.map((month, i) => {
        const monthReqs = requests.filter(r => new Date(r.createdAt).getMonth() === i);
        const total = monthReqs.length;
        const approved = monthReqs.filter(r => r.status === 'Approved').length;
        const row = { month };
        Object.keys(deptColors).forEach(dept => {
          const deptReqs = monthReqs.filter(r => (r.items || []).some(i => i.category === dept));
          const deptApproved = deptReqs.filter(r => r.status === 'Approved').length;
          row[dept] = deptReqs.length > 0 ? Math.round(deptApproved / deptReqs.length * 100) : 60;
        });
        return row;
      });
      setApprovalData(data);
    } catch (e) { setApprovalData([]); }
  };

  const fetchUnits = async () => {
    try {
      const res = await purchaseRequestAPI.getAll(1, 1000);
      const requests = res.data.requests;
      const unitCount = {};
      requests.forEach(pr => {
        const unit = pr.requestingUnit || 'Unknown';
        unitCount[unit] = (unitCount[unit] || 0) + 1;
      });
      const sorted = Object.entries(unitCount).sort((a, b) => b[1] - a[1]).slice(0, 6);
      const maxVal = sorted.reduce((m, [,c]) => Math.max(m, c), 1);
      const colors = ['#2563EB', '#3B82F6', '#60A5FA', '#0891B2', '#1D4ED8', '#1E60AF'];
      setUnitData(sorted.map(([unit, value], i) => ({
        unit: unit.length > 18 ? unit.slice(0, 16) + '...' : unit,
        value,
        color: colors[i % colors.length],
        pct: Math.round(value / maxVal * 100),
      })));
    } catch (e) { setUnitData([]); }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-[280px] animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Spend by Department */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[#1A3A5C]">Spend by Department (Rsk)</h3>
          <button className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-700">6 Months</button>
        </div>
        <div className="flex items-center gap-3 flex-wrap mb-3">
          {Object.entries(deptColors).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-xs inline-block" style={{ background: v }} />
              <span className="text-[10px] text-gray-500">{k}</span>
            </div>
          ))}
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendData} barSize={8} barCategoryGap="25%" margin={{ top: 0, right: 0, left: -35, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d1d2" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#000' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#000' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }} />
              {Object.entries(deptColors).map(([key, color]) => (
                <Bar key={key} dataKey={key} fill={color} radius={[2, 2, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Approval Rate Trend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[#1A3A5C]">Approval Rate Trend</h3>
          <button className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-[#1A3A5C]">Per Dept %</button>
        </div>
        <div className="flex items-center gap-3 flex-wrap mb-3">
          {Object.entries(deptColors).map(([k, v]) => (
            <div key={k} className="flex items-center gap-1">
              <svg width="14" height="8"><line x1="0" y1="4" x2="14" y2="4" stroke={v} strokeWidth="2" /></svg>
              <span className="text-[10px] text-gray-500">{k}</span>
            </div>
          ))}
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={approvalData} margin={{ top: 0, right: 5, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#bfc1c4" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#000000' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#000000' }} axisLine={false} tickLine={false}
                domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }}
                formatter={(v) => [`${v}%`]} />
              {Object.entries(deptColors).map(([key, color]) => (
                <Line key={key} type="monotone" dataKey={key} stroke={color} strokeWidth={2}
                  dot={{ r: 3, fill: '#ffffff', stroke: color, strokeWidth: 2 }}
                  activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Requests by Unit */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#1A3A5C]">Requests by Unit</h3>
          <button className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-[#0E7490]">Top Units</button>
        </div>
        <div className="flex flex-col gap-2.5">
          {unitData.map((u, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-[#000000] font-base w-20 flex-shrink-0 truncate" title={u.unit}>{u.unit}</span>
              <div className="flex-1 h-5 bg-white rounded-sm overflow-hidden">
                <div className="h-full rounded-sm" style={{ width: `${u.pct}%`, background: u.color }} />
              </div>
              <span className="text-xs font-normal text-[#000000] w-6 text-right">{u.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
