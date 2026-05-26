import React, { useState, useEffect, useCallback } from 'react';
import { itemsAPI } from '../../../services/api';

const StatsCircles = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await itemsAPI.getStats();
      if (response.data && response.data.success) {
        setStatsData(response.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const defaultStats = [
    {
      label: "TOTAL CATEGORIES",
      value: "...",
      subtext: "ACTIVE",
      trend: "LOADING...",
      image: "/Background (4).svg",
      textColor: "text-[#0F172A]",
      trendColor: "text-[#94A3B8]",
      borderColor: "#1A8FA0",     
    },
    {
      label: "LOW STOCK",
      value: "...",
      subtext: "ITEMS",
      trend: "LOADING...",
      image: "/Background (3).svg",
      textColor: "text-[#0F172A]",
      trendColor: "text-red-600",
      borderColor: "#640404",     
    },
    {
      label: "SYSTEM HEALTH",
      value: "",
      subtext: "Last Sync",
      trend: "LOADING...",
      status: "CHECKING...",
      image: "/Background (5).svg",
      textColor: "text-[#0F172A]",
      trendColor: "text-[#06B6D4]",
      borderColor: "#1E4D7B",     
    },
  ];

  let displayStats = defaultStats;
  if (statsData) {
    displayStats = [
      {
        ...defaultStats[0],
        ...(statsData.categories || {}),
        textColor: "text-[#0F172A]",
        trendColor: statsData.categories?.trendColor || "text-[#94A3B8]",
      },
      {
        ...defaultStats[1],
        ...(statsData.lowStock || {}),
        textColor: "text-[#0F172A]",
        trendColor: statsData.lowStock?.trendColor || "text-red-600",
      },
      {
        ...defaultStats[2],
        ...(statsData.systemHealth || {}),
        textColor: "text-[#0F172A]",
        trendColor: statsData.systemHealth?.trendColor || "text-[#06B6D4]",
      }
    ];
  }

  return (
    <div className="relative my-10 px-4 sm:px-10">
      <div className={`flex flex-wrap gap-12 sm:gap-20 justify-center md:justify-center transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
        {displayStats.map((stat, index) => (
          <div
            key={index}
            className="w-60 h-60 rounded-full bg-white shadow-md flex flex-col items-center justify-center text-center px-6 relative overflow-hidden"
            style={{ border: `10px solid ${stat.borderColor}` }}
          >
            {/* Background subtle glow */}
            <div className={`absolute inset-0 opacity-40 rounded-full scale-[2.5] blur-2xl ${stat.bgColor ? stat.bgColor : ''}`} />

            {/* Content layer */}
            <div className="relative z-1 flex flex-col items-center w-full">
              {/* Image */}
              <img 
                src={stat.image} 
                alt={stat.label} 
                className="w-10 h-10 sm:w-18 sm:h-18 absolute -top-14 object-contain z-10"
              />

              {/* Label */}
              <div className="text-xs sm:text-sm font-medium text-[#94A3B8] tracking-wide uppercase mb-1">
                {stat.label}
              </div>

              {/* Value or subtext */}
              {stat.value !== "" ? (
                <div className={`text-4xl sm:text-5xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
              ) : (
                <div className="text-xl sm:text-2xl font-semibold text-gray-800 mt-1">
                  {stat.subtext}
                </div>
              )}

              {/* Bottom row */}
              <div className="mt-3 flex flex-col items-center gap-2">
                {stat.value !== "" && (
                  <div className="text-sm text-gray-600 font-medium">
                    {stat.subtext}
                  </div>
                )}
                
                {/* Show both trend and status in separate lines for third card */}
                {stat.status ? (
                  <div className="flex flex-col items-center gap-0.5 mt-1">
                    <div className={`text-xs font-medium ${stat.trendColor}`}>
                      {stat.trend}
                    </div>
                    <div className={`text-xs font-medium ${stat.trendColor}`}>
                      {stat.status}
                    </div>
                  </div>
                ) : (
                  <div className={`text-xs font-medium ${stat.trendColor} mt-1`}>
                    {stat.trend}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <div className="mt-8 flex justify-center md:absolute md:top-1/2 md:-translate-y-1/2 md:-left-4 md:mt-0 xl:left-10">
        <button
          onClick={fetchStats}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2 md:p-3 md:rounded-full bg-white border border-gray-200 rounded-lg shadow-sm text-gray-500 hover:text-[#1A8FA0] hover:bg-gray-50 hover:border-[#1A8FA0] transition-all focus:outline-none focus:ring-2 focus:ring-[#1A8FA0]/20 cursor-pointer"
          title="Refresh Stats"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin text-[#1A8FA0]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm font-medium md:hidden">Refresh Stats</span>
        </button>
      </div>
    </div>
  );
};

export default StatsCircles;