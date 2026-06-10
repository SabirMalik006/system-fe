import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { dashboardAPI } from '../../services/api';

export default function AlertCenter() {
  const [alerts, setAlerts] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await dashboardAPI.getAlerts();
      if (res.data.success) {
        setAlerts(res.data.alerts);
        setNewCount(res.data.newCount || 0);
      }
    } catch (err) {
      toast.error('Failed to load alerts');
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = async () => {
    try {
      await dashboardAPI.clearAlerts();
      setAlerts([]);
      setNewCount(0);
      toast.success('All alerts cleared');
    } catch (err) {
      toast.error('Failed to clear alerts');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-[#E0E8EC] p-3 sm:p-3.5 mb-4 relative overflow-hidden">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <span className="font-semibold text-base sm:text-lg text-[#0D2B4A]">Alert Center</span>
          {newCount > 0 && (
            <span className="px-2 py-0.5 rounded-sm text-[10px] sm:text-xs font-semibold bg-[#1A8FA0] text-white">{newCount} New</span>
          )}
        </div>
        {alerts.length > 0 && (
          <button onClick={handleClearAll} className="flex items-center justify-center gap-1 text-xs sm:text-sm text-[#1A8FA0] font-semibold">
            Clear All 
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-6 text-sm text-gray-400">Loading alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-6 text-sm text-gray-400">No active alerts</div>
      ) : (
      <div className="flex flex-col lg:flex-row gap-3">
        {alerts.map((alert, i) => (
          <div key={i} className="flex-1 flex flex-col sm:flex-row items-start gap-3 p-3 rounded-lg" style={{ background: '#1E4D7B0D', border: '1px solid #1E4D7B1A' }}>
            {/* Image on Left Side - Centered on mobile */}
            <img 
              src={alert.type === 'warning' ? "/Background.svg" : "/Background (1).svg"}
              alt="background" 
              className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-lg mx-auto sm:mx-0 sm:mt-1.5"
            />
            
            {/* Content - Centered on mobile */}
            <div className="flex-1 text-center sm:text-left ml-10 sm:ml-0">
              <div className="font-semibold text-[10px] sm:text-xs text-[#1E4D7B] uppercase mb-0.5 ">{alert.title}</div>
              <div className="text-xs sm:text-sm text-[#0D2B4A] font-medium leading-relaxed">{alert.desc}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">{alert.text}</div>
            </div>
            
            {/* Buttons Container - Centered on mobile */}
            <div className="mt-3 flex items-center justify-center sm:justify-end gap-2 flex-shrink-0 w-full sm:w-auto ">
              {alert.action && (
                <button className="px-2 py-1.5 rounded-md text-[10px] sm:text-xs font-bold whitespace-nowrap" style={{ background: alert.actionBg, color: alert.actionColor }}>
                  {alert.action}
                </button>
              )}
              
              {/* Second Button - Only for approval alerts */}
              {alert.type === 'success' && (
                <button className="px-2 py-1.5 rounded-md text-[10px] sm:text-xs font-bold whitespace-nowrap bg-white text-[#1E4D7B] border border-[#1E4D7B]">
                  Ignore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
