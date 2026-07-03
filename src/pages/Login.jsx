import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff, TrendingUp, Package, Users, Activity } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    let email = '';
    let password = '';

    if (role === 'dwece') {
      email = 'dwece@system.com';
      password = 'Dwece@123';
    } else if (role === 'viewer') {
      email = 'ims_viewer@system.com';
      password = 'Viewer@123';
    } else if (role === 'manager') {
      email = 'ims_manager@system.com';
      password = 'Manager@123';
    } else if (role === 'cmes') {
      email = 'cmes@system.com';
      password = 'Cmes@123';
    } else if (role === 'agesges') {
      email = 'agesges@system.com';
      password = 'AgesGes@123';
    } else if (role === 'chargehead') {
      email = 'chargehead@system.com';
      password = 'Charge@123';
    } else if (role === 'tradesman') {
      email = 'tradesman@system.com';
      password = 'Tradesman@123';
    }

    setFormData({ email, password });
    
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        if (role === 'tradesman') {
          navigate('/employee-profile');
        } else {
          navigate('/');
        }
      } else {
        setError(result.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans bg-[#E8F4FF]">
      {/* ==================== LEFT: VIDEO + COMMAND CENTER ==================== */}
      <div className="flex-[1.2] relative overflow-hidden hidden lg:block">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/navy-poster.jpg"
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src="/navy-optimized.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-br from-[#1E4D7B]/85 via-[#1A3A5C]/60 to-[#E8F4FF]/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#E8F4FF]/20 via-transparent to-transparent"></div>

        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="lgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0L0 0 0 40" fill="none" stroke="white" strokeWidth="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lgrid)" />
          </svg>
        </div>

        <div className="absolute top-0 left-0 right-0 px-4 sm:px-6 xl:px-10 flex items-center justify-between py-4 sm:py-5 xl:py-6">
          <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
            <div className="w-8 h-8 sm:w-9 sm:h-9 xl:w-10 xl:h-10 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center shrink-0">
              <svg width="16" height="16" className="sm:w-[18px] sm:h-[18px] xl:w-5 xl:h-5" viewBox="0 0 40 40" fill="none">
                <path d="M20 12L28 17V23L20 28L12 23V17L20 12Z" stroke="white" strokeWidth="2.5" fill="none"/>
                <path d="M20 20L28 15.5M20 20L12 15.5M20 20V28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex flex-col items-center justify-center min-w-0 self-center">
              <span className="text-white font-bold text-xs sm:text-sm xl:text-base leading-tight truncate">System IMS/HRMS</span>
              <span className="text-white/40 text-[9px] sm:text-[10px] xl:text-[11px] font-medium leading-tight">Enterprise v4.2</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 xl:gap-5">
            <span className="text-emerald-300 text-[8px] sm:text-[9px] xl:text-[10px] font-mono tracking-wider flex items-center justify-center gap-1 sm:gap-1.5">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse shrink-0"></span>
              <span className="hidden xl:inline text-center">ALL SYSTEMS OPERATIONAL</span>
            </span>
            <span className="text-white/30 text-[8px] sm:text-[9px] xl:text-[10px] font-mono text-center hidden sm:inline">12:24:06 UTC</span>
          </div>
        </div>

        <div className="absolute left-6 xl:left-10 top-1/4 xl:top-1/3 max-w-[260px] xl:max-w-md">
          <h1 className="text-[1.8rem] xl:text-[2.8rem] font-bold text-white leading-tight tracking-tight drop-shadow-lg">
            Enterprise Command<br />
            <span className="bg-gradient-to-r from-[#81D4FA] to-[#4FC3F7] bg-clip-text text-transparent">Control Center</span>
          </h1>
          <p className="text-white/60 text-sm xl:text-base mt-2 xl:mt-3 leading-relaxed drop-shadow">
            Real-time inventory and workforce intelligence platform powering data-driven decisions across your entire organization.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 xl:p-8">
          <div className="flex gap-3 xl:gap-5 flex-wrap">
            <div className="flex-1 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-xl p-4 xl:p-5 min-w-0 shadow-lg shadow-black/10">
              <div className="flex items-center justify-between mb-2 xl:mb-3">
                <div className="flex items-center gap-1.5 xl:gap-2 min-w-0">
                  <Users size={14} className="text-[#81D4FA] shrink-0" />
                  <span className="text-white/60 text-[9px] xl:text-[11px] font-bold uppercase tracking-wider truncate">Active Sessions</span>
                </div>
                <span className="text-white text-sm xl:text-base font-bold shrink-0">847</span>
              </div>
              <svg width="100%" height="32" viewBox="0 0 200 28" className="overflow-visible">
                <path d="M0 24 Q 20 22, 40 14 T 80 18 T 120 6 T 160 10 T 200 4" fill="none" stroke="#81D4FA" strokeWidth="1.5" strokeLinecap="round" opacity="0.9"/>
                <path d="M0 24 Q 20 22, 40 14 T 80 18 T 120 6 T 160 10 T 200 4" fill="none" stroke="#81D4FA" strokeWidth="4" strokeLinecap="round" opacity="0.15"/>
                <circle cx="200" cy="4" r="2.5" fill="#81D4FA" opacity="0.7"/>
                <path d="M0 24 Q 20 22, 40 14 T 80 18 T 120 6 T 160 10 T 200 4 L 200 28 L 0 28 Z" fill="url(#sGrad)" opacity="0.12"/>
                <defs>
                  <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#81D4FA" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#81D4FA" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="flex-1 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-xl p-4 xl:p-5 min-w-0 shadow-lg shadow-black/10">
              <div className="flex items-center justify-between mb-2 xl:mb-3">
                <div className="flex items-center gap-1.5 xl:gap-2 min-w-0">
                  <Package size={14} className="text-[#4FC3F7] shrink-0" />
                  <span className="text-white/60 text-[9px] xl:text-[11px] font-bold uppercase tracking-wider truncate">Inventory Flow</span>
                </div>
                <span className="text-white text-sm xl:text-base font-bold shrink-0">+12.4%</span>
              </div>
              <svg width="100%" height="32" viewBox="0 0 208 28">
                <rect x="2" y="18" width="18" height="10" rx="1.5" fill="#81D4FA" opacity="0.5"/>
                <rect x="24" y="11" width="18" height="17" rx="1.5" fill="#81D4FA" opacity="0.4"/>
                <rect x="46" y="14" width="18" height="14" rx="1.5" fill="#4FC3F7" opacity="0.7"/>
                <rect x="68" y="8" width="18" height="20" rx="1.5" fill="#81D4FA" opacity="0.4"/>
                <rect x="90" y="5" width="18" height="23" rx="1.5" fill="#4FC3F7" opacity="0.8"/>
                <rect x="112" y="12" width="18" height="16" rx="1.5" fill="#81D4FA" opacity="0.4"/>
                <rect x="134" y="7" width="18" height="21" rx="1.5" fill="#4FC3F7" opacity="0.7"/>
                <rect x="156" y="16" width="18" height="12" rx="1.5" fill="#81D4FA" opacity="0.4"/>
                <rect x="178" y="10" width="18" height="18" rx="1.5" fill="#4FC3F7" opacity="0.6"/>
                <rect x="200" y="18" width="8" height="10" rx="1.5" fill="#81D4FA" opacity="0.4"/>
              </svg>
            </div>

            <div className="flex-1 bg-white/[0.08] backdrop-blur-xl border border-white/[0.12] rounded-xl p-4 xl:p-5 min-w-0 shadow-lg shadow-black/10">
              <div className="flex items-center justify-between mb-2 xl:mb-3">
                <div className="flex items-center gap-1.5 xl:gap-2">
                  <Activity size={14} className="text-emerald-300 shrink-0" />
                  <span className="text-white/60 text-[9px] xl:text-[11px] font-bold uppercase tracking-wider">Health</span>
                </div>
              </div>
              <div className="flex items-center gap-3 xl:gap-4">
                <svg width="40" height="40" viewBox="0 0 40 40" className="xl:w-12 xl:h-12 shrink-0">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="white" strokeWidth="3" opacity="0.1"/>
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#81D4FA" strokeWidth="3" strokeDasharray="88 12" strokeDashoffset="0" transform="rotate(-90 20 20)" opacity="0.8"/>
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#4FC3F7" strokeWidth="3" strokeDasharray="12 88" strokeDashoffset="-100" transform="rotate(-90 20 20)" opacity="0.5"/>
                </svg>
                <div>
                  <div className="text-white text-base xl:text-lg font-bold">98.7%</div>
                  <div className="text-white/40 text-[9px] xl:text-[10px] font-medium">uptime</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== RIGHT: LIGHT LOGIN FORM WITH PATTERN ==================== */}
      <div className="flex-1 lg:flex-[0.55] flex items-center justify-center p-3 sm:p-4 relative bg-[#F5FAFF]">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]">
            <svg className="w-full h-full" viewBox="0 0 500 800" preserveAspectRatio="xMidYMid slice">
              <path d="M-50,100 C 80,20  120,200  250,150 S 400,300  550,200" fill="none" stroke="#1E4D7B" strokeWidth="40" strokeLinecap="round" opacity="0.8"/>
              <path d="M550,50 C 400,150  350,50  200,120 S 50,280  -50,200" fill="none" stroke="#1A8FA0" strokeWidth="35" strokeLinecap="round" opacity="0.6"/>
              <path d="M-50,400 C 150,300  100,500  250,450 S 400,600  550,500" fill="none" stroke="#1E4D7B" strokeWidth="30" strokeLinecap="round" opacity="0.5"/>
              <path d="M550,350 C 350,450  400,300  200,370 S 50,550  -50,480" fill="none" stroke="#1A8FA0" strokeWidth="25" strokeLinecap="round" opacity="0.5"/>
              <path d="M-50,650 C 100,550  150,700  300,620 S 450,800  550,700" fill="none" stroke="#1E4D7B" strokeWidth="35" strokeLinecap="round" opacity="0.4"/>
              <path d="M550,600 C 400,700  300,550  150,650 S 0,800  -50,750" fill="none" stroke="#1A8FA0" strokeWidth="20" strokeLinecap="round" opacity="0.4"/>
            </svg>
          </div>
          <div className="absolute inset-0 opacity-[0.03]">
            <svg className="w-full h-full" viewBox="0 0 500 800" preserveAspectRatio="xMidYMid slice">
              <path d="M-50,160 C 80,80  120,260  250,210 S 400,360  550,260" fill="none" stroke="#4FC3F7" strokeWidth="15" strokeLinecap="round" opacity="0.5"/>
              <path d="M550,110 C 400,210  350,110  200,180 S 50,340  -50,260" fill="none" stroke="#4FC3F7" strokeWidth="12" strokeLinecap="round" opacity="0.5"/>
              <path d="M-50,460 C 150,360  100,560  250,510 S 400,660  550,560" fill="none" stroke="#4FC3F7" strokeWidth="10" strokeLinecap="round" opacity="0.5"/>
              <path d="M550,410 C 350,510  400,360  200,430 S 50,610  -50,540" fill="none" stroke="#4FC3F7" strokeWidth="8" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
        </div>

        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent hidden lg:block"></div>

        <div className="w-full max-w-xs sm:max-w-sm relative z-10">

          <div className="flex flex-col items-center mb-4 sm:mb-5 text-center">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[#1A8FA0] to-[#1E4D7B] rounded-2xl flex items-center justify-center shadow-lg shadow-[#1A8FA0]/15 mb-2 sm:mb-3">
              <LogIn size={16} className="text-white" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1E4D7B] mb-0.5 tracking-tight">Welcome Back</h2>
            <p className="text-gray-400 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em]">Secure Enterprise Access</p>
          </div>

          {error && (
            <div className="mb-4 sm:mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold">!</span>
              </div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
            <div className="space-y-1">
              <label className="block text-gray-400 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest ml-1">
                Email Address
              </label>
              <div className="relative group">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A8FA0] transition-colors">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@system.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full py-2 px-3 sm:px-4 pl-9 sm:pl-11 bg-white border border-gray-200 rounded-xl text-gray-800 text-[12px] sm:text-sm focus:outline-none focus:border-[#1A8FA0]/50 focus:ring-2 focus:ring-[#1A8FA0]/8 transition-all placeholder:text-gray-300 shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-gray-400 text-[8px] sm:text-[9px] font-bold uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative group">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#1A8FA0] transition-colors">
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full py-2 px-3 sm:px-4 pl-9 sm:pl-11 bg-white border border-gray-200 rounded-xl text-gray-800 text-[12px] sm:text-sm focus:outline-none focus:border-[#1A8FA0]/50 focus:ring-2 focus:ring-[#1A8FA0]/8 transition-all placeholder:text-gray-300 shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#1E4D7B] transition-colors"
                >
                  {showPassword ? <EyeOff size={14} className="sm:w-[14px] sm:h-[14px]" /> : <Eye size={14} className="sm:w-[14px] sm:h-[14px]" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-[9px] sm:text-[10px] px-1">
              <label className="flex items-center gap-2 text-gray-400 hover:text-[#1E4D7B] cursor-pointer transition-colors">
                <input type="checkbox" className="w-3 h-3 rounded border-gray-300 text-[#1A8FA0] focus:ring-[#1A8FA0]" />
                Remember
              </label>
              <a href="/forgot-password" className="text-[#1A8FA0] font-semibold hover:text-[#1E4D7B] transition-colors text-[8px] sm:text-[9px]">
                Recover Password
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-2 sm:py-2.5 bg-gradient-to-r from-[#1A8FA0] to-[#1E4D7B] text-white font-bold rounded-xl shadow-md shadow-[#1A8FA0]/20 hover:shadow-lg hover:shadow-[#1A8FA0]/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <span className="relative flex items-center justify-center gap-2 text-xs sm:text-sm">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogIn size={13} />
                    Sign In
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.15em]">Quick Demo Access</span>
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>

            <div className="max-h-[260px] overflow-y-auto space-y-1.5 pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gradient-to-b [&::-webkit-scrollbar-thumb]:from-[#1A8FA0] [&::-webkit-scrollbar-thumb]:to-[#1E4D7B] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-0">
              <button
                type="button"
                onClick={() => handleDemoLogin('dwece')}
                className="w-full bg-gray-50 border border-gray-100 py-2 px-3 rounded-xl flex justify-between items-center group hover:bg-white hover:border-[#1A8FA0]/20 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">DWECE Access</span>
                  <span className="text-[#1E4D7B] text-[12px] font-mono font-semibold mt-0.5 truncate">dwece@system.com</span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-gray-400 text-[8px] font-bold uppercase tracking-wider">Pass</span>
                  <div className="text-emerald-600 text-[11px] font-mono font-semibold mt-0.5">Dwece@123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('cmes')}
                className="w-full bg-gray-50 border border-gray-100 py-2 px-3 rounded-xl flex justify-between items-center group hover:bg-white hover:border-[#1A8FA0]/20 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">CMES Access</span>
                  <span className="text-[#1E4D7B] text-[12px] font-mono font-semibold mt-0.5 truncate">cmes@system.com</span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-gray-400 text-[8px] font-bold uppercase tracking-wider">Pass</span>
                  <div className="text-emerald-600 text-[11px] font-mono font-semibold mt-0.5">Cmes@123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('agesges')}
                className="w-full bg-gray-50 border border-gray-100 py-2 px-3 rounded-xl flex justify-between items-center group hover:bg-white hover:border-[#1A8FA0]/20 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">AGE'S/GE'S Access</span>
                  <span className="text-[#1E4D7B] text-[12px] font-mono font-semibold mt-0.5 truncate">agesges@system.com</span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-gray-400 text-[8px] font-bold uppercase tracking-wider">Pass</span>
                  <div className="text-emerald-600 text-[11px] font-mono font-semibold mt-0.5">AgesGes@123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('manager')}
                className="w-full bg-gray-50 border border-gray-100 py-2 px-3 rounded-xl flex justify-between items-center group hover:bg-white hover:border-[#1A8FA0]/20 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">IMS Manager Access</span>
                  <span className="text-[#1E4D7B] text-[12px] font-mono font-semibold mt-0.5 truncate">ims_manager@system.com</span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-gray-400 text-[8px] font-bold uppercase tracking-wider">Pass</span>
                  <div className="text-emerald-600 text-[11px] font-mono font-semibold mt-0.5">Manager@123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('chargehead')}
                className="w-full bg-gray-50 border border-gray-100 py-2 px-3 rounded-xl flex justify-between items-center group hover:bg-white hover:border-[#1A8FA0]/20 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Charge Head Access</span>
                  <span className="text-[#1E4D7B] text-[12px] font-mono font-semibold mt-0.5 truncate">chargehead@system.com</span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-gray-400 text-[8px] font-bold uppercase tracking-wider">Pass</span>
                  <div className="text-emerald-600 text-[11px] font-mono font-semibold mt-0.5">Charge@123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('tradesman')}
                className="w-full bg-gray-50 border border-gray-100 py-2 px-3 rounded-xl flex justify-between items-center group hover:bg-white hover:border-[#1A8FA0]/20 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">Tradesman Access</span>
                  <span className="text-[#1E4D7B] text-[12px] font-mono font-semibold mt-0.5 truncate">tradesman@system.com</span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-gray-400 text-[8px] font-bold uppercase tracking-wider">Pass</span>
                  <div className="text-emerald-600 text-[11px] font-mono font-semibold mt-0.5">Tradesman@123</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-2 left-0 right-0 text-center px-4">
          <p className="text-gray-300 text-[7px] sm:text-[8px] font-medium tracking-tight">
            System IMS/HRMS Enterprise v4.2 • SSL Secured • SOC 2 Compliant
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
