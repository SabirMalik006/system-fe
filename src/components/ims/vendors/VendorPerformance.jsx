import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { vendorsAPI } from '../../../services/api';

export default function VendorPerformance() {
  const [ratingData, setRatingData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await vendorsAPI.getPerformanceStats();
      if (res.data.success) {
        setRatingData(res.data.data.ratingDistribution);
        setDeliveryData(res.data.data.deliveryData);
      }
    } catch (err) {
      toast.error('Failed to load vendor stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Vendor Performance by Rating - Pie Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Vendor Performance by Rating</h2>
          <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <Info size={16} className="text-gray-400" strokeWidth={1.5} />
          </button>
        </div>

        {loading ? (
          <div className="h-[340px] flex items-center justify-center text-gray-400 text-sm">Loading...</div>
        ) : ratingData.length === 0 || ratingData.every(d => d.value === 0) ? (
          <div className="h-[340px] flex items-center justify-center text-gray-400 text-sm">No vendor data yet</div>
        ) : (
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={ratingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} innerRadius={0} labelLine={true} label={({ name, value }) => `${value}%`}>
                {ratingData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} stroke="white" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        )}
      </div>

      {/* Right: On-Time Delivery vs Total Orders - Grouped Bar Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-gray-800">ON-TIME DELIVERY VS TOTAL ORDERS</h2>
          <div className="flex items-center gap-5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1A8FA0] rounded"></div>
              <span className="text-gray-600">On-time %</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#1E4D7B] rounded"></div>
              <span className="text-gray-600">Orders</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">Loading...</div>
        ) : deliveryData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">No delivery data yet</div>
        ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deliveryData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="vendor" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="onTime" fill="#1A8FA0" radius={[4, 4, 0, 0]} />
            <Bar dataKey="total" fill="#1E4D7B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
