import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { dashboardAPI } from '../../services/api';

// SVG Parameters
const CX = 80;
const CY = 80;

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx, cy, r, startAngle, endAngle) {
  const s = polarToCartesian(cx, cy, r, startAngle);
  const e = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export default function ItemCategoryHealth() {
  const [categories, setCategories] = useState([]);
  const [ringData, setRingData] = useState([]);
  const [centerPct, setCenterPct] = useState(0);
  const [trend, setTrend] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await dashboardAPI.getCategoryHealth();
      if (res.data.success) {
        const d = res.data;
        setCategories(d.categories);
        setCenterPct(d.overallHealth);
        setTrend(d.trend);

        // Build ring data with fixed radii
        const ringColors = ['#1a4fa0', '#2563eb', '#38bdf8', '#2ec4b6'];
        const radii = [67, 56, 45, 34];
        const rings = d.categories.map((cat, i) => ({
          radius: radii[i] || 67 - i * 11,
          pct: Math.max(0.01, cat.value / 300),
          color: ringColors[i],
          label: cat.label
        }));
        setRingData(rings);
      }
    } catch (err) {
      toast.error('Failed to load category health');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6 mb-6">
      
      {/* Title */}
      <div className="text-[11px] font-bold tracking-[0.10em] uppercase text-[#1E293B] mb-4">
        Item Category Health
      </div>

      {loading ? (
        <div className="h-[170px] flex items-center justify-center text-gray-400 text-sm">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="h-[170px] flex items-center justify-center text-gray-400 text-sm">No data yet</div>
      ) : (
      /* Body: donut + cards */
      <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">

        {/* ── Multi-ring Donut Chart ── */}
        <div className="relative flex-shrink-0 mx-auto lg:mx-0" style={{ width: 200, height: 170 }}>
          <svg width="160" height="160" viewBox="0 0 160 160" className="mx-auto lg:mx-0">
            {ringData.map((ring, i) => {
              const trackEnd = 300;
              const fillEnd = ring.pct * 300;
              return (
                <g key={i}>
                  {/* Background Track */}
                  <path
                    d={arcPath(CX, CY, ring.radius, 0, trackEnd)}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="8.5"
                    strokeLinecap="round"
                  />
                  {/* Filled Arc */}
                  <path
                    d={arcPath(CX, CY, ring.radius, 0, fillEnd)}
                    fill="none"
                    stroke={ring.color}
                    strokeWidth="8.5"
                    strokeLinecap="round"
                  />
                </g>
              );
            })}

            {/* Center Text */}
            <g>
              <circle cx={CX} cy={CY} r="32" fill="#ffffff" />
              <text 
                x={CX} 
                y={CY - 6} 
                textAnchor="middle"
                fontSize="20" 
                fontWeight="700" 
                fill="#0f172a"
              >
                {centerPct}%
              </text>
              <text 
                x={CX} 
                y={CY + 7} 
                textAnchor="middle"
                fontSize="8.4" 
                fill="#64748b" 
                fontWeight="500"
              >
                IMS Status
              </text>
              <text 
                x={CX} 
                y={CY + 20} 
                textAnchor="middle"
                fontSize="8" 
                fill="#16a34a" 
                fontWeight="600"
              >
                {trend}
              </text>
            </g>
          </svg>

          {/* Ring Labels - Responsive positioning */}
          <div className="absolute top-4 right-0 lg:right-auto lg:left-[148px] flex flex-col gap-3 lg:gap-[13.5px]">
            {categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                <span 
                  className="ml-2 w-[6px] h-[6px] rounded-full flex-shrink-0"
                  style={{ background: cat.color }}
                />
                <span className="text-[9.5px] text-gray-500 font-medium">
                  {cat.label} {cat.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4 Mini Category Cards - Responsive Grid */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {categories.map((cat, i) => (
              <div 
                key={i} 
                className="bg-slate-50 rounded-xl p-4 md:p-5"
              >
                <div className="text-xs text-gray-500 mb-2 font-medium">
                  {cat.label}
                </div>
                <div className="text-3xl md:text-[28px] font-bold text-slate-900 mb-4 tracking-tight">
                  {cat.value}%
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700"
                    style={{ 
                      background: cat.color, 
                      width: `${cat.value}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      )}
    </div>
  );
}
