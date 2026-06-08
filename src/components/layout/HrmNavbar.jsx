import React, { useState, useRef, useEffect } from 'react';
import { Anchor, ChevronDown, Bell, Search, Menu, X, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const navLinks = [
  { label: 'Dashboard', path: '/hrm-dashboard', hasDropdown: false },
  { label: 'Personnel', path: '/department', hasDropdown: false },
  { label: 'Attendance', path: '/attendance', hasDropdown: false },
  { label: 'Leave', path: '/leave-management', hasDropdown: false },
  { label: 'Transfer and Training', path: null, hasDropdown: true },
  { label: 'Compliance', path: '/compliance', hasDropdown: false },
  { label: 'Inspection', path: '/tools-inspection' },
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
  const dropdownTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isDevelopmentActive = () => {
    return developmentDropdownItems.some(item => location.pathname === item.path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsMobileDevelopmentOpen(false);
  };

  // Handle mouse enter on dropdown trigger
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsDevelopmentOpen(true);
  };

  // Handle mouse leave on dropdown trigger and dropdown menu
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsDevelopmentOpen(false);
    }, 150);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-[#0B4E89] to-[#0F5D98] px-4 sm:px-5 py-0 flex items-center justify-between h-[52px] shadow-md">
      {/* Logo */}
      <div 
        onClick={() => handleNavigation('/hrm-dashboard')}
        className="flex items-center gap-2 flex-shrink-0 cursor-pointer"
      >
        <div className="w-8 h-8 bg-blue-400 rounded-md flex items-center justify-center">
          <Anchor size={16} className="text-white" />
        </div>
        <span className="text-white font-bold text-base tracking-wide">HRMS</span>
      </div>

      {/* Desktop Nav links - Hidden below 1024px */}
      <div className="hidden lg:flex items-center gap-0.5">
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
                      ? 'text-[#3B82F6] font-semibold border-b-2 border-[#3B82F6]'
                      : 'text-[#FFFFFF] hover:text-[#3B82F6]'
                  }`}
                  style={active ? { borderRadius: 0 } : {}}
                >
                  {link.label}
                  <ChevronDown size={10} className={`mt-1 transition-transform duration-200 ${isDevelopmentOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu */}
                {isDevelopmentOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
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
                  ? 'text-[#3B82F6] font-semibold border-b-2 border-[#3B82F6]'
                  : 'text-[#FFFFFF] hover:text-[#3B82F6]'
              }`}
              style={active ? { borderRadius: 0 } : {}}
            >
              {link.label}
            </div>
          );
        })}
      </div>

      <div className="flex-1 hidden lg:block" />

      {/* Search - Desktop (Hidden below 1024px) */}
      <div className="hidden lg:flex items-center gap-2 bg-[#F8FAFC] border border-white/20 rounded-lg px-3 py-1.5 w-52">
        <Search size={13} className="text-[#64748B] flex-shrink-0" />
        <input
          placeholder="Search employees, reports..."
          className="bg-transparent text-xs text-white outline-none w-full placeholder-[#64748B]"
        />
      </div>

      {/* Bell - Desktop (Hidden below 1024px) */}
      <button className="relative p-2 ml-1 cursor-pointer hidden lg:block">
        <Bell size={17} className="text-blue-200" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full border border-[#0B4E89]" />
      </button>

      {/* User - Desktop (Hidden below 1024px) */}
      <div className="relative hidden lg:block" ref={userMenuRef}>
        <div
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center gap-2 ml-1 cursor-pointer"
        >
          <div className="text-right">
            <div className="text-white text-xs font-bold leading-none">{user?.name || 'User'}</div>
            <div className="text-blue-200 text-[14px] uppercase">{user?.role?.replace('_', ' ') || ''}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-300 flex items-center justify-center text-xs font-bold text-blue-900 relative">
            {user?.name?.charAt(0) || 'U'}
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border border-[#0B4E89]" />
          </div>
        </div>

        {isUserMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
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

      {/* Mobile Menu Button - Visible below 1024px */}
      <button 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="lg:hidden p-1 text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu Dropdown - Visible below 1024px */}
      {isMenuOpen && (
        <div className="absolute top-[52px] left-0 right-0 bg-[#0B4E89] z-50 shadow-lg lg:hidden">
          <div className="flex flex-col p-4 gap-2">
            {/* Mobile Search */}
            <div className="flex items-center gap-2 bg-[#F8FAFC] border border-white/20 rounded-lg px-3 py-2 mb-2">
              <Search size={13} className="text-[#64748B] flex-shrink-0" />
              <input
                placeholder="Search employees, reports..."
                className="bg-transparent text-xs text-white outline-none w-full placeholder-[#64748B]"
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
                          ? 'text-[#3B82F6] font-semibold bg-white/10'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{link.label}</span>
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
                                ? 'text-[#3B82F6] font-semibold bg-white/10'
                                : 'text-white/80 hover:bg-white/10'
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
                  className={`px-3 py-2 text-sm rounded-lg cursor-pointer ${
                    active
                      ? 'text-[#3B82F6] font-semibold bg-white/10'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </div>
              );
            })}

            {/* Mobile User Info */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <div
                onClick={() => handleNavigation('/personnel-profile')}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-white/10 rounded-lg"
              >
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

            {/* Mobile Bell */}
            <div className="flex items-center gap-2 px-3 py-2">
              <Bell size={17} className="text-blue-200" />
              <span className="text-white text-sm">Notifications</span>
              <span className="ml-auto w-2 h-2 bg-[#EF4444] rounded-full" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}