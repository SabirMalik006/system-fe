import React, { useState, useEffect } from "react";
import { Battery, Filter, Users, AlertTriangle } from "lucide-react";
import { stockOutAPI } from "../../../services/api";
import GraphContainer from "../../common/GraphContainer";

const iconMap = {
  Battery: Battery,
  Filter: Filter,
  Users: Users,
  AlertTriangle: AlertTriangle,
};

export default function LowStockMonitoring() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await stockOutAPI.getLowStockItems();
      if (response.data.success) {
        setItems(response.data.items || []);
      }
    } catch (error) {
      console.error("Error fetching low stock data:", error);
      setError("Unable to connect to low stock monitoring service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GraphContainer
      loading={loading}
      error={error}
      isEmpty={items.length === 0}
      emptyMessage="No low stock items detected"
      className="w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900">
          Low Stock Monitoring
        </h3>
        <button className="text-xs font-bold text-blue-600 hover:text-blue-700 tracking-wide">
          BULK REORDER
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item, i) => {
          const Icon = iconMap[item.icon] || AlertTriangle;
          return (
            <div
              key={i}
              className="bg-gradient-to-r from-[#1A8FA0] to-[#2166A0] rounded-xl p-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm leading-tight truncate">
                  {item.name}
                </div>
                <div className="text-white/70 text-[10px] mt-0.5">
                  STOCK: {item.stock} / REORDER: {item.reorder}
                </div>
              </div>
              <span className="text-[10px] font-medium px-2.5 py-1 rounded-sm flex-shrink-0 bg-gray-900 text-white">
                {item.status}
              </span>
            </div>
          );
        })}
      </div>
    </GraphContainer>
  );
}
