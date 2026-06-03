import React, { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { stockReturnAPI } from "../../../services/api";

// Radar chart drawn with SVG
function getRadarPoint(cx, cy, r, index, total, value) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: cx + r * value * Math.cos(angle),
    y: cy + r * value * Math.sin(angle),
  };
}

function RadarChart({ axes, unitA, unitB }) {
  const CX = 160,
    CY = 140,
    R = 100;
  const total = axes.length;

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const gridPaths = gridLevels.map((level) => {
    const pts = axes.map((_, i) => {
      const p = getRadarPoint(CX, CY, R, i, total, level);
      return `${p.x},${p.y}`;
    });
    return `M ${pts.join(" L ")} Z`;
  });

  const axisLines = axes.map((_, i) => {
    const p = getRadarPoint(CX, CY, R, i, total, 1.0);
    return { x: p.x, y: p.y };
  });

  const unitAPath = unitA.map((v, i) => {
    const p = getRadarPoint(CX, CY, R, i, total, v);
    return `${p.x},${p.y}`;
  });

  const unitBPath = unitB.map((v, i) => {
    const p = getRadarPoint(CX, CY, R, i, total, v);
    return `${p.x},${p.y}`;
  });

  const labelPositions = axes.map((label, i) => {
    const p = getRadarPoint(CX, CY, R + 22, i, total, 1.0);
    return { label, x: p.x, y: p.y };
  });

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 320 280"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Grid polygons */}
      {gridPaths.map((d, i) => (
        <path key={i} d={d} fill="none" stroke="#64748b" strokeWidth="0.9" />
      ))}
      {/* Axis lines */}
      {axisLines.map((pt, i) => (
        <line
          key={i}
          x1={CX}
          y1={CY}
          x2={pt.x}
          y2={pt.y}
          stroke="#475569"
          strokeWidth="1"
        />
      ))}
      {/* Unit A polygon — filled */}
      <polygon
        points={unitAPath.join(" ")}
        fill="rgba(37,99,235,0.30)"
        stroke="#1e40af"
        strokeWidth="2.2"
      />
      {/* Unit B polygon — dashed */}
      <polygon
        points={unitBPath.join(" ")}
        fill="rgba(51,65,85,0.22)"
        stroke="#334155"
        strokeWidth="1.8"
        strokeDasharray="5 3"
      />
      {/* Labels */}
      {labelPositions.map((lp, i) => (
        <text
          key={i}
          x={lp.x}
          y={lp.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fill="#334155"
          fontFamily="inherit"
          fontWeight="500"
        >
          {lp.label.split(" ").map((word, idx) => (
            <tspan key={idx} x={lp.x} dy={idx === 0 ? 0 : 10}>
              {word}
            </tspan>
          ))}
        </text>
      ))}
    </svg>
  );
}

export default function VolumeOccupancyAndRadar() {
  const [volumeData, setVolumeData] = useState([]);
  const [radarData, setRadarData] = useState({
    axes: [],
    unitA: [],
    unitB: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await stockReturnAPI.getVolumeRadar();
        if (response.data.success) {
          setVolumeData(response.data.volumeData);
          setRadarData(response.data.radar);
        }
      } catch (error) {
        console.error("Failed to fetch volume/radar data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-pulse">
        <div className="bg-white rounded-2xl h-[300px]" />
        <div className="bg-white rounded-2xl h-[300px]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Returns Volume vs Occupancy */}
      <div className="bg-gradient-to-b from-[#1E60AF] to-[#0D2849] rounded-2xl border border-[#1e3a5f] shadow-sm overflow-hidden">
        <div className="bg-white rounded-t-2xl px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-[#0F172A]">
              Returns Volume vs Total Stock
            </h3>
          </div>
        </div>

        <div className="h-[200px] sm:h-[250px] w-full px-2 mt-2 sm:mt-5">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={volumeData}
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e3a5f"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                domain={[0, "auto"]}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "#1e3a5f",
                  border: "1px solid #2563eb",
                  borderRadius: 8,
                  fontSize: 10,
                  color: "#fff",
                }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-[#1e3a5f] border border-[#2563eb] rounded-lg p-2 text-white text-[10px]">
                        <p className="font-bold mb-1">{label}</p>
                        <p>Returns: {data.returns}</p>
                        <p>Value: ${data.returnValue?.toLocaleString()}</p>
                        <p>Occupancy: {data.occupancy}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                yAxisId="left"
                dataKey="returns"
                name="Returns (count)"
                fill="#ffffff"
                radius={[3, 3, 0, 0]}
                barSize={16}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="occupancy"
                name="Occupancy (%)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-5 mt-2 pb-3 pl-4 sm:pl-6">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-white inline-block" />
            <span className="text-[9px] sm:text-[10px] text-gray-400">
              Returns (count)
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="18" height="8">
              <line
                x1="0"
                y1="4"
                x2="18"
                y2="4"
                stroke="#3b82f6"
                strokeWidth="2"
              />
            </svg>
            <span className="text-[9px] sm:text-[10px] text-gray-400">
              Occupancy (%)
            </span>
          </div>
        </div>
      </div>

      {/* Unit Return Activity — Radar */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#1E60AF] to-[#0D2849] px-3 sm:px-4 py-2 sm:py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs sm:text-sm font-medium text-white leading-wide">
              Unit Return Activity — Radar
            </h3>
          </div>
        </div>

        <div className="px-2 pb-3 pt-4 sm:px-4 sm:pb-4 sm:pt-6">
          <div className="flex justify-center">
            <div className="w-[280px] h-[250px] sm:w-[320px] sm:h-[280px]">
              {radarData.axes.length > 0 && (
                <RadarChart
                  axes={radarData.axes}
                  unitA={radarData.unitA}
                  unitB={radarData.unitB}
                />
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-3 sm:mt-4">
            <div className="flex items-center gap-1.5">
              <svg width="18" height="8">
                <line
                  x1="0"
                  y1="4"
                  x2="18"
                  y2="4"
                  stroke="#2563eb"
                  strokeWidth="2"
                />
              </svg>
              <span className="text-[9px] sm:text-[10px] text-gray-400">
                Unit A
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="18" height="8">
                <line
                  x1="0"
                  y1="4"
                  x2="18"
                  y2="4"
                  stroke="#64748b"
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              </svg>
              <span className="text-[9px] sm:text-[10px] text-gray-400">
                Unit B
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
