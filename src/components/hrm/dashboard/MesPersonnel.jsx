import React from 'react';
import { Calendar } from 'lucide-react';

const CX = 200, CY = 215;

function polarToCartesian(cx, cy, r, angle) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function DonutSegment({ cx, cy, innerR, outerR, start, end, color }) {
  const s = polarToCartesian(cx, cy, outerR, start);
  const e = polarToCartesian(cx, cy, outerR, end);
  const si = polarToCartesian(cx, cy, innerR, end);
  const ei = polarToCartesian(cx, cy, innerR, start);
  const large = end - start > 180 ? 1 : 0;
  return (
    <path
      d={`M ${s.x} ${s.y} A ${outerR} ${outerR} 0 ${large} 1 ${e.x} ${e.y} L ${si.x} ${si.y} A ${innerR} ${innerR} 0 ${large} 0 ${ei.x} ${ei.y} Z`}
      fill={color}
      stroke="white"
      strokeWidth={1.5}
    />
  );
}

function PersonIconSmall({ cx, cy, size = 24 }) {
  const s = size;
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle cx={0} cy={-s * 0.3} r={s * 0.25} fill="white" />
      <ellipse cx={0} cy={s * 0.25} rx={s * 0.42} ry={s * 0.33} fill="white" />
    </g>
  );
}

const SEGMENT_COLORS = ['#7EB6EE', '#4E86E0', '#2F5FD6', '#22488F', '#1A3A6B', '#132A4D'];
const FALLBACK_GRID = [
  { name: 'CMES COMCOAST', color: '#4E86E0', pct: 7.51 },
  { name: 'CMES COMKAR', color: '#22488F', pct: 41.38 },
  { name: 'CMES COMLOG', color: '#132A4D', pct: 15.85 },
  { name: 'CME COMPAK', color: '#1A3A6B', pct: 12.20 },
  { name: 'CME ISLD / LHR', color: '#2F5FD6', pct: 14.82 },
  { name: 'CMES ORMARA', color: '#7EB6EE', pct: 8.24 },
];

export default function MesPersonnel({ data }) {
  const personnelList = data?.personnel || FALLBACK_GRID;
  const onDuty = data?.onDuty ?? 42;
  const standbyStaff = data?.standbyStaff ?? 18;

  const gridItems = personnelList.length > 6 ? personnelList.slice(1, 7) : personnelList.slice(0, 6);

  const SEGMENTS = 6;
  const ANGLE = 360 / SEGMENTS;
  const INNER_R = 72;
  const OUTER_R = 115;
  const AVATAR_R = 138;
  const AVATAR_SIZE = 20;

  return (
    <div className="bg-white rounded-[24px] shadow-sm p-8 w-full max-w-[420px]">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <span className="text-[11px] font-bold text-[#1a2b4a] bg-gray-200 rounded-lg px-3 py-1.5">
          MES Personnel
        </span>
        <div className="flex items-center gap-1.5 bg-blue-50 rounded-full px-4 py-2">
          <Calendar size={13} className="text-[#1a2b4a]" strokeWidth={2} />
          <span className="text-[10px] font-bold text-[#1a2b4a]">Last 30 Days</span>
        </div>
      </div>

      {/* ── Donut Chart ── */}
      <div className="flex justify-center">
        <svg width="330" height="370" viewBox="0 0 400 450" className="overflow-visible">
          {Array.from({ length: SEGMENTS }, (_, i) => {
            const start = -90 + i * ANGLE;
            const end = start + ANGLE - 0.4;
            return (
              <DonutSegment
                key={i}
                cx={CX} cy={CY}
                innerR={INNER_R} outerR={OUTER_R}
                start={start} end={end}
                color={SEGMENT_COLORS[i]}
              />
            );
          })}

          {Array.from({ length: SEGMENTS }, (_, i) => {
            const angle = -90 + i * ANGLE + ANGLE / 2;
            const pos = polarToCartesian(CX, CY, AVATAR_R, angle);
            return (
              <g key={`a${i}`}>
                <circle cx={pos.x} cy={pos.y} r={AVATAR_SIZE} fill={SEGMENT_COLORS[i]} stroke="white" strokeWidth={3} />
                <PersonIconSmall cx={pos.x} cy={pos.y} size={AVATAR_SIZE * 1.1} />
              </g>
            );
          })}

          <circle cx={CX} cy={CY} r={62} fill="white" stroke="#e5e7eb" strokeWidth={1.5} />
          <text x={CX} y={CY - 9} textAnchor="middle" fontSize="12" fontWeight="800" fill="#1a2b4a" fontFamily="inherit" letterSpacing="0.06em">
            HEADQUARTER
          </text>
          <text x={CX} y={CY + 12} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1a2b4a" fontFamily="inherit" letterSpacing="0.04em">
            DW&CE
          </text>
        </svg>
      </div>

      {/* ── Personnel Grid ── */}
      <div className="grid grid-cols-3 gap-x-10 gap-y-12 mt-10">
        {gridItems.map((item, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: item.color || SEGMENT_COLORS[i] }}
            >
              <svg width="24" height="24" viewBox="-14 -16 28 32" fill="none">
                <circle cx="0" cy="-6" r="7" fill="white" />
                <ellipse cx="0" cy="7" rx="11" ry="9" fill="white" />
              </svg>
            </div>
            <span className="text-[11px] font-bold text-[#1a2b4a] uppercase mt-3 text-center leading-tight">
              {item.name}
            </span>
            <span className="text-[10px] font-bold text-[#1a2b4a] bg-gray-100 rounded-full px-3 py-1 mt-2">
              {item.percentage ?? item.pct ?? 0}%
            </span>
            <span className="text-[9px] text-gray-400 font-medium mt-1">Workforce</span>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between mt-16">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4E86E0]" />
            <span className="text-[9px] font-bold text-[#1a2b4a] uppercase tracking-wide">ON DUTY</span>
            <span className="text-[10px] font-bold text-[#1a2b4a] ml-1">{onDuty}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7EB6EE]" />
            <span className="text-[9px] font-bold text-[#1a2b4a] uppercase tracking-wide">STANDBY STAFF</span>
            <span className="text-[10px] font-bold text-[#1a2b4a] ml-1">{standbyStaff}</span>
          </div>
        </div>
        <button className="bg-blue-100 hover:bg-blue-200 rounded-full px-6 py-3 text-[10px] font-bold text-[#1a2b4a] uppercase tracking-wider transition-colors whitespace-nowrap">
          View Personnel Details
        </button>
      </div>
    </div>
  );
}
