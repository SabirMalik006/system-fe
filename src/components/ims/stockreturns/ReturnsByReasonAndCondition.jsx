import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { stockReturnAPI } from "../../../services/api";

const condColors = {
  Serviceable: "#102964",
  Repairable: "#1A8FA0",
  Unserviceable: "#1E60AF",
  Consumables: "#1E4D7B",
};

const CustomLegend = () => (
  <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-2">
    {Object.entries(condColors).map(([k, v]) => (
      <div key={k} className="flex items-center gap-2">
        <span
          className="w-3 h-3 sm:w-4 sm:h-4 rounded-xs inline-block"
          style={{ background: v }}
        />
        <span className="text-[10px] sm:text-xs text-gray-500">{k}</span>
      </div>
    ))}
  </div>
);

export default function ReturnsByReasonAndCondition() {
  const [reasonData, setReasonData] = useState([]);
  const [conditionData, setConditionData] = useState([]);
  const [totalReturns, setTotalReturns] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await stockReturnAPI.getReasonCondition();
        if (response.data.success) {
          setReasonData(response.data.reasonData);
          setConditionData(response.data.conditionData);
          setTotalReturns(response.data.totalReturns);
        }
      } catch (error) {
        console.error("Failed to fetch reason/condition data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-pulse">
        <div className="bg-white rounded-2xl h-[250px] lg:col-span-1" />
        <div className="bg-white rounded-2xl h-[250px] lg:col-span-2" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Returns by Reason */}
      <div className="bg-white rounded-2xl border-2 border-[#1E60AF] shadow-sm p-3 sm:p-4 lg:col-span-1">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-xs sm:text-sm font-medium text-gray-900">
            Returns by Reason
          </h3>
          <span className="text-[10px] sm:text-xs text-[#0A192F] rounded px-2 py-0.5">
            Jan 2026
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          {/* Donut */}
          <div className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] flex-shrink-0">
            <PieChart width={160} height={160}>
              <Pie
                data={reasonData}
                cx={75}
                cy={75}
                innerRadius={45}
                outerRadius={70}
                paddingAngle={0}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                stroke="none"
              >
                {reasonData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="none" />
                ))}
              </Pie>
            </PieChart>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-xl sm:text-2xl font-black text-gray-900 leading-none">
                {totalReturns}
              </div>
              <div className="text-[8px] sm:text-[10px] text-gray-400 mt-0.5">
                RETURNS
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap sm:flex-col gap-2 justify-center">
            {reasonData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm flex-shrink-0"
                  style={{ background: d.color }}
                />
                <span className="text-[10px] sm:text-xs text-gray-600">
                  {d.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Condition on Return — Stacked */}
      <div className="bg-white rounded-2xl border-2 border-[#1E60AF] shadow-sm p-3 sm:p-4 lg:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h3 className="text-xs sm:text-sm font-medium text-gray-900">
            Condition on Return
          </h3>
          <span className="text-[10px] sm:text-xs text-gray-400">By month</span>
        </div>

        <div className="h-[180px] sm:h-[200px] w-full">
          {conditionData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conditionData}
                barSize={20}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e2e8f0",
                    fontSize: 10,
                  }}
                />
                {Object.entries(condColors).map(([key, color]) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={color}
                    radius={key === "Consumables" ? [3, 3, 0, 0] : [0, 0, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-xs italic">
              No condition data found
            </div>
          )}
        </div>
        <CustomLegend />
      </div>
    </div>
  );
}
