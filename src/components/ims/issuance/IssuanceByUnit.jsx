import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { stockOutAPI } from "../../../services/api";
import GraphContainer from "../../common/GraphContainer";

const defaultDonutSegments = [
  { pct: 0.35, color: '#1A8FA0', path: '/items', img: '/Overlay+Border+OverlayBlur.png', label: 'Electrical' },
  { pct: 0.25, color: '#E2E8F0', path: '/procurement-management', img: '/88.png', label: 'Sanitary' },
  { pct: 0.20, color: '#1E4D7B', path: '/reports', img: '/a3.svg', label: 'Consumable' },
  { pct: 0.20, color: '#163A50', path: '/stock-returns', img: '/a4.svg', label: 'Tools' },
];

const defaultUnits = [
  { rank: '01', label: 'TOOLS', percentage: 35, color: '#0e4d8a', quantity: 120 },
  { rank: '02', label: 'CONSUMABLE', percentage: 25, color: '#2ec4b6', quantity: 85 },
  { rank: '03', label: 'SANITARY ITEMS', percentage: 20, color: '#1a4fa0', quantity: 68 },
  { rank: '04', label: 'ELECTRICAL ITEMS', percentage: 20, color: '#1e3a5f', quantity: 68 }
];

function DonutChart({ segments }) {
  const navigate = useNavigate();
  const cx = 120, cy = 120, r = 95, stroke = 40;
  const circumference = 2 * Math.PI * r;

  function polarToXY(angleDeg, radius) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  const chartSegments = (segments && segments.length > 0) ? segments : defaultDonutSegments;

  const defaultMeta = [
    { img: '/Overlay+Border+OverlayBlur.png', label: 'Electrical', path: '/items' },
    { img: '/88.png', label: 'Sanitary', path: '/procurement-management' },
    { img: '/a3.svg', label: 'Consumable', path: '/reports' },
    { img: '/a4.svg', label: 'Tools', path: '/stock-returns' },
  ];

  let cumulativePct = 0;
  const slices = [];
  const icons = [];

  chartSegments.forEach((seg, i) => {
    const pct = seg.pct || 0.25;
    const startAngle = cumulativePct * 360 - 90;
    const midAngle = startAngle + (pct * 360) / 2;
    const dash = pct * circumference;
    const gap = circumference - dash;
    const rotation = startAngle;
    
    cumulativePct += pct;

    const meta = defaultMeta[i] || {};
    const img = seg.img || meta.img;
    const path = seg.path || meta.path;
    const label = seg.label || meta.label;

    slices.push({
      ...seg,
      dash,
      gap,
      rotation,
      path
    });

    const pt = polarToXY(midAngle, r);
    icons.push({
      x: pt.x,
      y: pt.y,
      img,
      path,
      label
    });
  });

  const handleCenterClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      navigate('/dashboard');
    }, 300);
  };

  const handleSegmentClick = (path) => {
    if (path) navigate(path);
  };

  return (
    <div className="relative w-full max-w-[320px] h-[320px] mx-auto flex justify-center items-center my-2">
      <svg width="320" height="320" viewBox="0 0 240 240" className="w-full h-full">
        {slices.map((seg, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeLinecap="butt"
            transform={`rotate(${seg.rotation} ${cx} ${cy})`}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleSegmentClick(seg.path)}
          />
        ))}

        {/* Icons Perfectly Centered on Each Segment Bar */}
        {icons.map((pos, i) => (
          <g 
            key={i} 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleSegmentClick(pos.path)}
          >
            <foreignObject x={pos.x - 14} y={pos.y - 14} width="28" height="28">
              <img
                src={pos.img}
                alt={pos.label || ''}
                className="w-full h-full object-contain"
              />
            </foreignObject>
          </g>
        ))}

        {/* Center IMS Circle - Clickable */}
        <circle
          cx={cx}
          cy={cy}
          r="48"
          fill="white"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))', cursor: 'pointer' }}
          onClick={handleCenterClick}
          className="hover:opacity-80 transition-opacity"
        />

        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontSize="22"
          fontWeight="500"
          fill="#1A8FA0"
          style={{ dominantBaseline: 'middle', cursor: 'pointer' }}
          onClick={handleCenterClick}
          className="hover:opacity-80 transition-opacity"
        >
          IMS
        </text>
      </svg>
    </div>
  );
}

export default function IssuanceByUnit() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockOutAPI.getIssuanceByUnit();
      if (response.data.success) {
        setData(response.data);
      }
    } catch (err) {
      console.error("Error fetching issuance by unit data:", err);
      setError("Unable to connect to unit distribution analytics.");
    } finally {
      setLoading(false);
    }
  };

  const units = data?.units && data.units.length > 0 ? data.units : defaultUnits;
  const dbLoad = data?.dbLoad || "12.4";

  return (
    <GraphContainer loading={loading} error={error} className="h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-xl font-normal text-[#1E293B]">
            Issuance by Unit
          </h2>
          <p className="text-xs text-[#1E293B] mt-0.5">
            Distribution analysis for current fiscal period
          </p>
        </div>
        <div className="flex items-center gap-1.5 border border-blue-200 text-[#475569] text-xs font-semibold px-3 py-1.5 rounded-lg">
          <Calendar size={12} />
          {data?.period || "Last 30 Days"}
        </div>
      </div>

      {/* Donut Chart - Fixed visual design for navigation */}
      <DonutChart segments={defaultDonutSegments} />

      {/* Unit list - Real Database Data */}
      <div className="flex flex-col gap-3 mt-4 justify-center max-w-sm mx-auto">
        {units.map((u, i) => (
          <div
            key={i}
            className="flex items-start gap-3 pb-3 border-b border-dashed border-gray-100 last:border-0 last:pb-0"
          >
            <div
              className="w-8 h-8 mt-1 rounded-md flex items-center justify-center flex-shrink-0 text-white text-[13px] font-normal"
              style={{ background: u.color }}
            >
              {u.rank}
            </div>
            <div>
              <div className="text-[10px] font-medium text-[#64748B] tracking-wider">
                {u.label}
              </div>
              <div
                className="text-xl font-semibold leading-tight"
                style={{ color: u.color }}
              >
                {u.percentage}%
              </div>
              <div className="text-[10px] text-gray-400">
                Total Issuance Volume ({u.quantity || 0})
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Database Load */}
      <div className="mt-6 bg-[#1E4D7B] rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-sm text-gray-300 font-medium">
          Database Load
        </span>
        <span className="text-lg font-medium text-white">
          {dbLoad} <span className="text-sm font-bold">%</span>
        </span>
      </div>
    </GraphContainer>
  );
}


