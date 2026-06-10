import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { itemsAPI, dashboardAPI } from '../../services/api';

export default function InventoryAndCriticalStock() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [criticalItems, setCriticalItems] = useState([]);
  const [inStockPct, setInStockPct] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      itemsAPI.getItems(1, 6, '', 'all', ''),
      itemsAPI.getCritical(),
      dashboardAPI.getInventoryStatus(),
    ]).then(([itemsRes, criticalRes, invRes]) => {
      // Inventory items - top 6 by stock
      if (itemsRes.data.success) {
        setInventoryItems(itemsRes.data.items.map(item => ({
          name: item.name,
          units: `${item.currentStock} units`,
        })));
      }

      // Critical items
      if (criticalRes.data.success && criticalRes.data.items) {
        setCriticalItems(criticalRes.data.items.map(item => ({
          name: item.name,
          sub: item.vendorName || 'CMES',
          days: item.currentStock <= 10 ? '3 days left' : '6 days left',
          daysColor: item.currentStock <= 10 ? '#ef4444' : '#f59e0b',
        })));
      }

      // In-stock percentage
      if (invRes.data.success && invRes.data.status) {
        setInStockPct(invRes.data.status.in_stock.percentage);
      }
    }).catch(() => {
      toast.error('Failed to load inventory data');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // Compute in-stock rates from critical items
  const inStockRates = criticalItems.slice(0, 2).map(item => ({
    name: item.name,
    pct: item.daysColor === '#ef4444' ? 18 : 10,
    color: '#1A8FA0',
  }));

  const alertItem = inventoryItems.length > 2 ? inventoryItems[2] : null;

  return (
    <div className="flex flex-col xl:flex-row gap-5 md:gap-6 p-4 md:p-6 bg-[#CBE3FA] w-full">

      {/* ───── LEFT PANEL: Inventory Status ───── */}
      <div className="flex-1 bg-white rounded-2xl p-5 md:p-6 shadow-sm flex flex-col min-w-0">

        {loading ? (
          <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">Loading...</div>
        ) : (
        <>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <div className="text-[20px] font-bold text-[#1E4D7B] leading-tight">Inventory Status</div>
            <div className="text-xs text-[#94a3b8] mt-1">In-Stock {inStockPct}%</div>
          </div>
          <div className="text-right">
            <div className="text-[28px] font-extrabold text-[#1A8FA0] leading-none">{inStockPct}%</div>
            <div className="w-20 h-1 bg-[#1A8FA0] rounded mt-2 ml-auto" />
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#f1f5f9] my-5" />

        {/* Two-column layout: items list + alert card */}
        <div className="flex flex-col lg:flex-row gap-5 flex-1">

          {/* Items list */}
          <div className="flex-1 flex flex-col">
            {inventoryItems.map((item, i) => (
              <div 
                key={i} 
                className="flex justify-between items-center py-3 border-b border-[#f1f5f9] last:border-none"
              >
                <span className="text-[13px] text-[#374151] pr-3">{item.name}</span>
                <span className="text-[13px] font-semibold text-[#1E4D7B] whitespace-nowrap">{item.units}</span>
              </div>
            ))}
          </div>

          {/* Alert card */}
          {alertItem ? (
          <div className="w-full lg:w-[190px] flex-shrink-0 bg-white border border-[#FEE2E2] rounded-xl p-4 flex flex-col justify-between ">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#EF4444">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="text-[10px] font-bold text-[#6B7280] tracking-widest uppercase">Below Threshold</span>
              </div>

              <div className="text-[13px] font-bold text-[#EF4444] leading-tight mb-2">
                {alertItem.name} — {alertItem.units}
              </div>
              <div className="text-[11px] text-[#94a3b8] leading-normal mb-5">
                Restock required immediately to avoid project delays.
              </div>
            </div>

            <button className="w-full py-2.5 bg-[#1A8FA0] text-white text-xs font-semibold rounded-sm hover:bg-[#157a8a] transition-colors">
              Create Purchase Order
            </button>
          </div>
          ) : (
          <div className="w-full lg:w-[190px] flex-shrink-0 bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center">
            <span className="text-xs text-gray-400">All items in stock</span>
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-[11px] text-[#94a3b8]">
          Last updated: Today, {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
        </div>
        </>
        )}
      </div>

      {/* ───── RIGHT PANEL: Critical Stock Items ───── */}
      <div className="flex-1 bg-white rounded-2xl p-5 md:p-6 shadow-sm flex flex-col min-w-0">

        {loading ? (
          <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">Loading...</div>
        ) : (
        <>
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <div className="text-[20px] font-bold text-[#1E4D7B] leading-tight">Critical Stock Items</div>
            <div className="text-xs text-[#94a3b8] mt-1">Forecast: Next 7 Days</div>
          </div>
          <div className="bg-[#e0f2fe] text-[#1A8FA0] text-xs font-semibold px-4 py-1 border border-[#D1E9EC] rounded-full whitespace-nowrap self-start">
            Max 7 Days
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#f1f5f9] my-5" />

        {criticalItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">No critical stock items</div>
        ) : (
        <>
        {/* Below threshold label */}
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#ef4444] flex-shrink-0" />
          <span className="text-[10px] font-bold text-[#94A3B8] tracking-widest uppercase">
            Below Threshold · Action Required
          </span>
        </div>

        {/* Critical items */}
        <div className="flex flex-col gap-3">
          {criticalItems.slice(0, 2).map((item, i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4"
            >
              {/* Icon box */}
              <div className="w-11 h-11 bg-white border border-[#e2e8f0] rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                  <line x1="12" y1="12" x2="12" y2="16" />
                  <line x1="10" y1="14" x2="14" y2="14" />
                </svg>
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-[#1e293b] leading-tight">{item.name}</div>
                <div className="text-[12px] font-semibold text-[#94a3b8] mt-1">{item.sub}</div>
              </div>

              {/* Days badge */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill={item.daysColor}><circle cx="12" cy="12" r="10"/><text x="12" y="16" textAnchor="middle" fontSize="13" fill="white" fontWeight="700">!</text></svg>
                <span className="text-xs font-semibold whitespace-nowrap" style={{ color: item.daysColor }}>
                  {item.days}
                </span>
              </div>
            </div>
          ))}
        </div>
        </> 
        )}

        {/* Divider */}
        <div className="h-px bg-[#f1f5f9] my-6" />

        {/* Category In-Stock Rate */}
        {inStockRates.length > 0 && (
        <>
        <div className="text-[10px] font-bold text-[#94a3b8] tracking-widest uppercase mb-4">
          Category In-Stock Rate
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          {inStockRates.map((rate, i) => (
            <div key={i} className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-xs text-[#475569] font-medium flex-1">{rate.name}</span>
                <span className="text-sm font-bold" style={{ color: rate.color }}>{rate.pct}%</span>
              </div>
              <div className="h-1 bg-[#e2e8f0] rounded overflow-hidden">
                <div 
                  className="h-full rounded" 
                  style={{ 
                    background: rate.color, 
                    width: `${rate.pct * 3}%` 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
        </>
        )}
      </>
      )}
      </div>

    </div>
  );
}
