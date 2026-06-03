import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { ChevronDown } from 'lucide-react';
import { dashboardAPI } from '../../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 8, padding: '8px 12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.fill, display: 'inline-block' }} />
          <span style={{ color: '#64748b' }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function StockMovementChart() {
  const [period, setPeriod] = useState('Monthly');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardAPI.getStockMovement();
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching stock movement data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{
        background: '#fff', borderRadius: 26, border: '1px solid #D7E6F8',
        padding: '20px 24px 16px', height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        Loading chart...
      </div>
    );
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: 26,
      border: '1px solid #D7E6F8',
      boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
      padding: '20px 24px 16px',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', marginBottom: 20,
      }}>
        {/* Left: title */}
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Stock Movement Breakdown (In vs Out)
          </h3>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
            Monthly aggregate data
          </div>
        </div>

        {/* Right: legend + dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Legend dots */}
          {[
            { color: '#2ec4b6', label: 'Stock In' },
            { color: '#1a4fa0', label: 'Stock Out' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: l.color, display: 'inline-block',
              }} />
              <span style={{ fontSize: 12, color: '#475569' }}>{l.label}</span>
            </div>
          ))}

          {/* Monthly dropdown */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '5px 10px', borderRadius: 7,
            border: '1px solid #e2e8f0',
            background: '#fff', fontSize: 12,
            color: '#475569', cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            {period} <ChevronDown size={12} />
          </button>
        </div>
      </div>

      {/* Bar Chart */}
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barSize={14}
            barCategoryGap="30%"
            barGap={3}
          >
            <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
            <Bar dataKey="in" name="Stock In" fill="#1A8FA0" radius={[2, 2, 0, 0]} />
            <Bar dataKey="out" name="Stock Out" fill="#2166A0" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}