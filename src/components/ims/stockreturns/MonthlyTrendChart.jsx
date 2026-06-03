import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Calendar } from "lucide-react";
import { stockReturnAPI } from "../../../services/api";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-2 shadow-lg text-xs">
      <div className="font-semibold mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: p.color }}
          />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function MonthlyTrendChart() {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrend = async () => {
      try {
        const response = await stockReturnAPI.getMonthlyTrend(2025);
        if (response.data.success) {
          setTrendData(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch monthly trend:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrend();
  }, []);

  if (loading) {
    return (
      <div className="bg-white mx-0 sm:mx-23 rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 h-[300px] flex items-center justify-center animate-pulse">
        <div className="text-gray-400">Loading trend data...</div>
      </div>
    );
  }

  return (
    <div className="bg-white mx-0 sm:mx-23  rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5 overflow-x-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-xs sm:text-sm font-semibold text-[#0F172A] tracking-wide uppercase">
          Monthly Return Volume Trend
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] border border-gray-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5">
          <Calendar size={12} />
          <span className="whitespace-nowrap">JAN-DEC 2025 &amp; JAN 2026</span>
        </div>
      </div>

      <div className="h-[220px] sm:h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={trendData}
            margin={{ top: 10, right: 10, left: -35, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              domain={[6, 28]}
              ticks={[6, 10, 14, 18, 22, 26]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="baseline"
              name="Target Baseline"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="6 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="returns"
              name="Returns Volume"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#fff", stroke: "#2563eb", strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-3 pl-2">
        <div className="flex items-center gap-2">
          <svg width="24" height="8">
            <line
              x1="0"
              y1="4"
              x2="24"
              y2="4"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
            RETURNS VOLUME
          </span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="24" height="8">
            <line
              x1="0"
              y1="4"
              x2="24"
              y2="4"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
          </svg>
          <span className="text-[10px] sm:text-xs text-gray-500 font-medium">
            TARGET BASELINE
          </span>
        </div>
      </div>
    </div>
  );
}
