import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Package, Users, LogOut, ArrowRight, Clock } from 'lucide-react';

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
    <svg width="220" height="100" viewBox="0 0 220 100" className="w-full h-full">
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E4D7B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1E4D7B" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {bars.map((b, i) => (
        <rect key={i} x={8 + i * 26} y={100 - b.h} width={16} height={b.h} rx={3} fill={b.color} opacity={0.7 - i * 0.05} />
      ))}
    </svg>
  );
}

function MiniDonut({ size = 60, pct = 72 }) {
  const r = (size / 2) - 5;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E0E8EC" strokeWidth="5" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#1A8FA0" strokeWidth="5"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function MiniSparkline({ color = '#1A8FA0', points = [10, 25, 18, 35, 28, 42, 38] }) {
  const w = 140, h = 56;
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
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#E8F4FF] flex flex-col font-sans relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 opacity-[0.08] pointer-events-none">
        <svg width="320" height="320" viewBox="0 0 200 200">
          <circle cx="160" cy="40" r="120" fill="#1E4D7B" />
          <circle cx="200" cy="120" r="80" fill="#1A8FA0" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 opacity-[0.06] pointer-events-none">
        <svg width="280" height="280" viewBox="0 0 200 200">
          <circle cx="40" cy="160" r="100" fill="#1E4D7B" />
          <circle cx="0" cy="80" r="70" fill="#1A8FA0" />
        </svg>
      </div>

      {/* Decorative Mini Charts */}
      <div className="absolute right-12 top-28 hidden lg:block pointer-events-none">
        <div className="bg-white/80 rounded-xl border border-[#E0E8EC] p-4 shadow-sm">
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Stock Trend</div>
          <MiniBarChart />
        </div>
      </div>
      <div className="absolute left-12 top-32 hidden lg:block pointer-events-none">
        <div className="bg-white/80 rounded-xl border border-[#E0E8EC] p-4 shadow-sm">
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Performance</div>
          <MiniSparkline />
        </div>
      </div>
      <div className="absolute right-16 bottom-32 hidden lg:block pointer-events-none">
        <div className="bg-white/80 rounded-xl border border-[#E0E8EC] p-4 shadow-sm flex items-center gap-4">
          <MiniDonut size={60} pct={72} />
          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Health</div>
            <div className="text-base font-bold text-[#1E4D7B]">72%</div>
          </div>
        </div>
      </div>
      <div className="absolute left-12 bottom-36 hidden lg:block pointer-events-none">
        <div className="bg-white/80 rounded-xl border border-[#E0E8EC] p-4 shadow-sm">
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Returns</div>
          <MiniSparkline color="#1E4D7B" points={[32, 28, 35, 30, 38, 34, 40]} />
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #1E4D7B 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between px-6 lg:px-10 py-4 bg-white border-b border-[#E0E8EC]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1E4D7B] rounded-lg flex items-center justify-center shadow-sm">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
              <path d="M20 12L28 17V23L20 28L12 23V17L20 12Z" stroke="white" strokeWidth="2.5" fill="none"/>
              <path d="M20 20L28 15.5M20 20L12 15.5M20 20V28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[#1E4D7B] font-bold text-base tracking-tight">System IMS/HRMS</span>
          <span className="text-gray-300 text-[10px] font-medium ml-1">v4.2</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[#1A8FA0] text-[10px] font-bold uppercase tracking-widest">{user?.role?.replace(/_/g, ' ') || ''}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#1E4D7B] flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-400 hover:text-[#1E4D7B] text-xs font-semibold transition-colors px-3 py-2 rounded-lg hover:bg-[#E8F4FF] border border-transparent hover:border-[#E0E8EC]"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E0E8EC] text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-5 shadow-sm">
            <Clock size={12} className="text-[#1A8FA0]" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#1E4D7B] mb-2 tracking-tight">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-gray-400 text-sm font-medium">Select a module to access its dashboard and tools</p>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-2xl lg:max-w-3xl w-full">
          {/* IMS Card */}
          <div
            onClick={() => navigate('/dashboard')}
            className="group relative bg-white rounded-2xl border border-[#E0E8EC] p-8 cursor-pointer hover:border-[#1E4D7B]/30 hover:shadow-lg hover:shadow-[#1E4D7B]/5 transition-all duration-300 text-center"
          >
            {/* Decorative top accent line */}
            <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-[#1E4D7B] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Hover ring */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-[#1E4D7B]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#1E4D7B] to-[#296FA8] rounded-2xl flex items-center justify-center shadow-md shadow-[#1E4D7B]/10 group-hover:scale-110 group-hover:-rotate-2 transition-all duration-300">
                <Package size={28} className="text-white" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#1E4D7B] mb-3">IMS</h2>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed max-w-xs mx-auto">
              Inventory Management System — track stock, manage procurement, oversee vendors and returns.
            </p>

            <div className="flex justify-center flex-wrap gap-2 mb-7">
              {['Inventory', 'Stock', 'Procurement', 'Reports'].map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-[#E8F4FF] text-[10px] font-semibold text-[#1E4D7B] uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 text-[#1A8FA0] font-semibold text-sm group-hover:gap-3 transition-all">
              Enter IMS Dashboard
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* HRMS Card */}
          <div
            onClick={() => navigate('/hrm-dashboard')}
            className="group relative bg-white rounded-2xl border border-[#E0E8EC] p-8 cursor-pointer hover:border-[#0B4E89]/30 hover:shadow-lg hover:shadow-[#0B4E89]/5 transition-all duration-300 text-center"
          >
            {/* Decorative top accent line */}
            <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-[#0B4E89] to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Hover ring */}
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-[#0B4E89]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />

            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0B4E89] to-[#1A7FC4] rounded-2xl flex items-center justify-center shadow-md shadow-[#0B4E89]/10 group-hover:scale-110 group-hover:rotate-2 transition-all duration-300">
                <Users size={28} className="text-white" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-[#0B4E89] mb-3">HRMS</h2>
            <p className="text-gray-400 text-sm mb-5 leading-relaxed max-w-xs mx-auto">
              Human Resource Management System — manage personnel, attendance, leave, and performance.
            </p>

            <div className="flex justify-center flex-wrap gap-2 mb-7">
              {['Personnel', 'Attendance', 'Leave', 'Training'].map((tag, i) => (
                <span key={i} className="px-3 py-1 rounded-lg bg-[#E8F4FF] text-[10px] font-semibold text-[#0B4E89] uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 text-[#1A8FA0] font-semibold text-sm group-hover:gap-3 transition-all">
              Enter HRMS Dashboard
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Bottom Badges */}
        <div className="mt-14 flex flex-wrap justify-center gap-6 lg:gap-10 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
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
