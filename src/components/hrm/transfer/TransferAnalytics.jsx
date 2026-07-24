import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { transferAPI } from '../../../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
      <div className="font-bold mb-1 text-gray-700">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: p.fill }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function TransferAnalytics({ refreshKey }) {
  const [unitData, setUnitData] = useState([]);
  const [inOutData, setInOutData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      transferAPI.getTimelineByUnit(),
      transferAPI.getInOutSummary(),
    ])
      .then(([timelineRes, inOutRes]) => {
        if (!mounted) return;
        setUnitData(timelineRes.data.data || []);
        setInOutData(inOutRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [refreshKey]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-base font-bold text-gray-900 mb-8 mt-2">Transfer Timeline by Unit</h3>
        {loading ? (
          <div className="text-center text-sm text-gray-400 py-12">Loading...</div>
        ) : unitData.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-12">No data yet</div>
        ) : (
          <div className="flex flex-col gap-6">
            {unitData.map((u, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-gray-900">{u.unit}</span>
                  <span className="text-xs text-[#274c77] font-bold">{u.transfers} Transfers</span>
                </div>
                <div className="h-3.5 bg-[#0f172a] rounded-full overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${i === 3 || i === 1 ? 'bg-[#1a73e8]' : 'bg-[#274c77]'}`}
                    style={{ width: `${u.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#f8fafc] rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-8 mt-2">
          <h3 className="text-base font-bold text-gray-900">Unit-wise In vs Out Summary</h3>
          <div className="flex items-center gap-4">
            {[
              { color: '#274c77', label: 'Incoming' },
              { color: '#1a73e8', label: 'Outgoing' },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm inline-block" style={{ background: l.color }} />
                <span className="text-xs md:text-sm font-bold text-gray-800">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-sm text-gray-400 py-12">Loading...</div>
        ) : inOutData.length === 0 ? (
          <div className="text-center text-sm text-gray-400 py-12">No data yet</div>
        ) : (
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inOutData}
                barSize={12}
                barGap={4}
                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="unit" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{stroke: '#cbd5e1'}} tickLine={false} tickMargin={10} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="incoming" name="Incoming" fill="#274c77" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outgoing" name="Outgoing" fill="#1a73e8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
