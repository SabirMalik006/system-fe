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
  LabelList,
} from "recharts";
import { stockOutAPI } from "../../../services/api";
import GraphContainer from "../../common/GraphContainer";

const legend = [
  { color: "#60a5fa", label: "Quantity Issued" },
  { color: "#1a4fa0", label: "Fulfillment Rate" },
  { color: "#1e3a5f", label: "Pending Approvals" },
  { color: "#2ec4b6", label: "Denied/Insufficient Stock" },
  {
    color: "#7dd3fc",
    label: "12-Month Moving Average (Decrement Trend)",
    dash: true,
  },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-xs">
      <div className="font-bold mb-1.5">{label}</div>
      {payload.map(
        (p, i) =>
          p.value && (
            <div key={i} className="flex items-center gap-1.5 mb-0.5">
              <span
                className="w-2 h-2 rounded-sm inline-block"
                style={{ background: p.color || p.fill }}
              />
              <span className="text-gray-500">{p.name}:</span>
              <span className="font-bold">{p.value}</span>
            </div>
          ),
      )}
    </div>
  );
};

export default function IssuanceWorkflowStatus() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockOutAPI.getWorkflowStatus();
      if (response.data.success) {
        setData(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching workflow status:", error);
      setError("Unable to connect to workflow status analytics.");
    } finally {
      setLoading(false);
    }
  };

  const maxVal =
    data.length > 0
      ? Math.max(
          ...data.map((d) =>
            Math.max(
              d.qty || 0,
              d.fulfillment || 0,
              d.pending || 0,
              d.denied || 0,
            ),
          ),
          350,
        )
      : 350;
  const yDomain = [0, Math.ceil(maxVal / 50) * 50];

  return (
    <GraphContainer
      loading={loading}
      error={error}
      isEmpty={data.length === 0}
      className="w-full"
    >
      {/* Title */}
      <h3 className="text-xs font-medium text-gray-700 tracking-widest uppercase  mb-4">
        Issuance Workflow Status
      </h3>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
        {legend.map((l, i) => (
          <div key={i} className="flex items-center gap-1.5">
            {l.dash ? (
              <svg width="18" height="8">
                <line
                  x1="0"
                  y1="4"
                  x2="18"
                  y2="4"
                  stroke={l.color}
                  strokeWidth="1.5"
                  strokeDasharray="4 2"
                />
              </svg>
            ) : (
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ background: l.color }}
              />
            )}
            <span className="text-xs text-gray-500">{l.label}</span>
          </div>
        ))}
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 30, right: 20, left: -20, bottom: 0 }}
            barCategoryGap="30%"
            barGap={3}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="period"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              domain={yDomain}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.02)" }}
            />

            <Bar
              dataKey="qty"
              name="Quantity Issued"
              fill="#60a5fa"
              radius={[4, 4, 0, 0]}
              barSize={22}
            >
              <LabelList
                dataKey="qty"
                position="top"
                style={{ fontSize: 11, fill: "#374151", fontWeight: 700 }}
              />
            </Bar>
            <Bar
              dataKey="fulfillment"
              name="Fulfillment Rate"
              fill="#1a4fa0"
              radius={[4, 4, 0, 0]}
              barSize={22}
            >
              <LabelList
                dataKey="fulfillment"
                position="top"
                style={{ fontSize: 11, fill: "#374151", fontWeight: 700 }}
              />
            </Bar>
            <Bar
              dataKey="pending"
              name="Pending Approvals"
              fill="#1e3a5f"
              radius={[4, 4, 0, 0]}
              barSize={22}
            >
              <LabelList
                dataKey="pending"
                position="top"
                style={{ fontSize: 11, fill: "#374151", fontWeight: 700 }}
              />
            </Bar>
            <Bar
              dataKey="denied"
              name="Denied/Insufficient Stock"
              fill="#2ec4b6"
              radius={[4, 4, 0, 0]}
              barSize={22}
            >
              <LabelList
                dataKey="denied"
                position="top"
                style={{ fontSize: 11, fill: "#374151", fontWeight: 700 }}
              />
            </Bar>
            <Line
              type="monotone"
              dataKey="movingAvg"
              name="Moving Average"
              stroke="#7dd3fc"
              strokeWidth={1.5}
              strokeDasharray="6 3"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Anticipated Projects label */}
      <div className="flex justify-end mt-1">
        <span className="text-[10px] text-gray-400 italic">
          Anticipated Projects →
        </span>
      </div>
    </GraphContainer>
  );
}
