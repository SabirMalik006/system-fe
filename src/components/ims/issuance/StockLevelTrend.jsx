import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { stockOutAPI } from "../../../services/api";
import GraphContainer from "../../common/GraphContainer";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
      <div className="font-bold mb-1.5 text-gray-700">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5 mb-0.5">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: p.color }}
          />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function StockLevelTrend() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockOutAPI.getStockTrend();
      if (response.data.success) {
        setData(response.data.data || []);
        setSummary(response.data.summary || response.data.averages);
      }
    } catch (error) {
      console.error("Error fetching stock level trend:", error);
      setError("Unable to connect to stock level trend service.");
    } finally {
      setLoading(false);
    }
  };

  const maxVal =
    data.length > 0
      ? Math.max(...data.map((d) => Math.max(d.stock || 0, d.issued || 0)), 500)
      : 500;
  const yDomain = [0, Math.ceil(maxVal / 100) * 100];

  return (
    <GraphContainer
      loading={loading}
      error={error}
      isEmpty={data.length === 0}
      className="w-full"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h3 className="text-xs font-medium text-gray-700 tracking-widest uppercase">
          Stock Level vs Issue Trend
        </h3>
        <div className="flex items-center gap-4">
          {[
            { color: "#1a4fa0", label: "Stock Level", dash: false },
            { color: "#2ec4b6", label: "Items Issued", dash: false },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <svg width="18" height="8">
                <line
                  x1="0"
                  y1="4"
                  x2="18"
                  y2="4"
                  stroke={l.color}
                  strokeWidth="2"
                  strokeDasharray={l.dash ? "4 2" : "0"}
                />
              </svg>
              <span className="text-xs text-gray-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-[220px] sm:h-[240px] md:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              domain={yDomain}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="stock"
              name="Stock Level"
              stroke="#1a4fa0"
              strokeWidth={2}
              dot={{ r: 4, fill: "#fff", stroke: "#1a4fa0", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="issued"
              name="Items Issued"
              stroke="#2ec4b6"
              strokeWidth={2}
              dot={{ r: 4, fill: "#fff", stroke: "#2ec4b6", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-blue-100 text-[#1D4ED8] text-[10px] font-normal px-3 py-1 rounded-full">
            Avg: {summary?.avgStock || summary?.stock || 0} Units
          </span>
          <span className="bg-[#6DB8E880] text-[#1D4ED8] text-[10px] font-normal px-3 py-1 rounded-full">
            Avg: {summary?.avgIssued || summary?.issued || 0} Issued
          </span>
        </div>
        <span className="text-[10px] text-gray-400">
          Last updated: {summary?.lastUpdated || "Today"}
        </span>
      </div>
    </GraphContainer>
  );
}
