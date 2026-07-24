import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, ChevronDown, Settings, X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { dashboardAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function Topbar() {
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifNewCount, setNotifNewCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifPanelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotifPanel = async () => {
    if (showNotifPanel) { setShowNotifPanel(false); return; }
    setShowNotifPanel(true);
    setNotifLoading(true);
    try {
      const res = await dashboardAPI.getAlerts();
      if (res.data.success) {
        setNotifications(res.data.alerts || []);
        setNotifNewCount(res.data.newCount || 0);
      }
    } catch {
      setNotifications([]);
      setNotifNewCount(0);
    } finally {
      setNotifLoading(false);
    }
  };

  const dismissNotif = async (id, e) => {
    e.stopPropagation();
    try {
      await dashboardAPI.dismissAlert(id);
      setNotifications(prev => prev.filter(n => n._id !== id));
      setNotifNewCount(prev => Math.max(0, prev - 1));
    } catch { toast.error('Failed to dismiss notification'); }
  };

  const clearAllNotifs = async () => {
    try {
      await dashboardAPI.clearAlerts();
      setNotifications([]);
      setNotifNewCount(0);
    } catch { toast.error('Failed to clear notifications'); }
  };

  const notifIcon = (type) => {
    switch (type) {
      case 'critical_stock': return <XCircle size={14} className="text-red-500 flex-shrink-0" />;
      case 'low_stock': return <AlertTriangle size={14} className="text-yellow-500 flex-shrink-0" />;
      case 'approval_required': return <Info size={14} className="text-blue-500 flex-shrink-0" />;
      default: return <CheckCircle size={14} className="text-green-500 flex-shrink-0" />;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] bg-white border-b border-gray-200 flex items-center px-6 gap-4 z-50 shadow-sm">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 mr-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a6cb5] to-[#2ec4b6] flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white"/>
            <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" opacity=".7"/>
            <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" opacity=".7"/>
            <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" opacity=".5"/>
          </svg>
        </div>
        <div>
          <div className="font-bold text-sm text-gray-900 leading-none">IMS</div>
          <div className="text-[9px] text-gray-400 tracking-wide uppercase">Inventory</div>
        </div>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5">
        <span className="text-gray-400 text-sm">IMS</span>
        <span className="text-gray-400 text-sm">/</span>
        <span className="text-gray-900 text-sm font-semibold">Dashboard</span>
      </div>

      {/* Nav links */}
      <nav className="flex items-center gap-1 ml-2">
        {['Dashboard', 'Analytics', 'Inventory', 'Procurement', 'Reports'].map((item, i) => (
          <button key={item} className={`px-3 py-1.5 rounded-md text-sm transition-all ${
            i === 0 
              ? 'bg-[#1a6cb5] text-white font-semibold' 
              : 'text-gray-500 hover:bg-gray-100'
          }`}>
            {item}
          </button>
        ))}
      </nav>

      <div className="flex-1" />

      {/* Search */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5 w-52">
        <Search size={14} className="text-gray-400" />
        <input placeholder="Search resources..." className="border-none bg-transparent outline-none text-sm text-gray-900 w-full font-sans" />
      </div>

      <div className="relative" ref={notifPanelRef}>
        <button
          onClick={toggleNotifPanel}
          className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center relative"
        >
          <Bell size={16} className="text-gray-500" />
          {notifNewCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
          )}
        </button>

        {showNotifPanel && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-[9999] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
                {notifNewCount > 0 && (
                  <span className="text-[10px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded-full">{notifNewCount} New</span>
                )}
              </div>
              {notifications.length > 0 && (
                <button onClick={clearAllNotifs} className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">Clear All</button>
              )}
            </div>

            <div className="max-h-[320px] overflow-y-auto">
              {notifLoading ? (
                <div className="px-4 py-8 text-center text-xs text-gray-400">Loading notifications...</div>
              ) : notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-gray-400">No new notifications</div>
              ) : (
                notifications.map((n, i) => (
                  <div key={n._id || i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0">
                    <div className="mt-0.5">{notifIcon(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-gray-900">{n.title}</div>
                      <div className="text-[11px] text-gray-500 leading-relaxed">{n.description || n.message}</div>
                    </div>
                    <button onClick={(e) => dismissNotif(n._id, e)} className="p-0.5 hover:bg-gray-100 rounded shrink-0">
                      <X size={12} className="text-gray-400" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-center">
              <button onClick={() => { setShowNotifPanel(false); }} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                View All Alerts
              </button>
            </div>
          </div>
        )}
      </div>

      <button className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
        <Settings size={16} className="text-gray-500" />
      </button>

      <div className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded-lg border border-gray-200">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1a6cb5] to-[#2ec4b6] flex items-center justify-center text-white text-xs font-bold">A</div>
        <span className="text-sm font-medium text-gray-900">Admin</span>
        <ChevronDown size={13} className="text-gray-400" />
      </div>
    </header>
  );
}