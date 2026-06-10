import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Menu, X, LogOut, Home } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
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
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Inventory', path: '/items', hasDropdown: true },
    { name: 'Procurements', path: '/procurement-management' },
    { name: 'Reports', path: '/reports' },
    { name: 'Vendors', path: '/vendors' },
  ];

  const inventoryDropdownItems = [
    { name: 'Stock In', path: '/stock-in', icon: '/Text (1).png' },
    { name: 'Stock Out', path: '/stock-issuance', icon: '/Text (2).png' },
    { name: 'Stock Return', path: '/stock-returns', icon: '/Text (3).png' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isInventoryActive = () => {
    return inventoryDropdownItems.some(item => location.pathname === item.path);
  };

  // Handle mouse enter on dropdown trigger
  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setIsInventoryOpen(true);
  };

  // Handle mouse leave on dropdown trigger and dropdown menu
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsInventoryOpen(false);
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
    <nav className="bg-[#1E4D7B] border-b border-gray-200 text-white sticky top-0 z-50">
      <div className="px-4 sm:px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center gap-4 sm:gap-8">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/Background.png" alt="IMS logo" className="w-6 h-6 sm:w-8 sm:h-8 object-cover rounded-md cursor-pointer" />
              <span className="text-lg sm:text-xl font-bold text-white">IMS</span>
            </Link>

            {/* Home Button */}
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[10px] font-semibold text-white/70 hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg transition-all ml-1"
              title="Home"
            >
              <Home size={14} />
              <span className="hidden lg:inline">Home</span>
            </Link>

            {/* Desktop Menu Items - Hidden below 1024px */}
            <div className="hidden lg:flex items-center space-x-2 lg:space-x-4">
              {menuItems.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div
                      ref={dropdownRef}
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="relative"
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center gap-1 text-xs lg:text-sm font-base text-white transition-all duration-150 rounded-xl px-3 lg:px-6 py-1 hover:bg-[#2166A0] hover:text-white whitespace-nowrap ${
                          isActive(item.path) ? 'bg-[#2166A0]' : ''
                        }`}
                      >
                        {item.name}
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isInventoryOpen ? 'rotate-180' : ''}`} />
                      </Link>
                      
                      {isInventoryOpen && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          {inventoryDropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.path}
                              className={`flex items-center gap-3 px-4 py-2 text-sm ${
                                location.pathname === dropdownItem.path
                                  ? ' text-black'
                                  : 'text-gray-700'
                              }`}
                            >
                              <img src={dropdownItem.icon} alt="" className="" />
                              <span>{dropdownItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`text-xs lg:text-sm font-base text-white transition-all duration-150 rounded-xl px-3 lg:px-6 py-1 hover:bg-[#2166A0] hover:text-white whitespace-nowrap ${
                        isActive(item.path) ? 'bg-[#2166A0]' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Search and Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Bar - Hidden below 1024px */}
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-9 pr-4 py-1.5 text-sm rounded-md w-40 lg:w-64 bg-[#345E88] focus:outline-none focus:ring-1 focus:ring-[#1A8FA0] placeholder:text-white/50 text-white"
              />
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <div
                className="flex items-center gap-2 cursor-pointer relative"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="relative">
                  <img src="/SVG.png" alt="" className="w-5 h-5" />
                  <p className="h-2 w-2 absolute bg-red-500 rounded-full -top-1 -right-1"></p>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <img src="/b.svg" alt="Border" className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] sm:text-xs font-medium text-white leading-tight">
                    {user?.name || 'User'} <br />
                    <span className='text-[10px] sm:text-xs font-light text-[#1A8FA0] uppercase'>{user?.role?.replace('_', ' ') || ''}</span>
                  </p>
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
              className="lg:hidden p-1 text-white hover:bg-[#2166A0] rounded-lg transition-colors"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Visible below 1024px */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 pb-3 border-t border-white/20 pt-3">
            {/* Mobile Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-md bg-[#345E88] focus:outline-none focus:ring-1 focus:ring-[#1A8FA0] placeholder:text-white/50 text-white"
              />
            </div>
            
            {/* Mobile Menu Items */}
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setIsInventoryOpen(!isInventoryOpen)}
                        className={`w-full flex items-center justify-between text-sm font-light text-white transition-all duration-150 rounded-lg px-3 py-2 hover:bg-[#2166A0] ${
                          isInventoryActive() ? 'bg-[#2166A0]' : ''
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isInventoryOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {isInventoryOpen && (
                        <div className="ml-4 mt-1 space-y-1">
                          {inventoryDropdownItems.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              to={dropdownItem.path}
                              className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
                                location.pathname === dropdownItem.path
                                  ? 'bg-[#1A8FA0] text-white'
                                  : 'text-white/80 hover:bg-[#2166A0]'
                              }`}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <img src={dropdownItem.icon} alt="" className="w-5 h-5" />
                              <span>{dropdownItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className={`block text-sm font-light text-white transition-all duration-150 rounded-lg px-3 py-2 hover:bg-[#2166A0] ${
                        isActive(item.path) ? 'bg-[#2166A0]' : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            
            {/* Mobile User Info */}
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <img src="/Border.png" alt="Border" className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.name || 'User'} <br />
                    <span className='text-xs font-light text-[#1A8FA0] uppercase'>{user?.role?.replace('_', ' ') || ''}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-300 hover:bg-[#2166A0] rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;