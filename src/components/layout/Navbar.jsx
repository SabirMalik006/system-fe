import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, X, LogOut, Home, Bell, Package, LayoutDashboard, ShoppingCart, BarChart3, Building2, ShieldCheck, Users } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isMobileInventoryOpen, setIsMobileInventoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const userMenuRef = useRef(null);
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', hasDropdown: false, icon: LayoutDashboard },
    { name: 'Inventory', path: '/items', hasDropdown: true, icon: Package },
    { name: 'Procurements', path: '/procurement-management', hasDropdown: false, icon: ShoppingCart },
    { name: 'Reports', path: '/reports', hasDropdown: false, icon: BarChart3 },
    { name: 'Vendors', path: '/vendors', hasDropdown: false, icon: Building2 },
    { name: 'Inspection', path: '/tools-inspection', hasDropdown: false, icon: ShieldCheck },
    ...((user?.role === 'dwece' || user?.role === 'charge_head') ? [{ name: 'Users', path: '/user-management', hasDropdown: false, icon: Users }] : []),
  ];

  const inventoryDropdownItems = [
    { name: 'Stock In', path: '/stock-in' },
    { name: 'Stock Out', path: '/stock-issuance' },
    { name: 'Stock Return', path: '/stock-returns' },
  ];

  const isActive = (path) => location.pathname === path;

  const isInventoryActive = () =>
    inventoryDropdownItems.some(item => location.pathname === item.path);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsMobileInventoryOpen(false);
  };

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsInventoryOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsInventoryOpen(false);
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
          onClick={() => handleNavigation('/dashboard')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 bg-blue-400 rounded-md flex items-center justify-center">
            <Package size={16} className="text-white" />
          </div>
          <span className="text-white font-bold text-base tracking-wide leading-none">IMS</span>
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
        {menuItems.map((item) => {
          const active = item.path ? isActive(item.path) : isInventoryActive();

          if (item.hasDropdown) {
            return (
              <div
                key={item.name}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <div
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm transition-colors rounded-sm cursor-pointer ${
                    active
                      ? 'text-white font-semibold border-b-2 border-white'
                      : 'text-blue-200 hover:text-white'
                  }`}
                  style={active ? { borderRadius: 0 } : {}}
                >
                  <item.icon size={14} className="text-white flex-shrink-0" />
                  {item.name}
                  <ChevronDown size={10} className={`mt-0.5 transition-transform duration-200 ${isInventoryOpen ? 'rotate-180' : ''}`} />
                </div>

                {isInventoryOpen && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-[9999]"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    {inventoryDropdownItems.map((dropdownItem) => (
                      <div
                        key={dropdownItem.name}
                        onClick={() => handleNavigation(dropdownItem.path)}
                        className={`block px-4 py-2 text-sm cursor-pointer rounded-md mx-1 ${
                          location.pathname === dropdownItem.path
                            ? 'bg-gray-100 text-[#1A8FA0] font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {dropdownItem.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div
              key={item.name}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center gap-1 px-3 py-1.5 text-sm transition-colors rounded-sm cursor-pointer ${
                active
                  ? 'text-white font-semibold border-b-2 border-white'
                  : 'text-blue-200 hover:text-white'
              }`}
              style={active ? { borderRadius: 0 } : {}}
            >
              <item.icon size={14} className="text-white flex-shrink-0" />
              {item.name}
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="hidden lg:flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 w-52">
        <Search size={13} className="text-blue-200 flex-shrink-0" />
        <input
          placeholder="Search resources..."
          className="bg-transparent text-xs text-white outline-none w-full placeholder-blue-300"
        />
      </div>

      {/* Bell */}
      <button className="relative p-2 ml-1 cursor-pointer hidden lg:block">
        <Bell size={17} className="text-blue-200" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full border border-[#0B4E89]" />
      </button>

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
                placeholder="Search resources..."
                className="bg-transparent text-xs text-white outline-none w-full placeholder-blue-300"
              />
            </div>

            {menuItems.map((item) => {
              const active = item.path ? isActive(item.path) : isInventoryActive();

              if (item.hasDropdown) {
                return (
                  <div key={item.name}>
                    <div
                      onClick={() => setIsMobileInventoryOpen(!isMobileInventoryOpen)}
                      className={`flex items-center justify-between px-3 py-2 text-sm rounded-lg cursor-pointer ${
                        active
                          ? 'text-white font-semibold bg-white/10'
                          : 'text-blue-200 hover:bg-white/10'
                      }`}
                    >
                      <span className="flex items-center gap-2"><item.icon size={14} className="text-white flex-shrink-0" />{item.name}</span>
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isMobileInventoryOpen ? 'rotate-180' : ''}`} />
                    </div>

                    {isMobileInventoryOpen && (
                      <div className="ml-4 mt-1 space-y-1">
                        {inventoryDropdownItems.map((dropdownItem) => (
                          <div
                            key={dropdownItem.name}
                            onClick={() => handleNavigation(dropdownItem.path)}
                            className={`px-3 py-2 text-sm rounded-lg cursor-pointer ${
                              location.pathname === dropdownItem.path
                                ? 'text-white font-semibold bg-white/10'
                                : 'text-blue-200 hover:bg-white/10'
                            }`}
                          >
                            {dropdownItem.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer ${
                    active
                      ? 'text-white font-semibold bg-white/10'
                      : 'text-blue-200 hover:bg-white/10'
                  }`}
                >
                  <item.icon size={14} className="text-white flex-shrink-0" />
                  {item.name}
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

            <div className="flex items-center gap-2 px-3 py-2">
              <Bell size={17} className="text-blue-200" />
              <span className="text-blue-200 text-sm">Notifications</span>
              <span className="ml-auto w-2 h-2 bg-[#EF4444] rounded-full" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
