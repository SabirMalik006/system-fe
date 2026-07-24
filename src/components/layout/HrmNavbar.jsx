import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Bell, Search, Menu, X, LogOut, Home, Anchor, LayoutDashboard, Users, ClipboardCheck, CalendarDays, ArrowRightLeft, ShieldCheck, User, UserCog, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardAPI } from '../../services/api';
import toast from 'react-hot-toast';

const allNavLinks = [
  { label: 'Dashboard', path: '/hrm-dashboard', hasDropdown: false, icon: LayoutDashboard },
  { label: 'Personnel', path: '/department', hasDropdown: false, icon: Users },
  { label: 'Attendance', path: '/attendance', hasDropdown: false, icon: ClipboardCheck },
  { label: 'Leave', path: '/leave-management', hasDropdown: false, icon: CalendarDays },
  { label: 'Transfer and Training', path: null, hasDropdown: true, icon: ArrowRightLeft },
  { label: 'Compliance', path: '/compliance', hasDropdown: false, icon: ShieldCheck },
];

const tradesmanLinks = [
  { label: 'My Profile', path: '/employee-profile', hasDropdown: false, icon: User },
  { label: 'Attendance', path: '/attendance', hasDropdown: false, icon: ClipboardCheck },
  { label: 'Leave', path: '/leave-management', hasDropdown: false, icon: CalendarDays },
];

const developmentDropdownItems = [
  { name: 'Transfer', path: '/inter-unit-transfer' },
  { name: 'Training Management', path: '/training-management' },
];

export default function HrmNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDevelopmentOpen, setIsDevelopmentOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileDevelopmentOpen, setIsMobileDevelopmentOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifNewCount, setNotifNewCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const userMenuRef = useRef(null);
  const notifPanelRef = useRef(null);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (notifPanelRef.current && !notifPanelRef.current.contains(e.target)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleNotifPanel = async () => {
    if (showNotifPanel) {
      setShowNotifPanel(false);
      return;
    }
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
    } catch {
      toast.error('Failed to dismiss notification');
    }
  };

  const clearAllNotifs = async () => {
    try {
      await dashboardAPI.clearAlerts();
      setNotifications([]);
      setNotifNewCount(0);
    } catch {
      toast.error('Failed to clear notifications');
    }
  };

  const notifIcon = (type) => {
    switch (type) {
      case 'critical_stock': return <XCircle size={14} className="text-red-500 flex-shrink-0" />;
      case 'low_stock': return <AlertTriangle size={14} className="text-yellow-500 flex-shrink-0" />;
      case 'approval_required': return <Info size={14} className="text-blue-500 flex-shrink-0" />;
      case 'system': return <Info size={14} className="text-gray-500 flex-shrink-0" />;
      default: return <CheckCircle size={14} className="text-green-500 flex-shrink-0" />;
    }
  };

  const navLinks = user?.role === 'tradesman'
    ? tradesmanLinks
    : [...allNavLinks, ...((user?.role === 'dwece' || user?.role === 'charge_head') ? [{ label: 'Users', path: '/hrm-user-management', hasDropdown: false, icon: UserCog }] : [])];

  const isActive = (path) => location.pathname === path;

  const isDevelopmentActive = () =>
    user?.role !== 'tradesman' && developmentDropdownItems.some(item => location.pathname === item.path);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsMobileDevelopmentOpen(false);
  };

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsDevelopmentOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDevelopmentOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-[#0B4E89] to-[#0F5D98] px-4 sm:px-5 flex items-center justify-between h-[52px] shadow-md">
      {/* Logo */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div
          onClick={() => handleNavigation('/hrm-dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-400 rounded-md flex items-center justify-center">
            <Anchor size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-base tracking-wide">HRMS</span>
        </div>

        <div
          onClick={() => handleNavigation('/')}
          className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-200 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-all ml-1 cursor-pointer"
          title="Home"
        >
          <Home size={14} />
          <span className="hidden lg:inline">Home</span>
        </div>
      </div>

      <div className="w-px h-5 bg-white/10 mx-1 hidden lg:block" />

      {/* Desktop Nav links */}
      <div className="hidden lg:flex items-center justify-between flex-1 max-w-[60%]">
        {navLinks.map((link) => {
          const active = link.path ? isActive(link.path) : isDevelopmentActive();

          if (link.hasDropdown) {
            return (
              <div
                key={link.label}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <div
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm transition-colors rounded-sm cursor-pointer ${
                    active
                      ? 'text-white font-semibold border-b-2 border-white'
                      : 'text-blue-200 hover:text-white'
                  }`}
                  style={active ? { borderRadius: 0 } : {}}
                >
                  <link.icon size={14} className="text-white flex-shrink-0" />
                  {link.label}
                  <ChevronDown size={10} className={`mt-0.5 transition-transform duration-200 ${isDevelopmentOpen ? 'rotate-180' : ''}`} />
                </div>

                {isDevelopmentOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-[9999]"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {developmentDropdownItems.map((item) => (
                      <div
                        key={item.name}
                        onClick={() => {
                          handleNavigation(item.path);
                          setIsDevelopmentOpen(false);
                        }}
                        className={`block px-4 py-2 text-sm cursor-pointer rounded-md mx-1 ${
                          location.pathname === item.path
                            ? 'bg-gray-100 text-[#1A8FA0] font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {item.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={link.label}
              onClick={() => handleNavigation(link.path)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm transition-colors rounded-sm cursor-pointer ${
                active
                  ? 'text-white font-semibold border-b-2 border-white'
                  : 'text-blue-200 hover:text-white'
              }`}
              style={active ? { borderRadius: 0 } : {}}
            >
              <link.icon size={14} className="text-white flex-shrink-0" />
              {link.label}
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="hidden lg:flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 w-52">
        <Search size={13} className="text-blue-200 flex-shrink-0" />
        <input
          placeholder="Search employees, reports..."
          className="bg-transparent text-xs text-white outline-none w-full placeholder-blue-300"
        />
      </div>

      {/* Bell */}
      <div className="relative hidden lg:block" ref={notifPanelRef}>
        <button
          onClick={toggleNotifPanel}
          className="relative p-2 ml-1 cursor-pointer"
        >
          <Bell size={17} className="text-blue-200" />
          {notifNewCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full border border-[#0B4E89]" />
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
                <button onClick={clearAllNotifs} className="text-[10px] font-semibold text-blue-600 hover:text-blue-700">
                  Clear All
                </button>
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
                    <button
                      onClick={(e) => dismissNotif(n._id, e)}
                      className="p-0.5 hover:bg-gray-100 rounded shrink-0"
                    >
                      <X size={12} className="text-gray-400" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 text-center">
              <button
                onClick={() => { setShowNotifPanel(false); navigate('/dashboard'); }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View All Alerts
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User */}
      <div className="relative hidden lg:block" ref={userMenuRef}>
        <div
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-2 ml-1 cursor-pointer"
        >
          <div className="text-right">
            <div className="text-white text-xs font-bold leading-none">{user?.name || 'User'}</div>
            <div className="text-blue-200 text-[10px] uppercase leading-tight">{user?.role?.replace('_', ' ') || ''}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-xs font-bold text-blue-900 relative">
            {user?.name?.charAt(0) || 'U'}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-[#0B4E89]" />
          </div>
        </div>

        {isUserMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-[9999]">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-1 text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-[52px] left-0 right-0 bg-[#0B4E89] z-[9999] shadow-lg lg:hidden">
          <div className="flex flex-col p-4 gap-2">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 mb-2">
              <Search size={13} className="text-blue-200 flex-shrink-0" />
              <input
                placeholder="Search employees, reports..."
                className="bg-transparent text-xs text-white outline-none w-full placeholder-blue-300"
              />
            </div>

            {navLinks.map((link) => {
              const active = link.path ? isActive(link.path) : isDevelopmentActive();

              if (link.hasDropdown) {
                return (
                  <div key={link.label}>
                    <div
                      onClick={() => setIsMobileDevelopmentOpen(!isMobileDevelopmentOpen)}
                      className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer ${
                        active
                          ? 'text-white font-semibold bg-white/10'
                          : 'text-blue-200 hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-2"><link.icon size={14} className="text-white flex-shrink-0" />{link.label}</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isMobileDevelopmentOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isMobileDevelopmentOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {developmentDropdownItems.map((item) => (
                          <div
                            key={item.name}
                            onClick={() => handleNavigation(item.path)}
                            className={`px-3 py-2 text-sm rounded-lg cursor-pointer ${
                              location.pathname === item.path
                                ? 'text-white font-semibold bg-white/10'
                                : 'text-blue-200 hover:bg-white/10'
                            }`}
                          >
                            {item.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={link.label}
                  onClick={() => handleNavigation(link.path)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                    active
                      ? 'text-white font-semibold bg-white/10'
                      : 'text-blue-200 hover:bg-white/10'
                  }`}
                >
                  <link.icon size={14} className="text-white flex-shrink-0" />
                  {link.label}
                </div>
              );
            })}

            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-xs font-bold text-blue-900">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="text-white text-xs font-bold">{user?.name || 'User'}</div>
                  <div className="text-blue-200 text-xs uppercase">{user?.role?.replace('_', ' ') || ''}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-sm text-red-300 hover:bg-white/10 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>

            <button
              onClick={() => { setIsMenuOpen(false); toggleNotifPanel(); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-200 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bell size={17} />
              <span>Notifications</span>
              {notifNewCount > 0 && (
                <span className="ml-auto w-2 h-2 bg-[#EF4444] rounded-full" />
              )}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
