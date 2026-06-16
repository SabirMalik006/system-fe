import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, ArrowLeft, ArrowRight, Package, Users, Clock } from 'lucide-react';

function MiniBarChart() {
  const bars = [
    { h: 52, color: '#1E4D7B' },
    { h: 76, color: '#1E4D7B' },
    { h: 60, color: '#1A8FA0' },
    { h: 92, color: '#1E4D7B' },
    { h: 68, color: '#1A8FA0' },
    { h: 84, color: '#1E4D7B' },
    { h: 48, color: '#1A8FA0' },
    { h: 80, color: '#1E4D7B' },
  ];
  return (
    <svg width="180" height="80" viewBox="0 0 180 80">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E4D7B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1E4D7B" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {bars.map((b, i) => (
        <rect key={i} x={7 + i * 21} y={80 - b.h} width={12} height={b.h} rx={2} fill={b.color} opacity={0.7 - i * 0.04} />
      ))}
    </svg>
  );
}

function MiniDonut({ size = 50, pct = 72 }) {
  const r = (size / 2) - 4;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffffff10" strokeWidth="4" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#1A8FA0" strokeWidth="4"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function MiniSparkline({ color = '#1A8FA0', points = [10, 25, 18, 35, 28, 42, 38] }) {
  const w = 120, h = 44;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = w / (points.length - 1);
  const d = points.map((p, i) => {
    const x = i * step;
    const y = h - ((p - min) / range) * (h - 6) - 3;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={`${d} L${w},${h} L0,${h} Z`} fill="url(#sparkGrad)" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={points[points.length - 1]} r="2" fill={color} />
    </svg>
  );
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const hrmsColor = '#0B4E89';
  const hrmsLight = '#1A7FC4';
  const imsColor = '#1E4D7B';
  const imsLight = '#296FA8';

  return (
    <div className="min-h-screen bg-[#0A1628] flex flex-col relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 opacity-[0.06] pointer-events-none">
        <svg width="320" height="320" viewBox="0 0 200 200">
          <circle cx="160" cy="40" r="120" fill="#1E4D7B" />
          <circle cx="200" cy="120" r="80" fill="#1A8FA0" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 opacity-[0.05] pointer-events-none">
        <svg width="280" height="280" viewBox="0 0 200 200">
          <circle cx="40" cy="160" r="100" fill="#1E4D7B" />
          <circle cx="0" cy="80" r="70" fill="#1A8FA0" />
        </svg>
      </div>

      {/* Rainbow/Ribbon decorative arc */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none overflow-hidden opacity-[0.08]">
        <svg viewBox="0 0 600 200" className="w-full h-full">
          <defs>
            <linearGradient id="rainbow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0B4E89" />
              <stop offset="33%" stopColor="#1E4D7B" />
              <stop offset="66%" stopColor="#1A8FA0" />
              <stop offset="100%" stopColor="#296FA8" />
            </linearGradient>
          </defs>
          <path d="M50 200 Q300 20 550 200" fill="none" stroke="url(#rainbow)" strokeWidth="2" />
          <path d="M80 200 Q300 40 520 200" fill="none" stroke="url(#rainbow)" strokeWidth="1" opacity="0.6" />
          <path d="M110 200 Q300 60 490 200" fill="none" stroke="url(#rainbow)" strokeWidth="0.5" opacity="0.3" />
        </svg>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Decorative Mini Charts */}
      <div className="absolute right-8 top-24 hidden lg:block pointer-events-none">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-lg">
          <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-2">Stock Trend</div>
          <MiniBarChart />
        </div>
      </div>
      <div className="absolute left-8 top-28 hidden lg:block pointer-events-none">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-lg">
          <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-2">Performance</div>
          <MiniSparkline />
        </div>
      </div>
      <div className="absolute right-12 bottom-28 hidden lg:block pointer-events-none">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-lg flex items-center gap-3">
          <MiniDonut size={50} pct={72} />
          <div>
            <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Health</div>
            <div className="text-sm font-bold text-white">72%</div>
          </div>
        </div>
      </div>
      <div className="absolute left-8 bottom-32 hidden lg:block pointer-events-none">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/5 p-3 shadow-lg">
          <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-2">Returns</div>
          <MiniSparkline color="#1E4D7B" points={[32, 28, 35, 30, 38, 34, 40]} />
        </div>
      </div>

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 lg:px-10 py-4 bg-[#0D1E3C]/80 border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#1E4D7B] to-[#0B4E89] rounded-lg flex items-center justify-center shadow-lg shadow-black/20">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
              <path d="M20 12L28 17V23L20 28L12 23V17L20 12Z" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M20 20L28 15.5M20 20L12 15.5M20 20V28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-white font-bold text-base tracking-tight">System IMS/HRMS</span>
          <span className="text-gray-600 text-[10px] font-medium ml-1">v4.2</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[#1A8FA0] text-[10px] font-bold uppercase tracking-widest">{user?.role?.replace(/_/g, ' ') || ''}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1E4D7B] to-[#0B4E89] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-black/20">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-white text-xs font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 py-8">
        {/* Welcome text */}
        <div className="text-center mb-6 lg:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
            <Clock size={12} className="text-[#1A8FA0]" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1 tracking-tight">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-gray-500 text-sm font-medium">Select a module to continue</p>
        </div>

        {/* Pie Chart */}
        <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[480px] lg:h-[480px]">
          {/* SVG Pie with 3D effect */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl" style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.5))' }}>
            <defs>
              {/* IMS gradient - 3D lighting from top-left */}
              <linearGradient id="imsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#296FA8" />
                <stop offset="40%" stopColor="#1E4D7B" />
                <stop offset="100%" stopColor="#122A44" />
              </linearGradient>
              <linearGradient id="imsGradHover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B8BC4" />
                <stop offset="40%" stopColor="#296FA8" />
                <stop offset="100%" stopColor="#1E4D7B" />
              </linearGradient>

              {/* HRMS gradient - 3D lighting from top-left */}
              <linearGradient id="hrmsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1A7FC4" />
                <stop offset="40%" stopColor="#0B4E89" />
                <stop offset="100%" stopColor="#062A4F" />
              </linearGradient>
              <linearGradient id="hrmsGradHover" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B9BD4" />
                <stop offset="40%" stopColor="#1A7FC4" />
                <stop offset="100%" stopColor="#0B4E89" />
              </linearGradient>

              {/* Highlight shimmer */}
              <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
              </linearGradient>

              {/* Drop shadow for 3D depth */}
              <filter id="pieShadow">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* 3D extrusion layer (offset) */}
            <path
              d="M 50 50 L 50 4 A 50 50 0 0 0 50 96 Z"
              fill="#031525"
              opacity="0.3"
              transform="translate(0, 3)"
            />
            <path
              d="M 50 50 L 50 4 A 50 50 0 0 1 50 96 Z"
              fill="#031525"
              opacity="0.3"
              transform="translate(0, 3)"
            />

            {/* Left half - HRMS */}
            <g filter="url(#pieShadow)">
              <path
                d="M 50 50 L 50 0 A 50 50 0 0 0 50 100 Z"
                fill={hovered === 'hrms' ? 'url(#hrmsGradHover)' : 'url(#hrmsGrad)'}
                stroke="#ffffff15"
                strokeWidth="0.3"
                className="transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/hrm-dashboard')}
                onMouseEnter={() => setHovered('hrms')}
                onMouseLeave={() => setHovered(null)}
                style={{
                  filter: hovered === 'hrms' ? 'brightness(1.15)' : hovered === 'ims' ? 'brightness(0.5) saturate(0.3)' : 'brightness(1)',
                }}
              />
              {/* Shimmer overlay */}
              <path
                d="M 50 50 L 50 0 A 50 50 0 0 0 50 100 Z"
                fill="url(#shimmer)"
                className="pointer-events-none"
                opacity={hovered === 'hrms' ? 0.3 : 0.15}
              />
              {/* Inner edge highlight */}
              <path
                d="M 50 4 A 46 46 0 0 0 50 96"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.08"
                strokeWidth="0.5"
                className="pointer-events-none"
              />
            </g>

            {/* Right half - IMS */}
            <g filter="url(#pieShadow)">
              <path
                d="M 50 50 L 50 0 A 50 50 0 0 1 50 100 Z"
                fill={hovered === 'ims' ? 'url(#imsGradHover)' : 'url(#imsGrad)'}
                stroke="#ffffff15"
                strokeWidth="0.3"
                className="transition-all duration-300 cursor-pointer"
                onClick={() => navigate('/dashboard')}
                onMouseEnter={() => setHovered('ims')}
                onMouseLeave={() => setHovered(null)}
                style={{
                  filter: hovered === 'ims' ? 'brightness(1.15)' : hovered === 'hrms' ? 'brightness(0.5) saturate(0.3)' : 'brightness(1)',
                }}
              />
              {/* Shimmer overlay */}
              <path
                d="M 50 50 L 50 0 A 50 50 0 0 1 50 100 Z"
                fill="url(#shimmer)"
                className="pointer-events-none"
                opacity={hovered === 'ims' ? 0.3 : 0.15}
              />
              {/* Inner edge highlight */}
              <path
                d="M 50 4 A 46 46 0 0 1 50 96"
                fill="none"
                stroke="#ffffff"
                strokeOpacity="0.08"
                strokeWidth="0.5"
                className="pointer-events-none"
              />
            </g>

            {/* Center dividing line with glow */}
            <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="0.5" />

            {/* Outer ring highlight (3D rim) */}
            <circle cx="50" cy="50" r="49.5" fill="none" stroke="#ffffff20" strokeWidth="0.5" />

            {/* Labels inside the pie */}
            {/* HRMS label (left half) */}
            <g
              className="cursor-pointer"
              onClick={() => navigate('/hrm-dashboard')}
              onMouseEnter={() => setHovered('hrms')}
              onMouseLeave={() => setHovered(null)}
              opacity={hovered === 'ims' ? 0.3 : 1}
            >
              {/* Icon background circle */}
              <circle cx="28" cy="42" r="7" fill="#ffffff10" stroke="#ffffff20" strokeWidth="0.3" />
              <foreignObject x="22" y="36" width="12" height="12">
                <div className="w-full h-full flex items-center justify-center">
                  <Users size={8} className="text-white" />
                </div>
              </foreignObject>
              <text x="28" y="57" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold" fontFamily="inherit" letterSpacing="1">HRMS</text>
              <text x="28" y="63" textAnchor="middle" fill="#ffffff60" fontSize="3.5" fontFamily="inherit">Personnel</text>
            </g>

            {/* IMS label (right half) */}
            <g
              className="cursor-pointer"
              onClick={() => navigate('/dashboard')}
              onMouseEnter={() => setHovered('ims')}
              onMouseLeave={() => setHovered(null)}
              opacity={hovered === 'hrms' ? 0.3 : 1}
            >
              <circle cx="72" cy="42" r="7" fill="#ffffff10" stroke="#ffffff20" strokeWidth="0.3" />
              <foreignObject x="66" y="36" width="12" height="12">
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={8} className="text-white" />
                </div>
              </foreignObject>
              <text x="72" y="57" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold" fontFamily="inherit" letterSpacing="1">IMS</text>
              <text x="72" y="63" textAnchor="middle" fill="#ffffff60" fontSize="3.5" fontFamily="inherit">Inventory</text>
            </g>
          </svg>

          {/* Center hub */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-full bg-[#0A1628] border border-white/10 flex flex-col items-center justify-center z-10 shadow-2xl shadow-black/50">
            {/* Inner ring decoration */}
            <div className="absolute inset-1 rounded-full border border-white/5" />

            {hovered === null ? (
              <>
                <div className="text-gray-500 text-[8px] font-bold uppercase tracking-widest mb-0.5">Select</div>
                <div className="text-white/60 text-sm sm:text-base font-bold">Module</div>
              </>
            ) : (
              <>
                <div className="text-gray-500 text-[8px] font-bold uppercase tracking-widest mb-1">Selected</div>
                <div className="flex items-center gap-1.5">
                  {hovered === 'ims' ? (
                    <Package size={16} className="text-[#296FA8]" />
                  ) : (
                    <Users size={16} className="text-[#1A7FC4]" />
                  )}
                  <span className={`text-lg sm:text-xl font-bold ${hovered === 'ims' ? 'text-[#296FA8]' : 'text-[#1A7FC4]'}`}>
                    {hovered === 'ims' ? 'IMS' : 'HRMS'}
                  </span>
                </div>
                <div className="text-gray-600 text-[8px] font-medium uppercase tracking-wider mt-1">
                  Click to enter
                </div>
              </>
            )}
          </div>

          {/* Side arrows + labels */}
          {/* IMS label (right side) */}
          <div className="absolute top-1/2 -translate-y-1/2 -right-20 sm:-right-24 lg:-right-28 z-20 pointer-events-none">
            <div className="flex items-center gap-2">
              <div className={`transition-all duration-300 ${hovered === 'ims' ? 'opacity-100 -translate-x-1' : 'opacity-40'}`}>
                <ArrowLeft size={18} className="text-[#296FA8]" />
              </div>
              <div className={`transition-all duration-300 ${hovered === 'ims' ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`text-xs lg:text-sm font-bold uppercase tracking-wider ${hovered === 'ims' ? 'text-[#296FA8]' : 'text-gray-500'}`}>
                  IMS
                </div>
              </div>
            </div>
          </div>

          {/* HRMS label (left side) */}
          <div className="absolute top-1/2 -translate-y-1/2 -left-20 sm:-left-24 lg:-left-28 z-20 pointer-events-none">
            <div className="flex items-center gap-2 flex-row-reverse">
              <div className={`transition-all duration-300 ${hovered === 'hrms' ? 'opacity-100 translate-x-1' : 'opacity-40'}`}>
                <ArrowRight size={18} className="text-[#1A7FC4]" />
              </div>
              <div className={`transition-all duration-300 ${hovered === 'hrms' ? 'opacity-100' : 'opacity-40'}`}>
                <div className={`text-xs lg:text-sm font-bold uppercase tracking-wider ${hovered === 'hrms' ? 'text-[#1A7FC4]' : 'text-gray-500'}`}>
                  HRMS
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom badges */}
        <div className="mt-10 lg:mt-14 flex flex-wrap justify-center gap-6 lg:gap-8 text-gray-500 text-[10px] font-bold uppercase tracking-widest">
          {[
            { label: 'Secure Connection', color: '#1E4D7B' },
            { label: 'Real-time Sync', color: '#1A8FA0' },
            { label: '24/7 Support', color: '#0B4E89' },
            { label: 'SSL Encrypted', color: '#296FA8' },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: b.color }} />
              {b.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
