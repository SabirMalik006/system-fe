import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { purchaseRequestAPI } from '../../../services/api';

const deptColors = ['#0891B2', '#2196F3', '#1A3A5C', '#1565C0', '#7C3AED', '#059669'];
const statusColors = { Approved: '#1A8FA0', Pending: '#1565C0', Rejected: '#640404', Draft: '#9CA3AF', Processing: '#F59E0B' };

export default function ProcurementCharts() {
  const [volumeData, setVolumeData] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      purchaseRequestAPI.getMonthlyTrend(new Date().getFullYear()),
      purchaseRequestAPI.getAll(1, 1),
    ]).then(([trendRes, _]) => {
      setVolumeData(trendRes.data.data);
    }).catch(() => toast.error('Failed to load volume trend'));

    purchaseRequestAPI.getAll(1, 1000)
      .then(res => {
        const reqs = res.data.requests;
        const total = res.data.pagination.total;
        setTotalRequests(total);

        const catCount = {};
        reqs.forEach(pr => {
          (pr.items || []).forEach(item => {
            catCount[item.category] = (catCount[item.category] || 0) + 1;
          });
        });
        const cats = Object.entries(catCount).sort((a, b) => b[1] - a[1]);
        const maxVal = cats.reduce((m, [,c]) => Math.max(m, c), 1);
        setDeptData(cats.slice(0, 6).map(([name, value], i) => ({
          name,
          value,
          pct: `${Math.round(value / total * 100)}%`,
          color: deptColors[i % deptColors.length],
        })));
      })
      .catch(() => toast.error('Failed to load dept data'));

    purchaseRequestAPI.getAll(1, 1)
      .then(() => purchaseRequestAPI.getKPIs())
      .then(res => {
        const d = res.data.data;
        setStatusData(Object.entries(statusColors).map(([name, color]) => ({
          name,
          value: d[name.toLowerCase()] || 0,
          color,
        })).filter(s => s.value > 0));
      })
      .catch(() => {});

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[1,2,3].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 h-[260px] animate-pulse" />)}
      </div>
    );
  }

  const totalDeptValue = deptData.reduce((s, d) => s + d.value, 0) || 1;
  const approvedCount = statusData.find(s => s.name === 'Approved')?.value || 0;
  const approvalPct = totalRequests > 0 ? Math.round(approvedCount / totalRequests * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Procurement Volume & PO Value */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#1A3A5C]">Procurement Volume & PO Value</h3>
          <div className="flex items-center gap-1.5">
            <button className="text-[10px] font-medium px-3 py-1 rounded-md bg-blue-100 text-blue-700">Volume</button>
            <button className="text-[10px] font-medium px-3 py-1 rounded-md bg-[#1A3A5C4D] text-[#1A3A5C]">PO Value</button>
          </div>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-[#2563EB] inline-block" />
            <span className="text-xs text-gray-500">Requests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="16" height="8"><line x1="0" y1="4" x2="16" y2="4" stroke="#1e40af" strokeWidth="2"/></svg>
            <span className="text-xs text-gray-500">PO Value (Rsk)</span>
          </div>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={volumeData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }} barCategoryGap="20%">
              <defs>
                <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3973f0" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#227cf3" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#dadfe3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#000000' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#000000' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }} />
              <Bar dataKey="requests" fill="url(#volGrad)" radius={[3, 3, 0, 0]} barSize={22} />
              <Line type="monotone" dataKey="value" stroke="#1e40af" strokeWidth={2}
                dot={{ r: 4, fill: '#fff', stroke: '#1e40af', strokeWidth: 2.5 }}
                activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Requests by Department */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-semibold text-[#1A3A5C]">Requests by Department</h3>
          <button className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-[#C1DDF8] text-white">This Year</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-[120px] h-[120px] flex-shrink-0">
            {deptData.length > 0 ? (
              <>
                <PieChart width={120} height={120}>
                  <Pie data={deptData} cx={55} cy={55} innerRadius={38} outerRadius={58} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                    {deptData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-xl font-base text-[#1A3A5C] leading-none">{totalRequests}</div>
                  <div className="text-[9px] text-gray-400">TOTAL</div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs">No data</div>
            )}
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {deptData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs inline-block" style={{ background: d.color }} />
                  <span className="text-xs text-gray-600">{d.name}</span>
                </div>
                <div className="text-xs text-gray-900 font-semibold">
                  {d.value} <span className="text-gray-400 font-normal">{d.pct}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-medium text-[#1A3A5C]">Status Distribution</h3>
          <button className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#1A8FA0] text-white">This Year</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-[120px] h-[120px] flex-shrink-0">
            {statusData.length > 0 ? (
              <>
                <PieChart width={120} height={120}>
                  <Pie data={statusData} cx={55} cy={55} innerRadius={38} outerRadius={58} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270}>
                    {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-lg font-base text-[#1A3A5C] leading-none">{approvalPct}%</div>
                  <div className="text-[9px] text-gray-400">APPROVED</div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs">No data</div>
            )}
          </div>
          <div className="flex flex-col gap-2.5 flex-1">
            {statusData.map((d, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs inline-block" style={{ background: d.color }} />
                  <span className="text-xs text-gray-600">{d.name}</span>
                </div>
                <span className="text-xs font-bold text-gray-900">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
