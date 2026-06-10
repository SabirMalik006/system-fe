import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
        // Navigate to dashboard
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

  // Demo login for quick testing
  const handleDemoLogin = async (role) => {
    let email = '';
    let password = '';

    if (role === 'admin') {
      email = 'superadmin@system.com';
      password = 'Super@123';
    } else if (role === 'viewer') {
      email = 'ims_viewer@system.com';
      password = 'Viewer@123';
    } else if (role === 'manager') {
      email = 'ims_manager@system.com';
      password = 'Manager@123';
    }

    setFormData({ email, password });
    
    // Pass credentials directly to login function to avoid race condition with state
    setLoading(true);
    setError('');
    try {
      const result = await login(email, password);
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

  return (
    <div className="flex w-screen h-screen overflow-hidden font-sans bg-[#0B0F1E]">
      {/* Left Side - Video Background */}
      <div className="flex-1 relative overflow-hidden hidden lg:block">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover opacity-80"
        >
          <source src="/navy.mp4" type="video/mp4" />
        </video>
        
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0B0F1E]/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1E]/80 via-transparent to-transparent"></div>
      </div>

      {/* Right Side - Compact Premium Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative">
        {/* Abstract Background Glows */}
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-600/10 rounded-full blur-[80px] animate-pulse delay-700"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#161B2E]/50 backdrop-blur-xl border border-white/10 p-6 lg:p-8 rounded-[1.5rem] shadow-2xl shadow-black/50">
            
            {/* Logo/Brand Header */}
            <div className="flex flex-col items-center mb-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4 group hover:scale-110 transition-transform duration-300">
                <svg width="24" height="24" viewBox="0 0 40 40" fill="none">
                  <path d="M20 12L28 17V23L20 28L12 23V17L20 12Z" stroke="white" strokeWidth="2.5" fill="none"/>
                  <path d="M20 20L28 15.5M20 20L12 15.5M20 20V28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="text-white text-2xl lg:text-3xl font-extrabold mb-1 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                Secure Access Portal
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">
                  Email
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="admin@system.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full py-3 px-4 pl-11 bg-[#0F1423]/60 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all placeholder:text-slate-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-purple-400 transition-colors">
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full py-3 px-4 pl-11 bg-[#0F1423]/60 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder:text-slate-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-[11px] px-1">
                <label className="flex items-center gap-2 text-slate-400 hover:text-slate-200 cursor-pointer transition-colors">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 checked:bg-indigo-600" />
                  Remember Device
                </label>
                <a href="/forgot-password" className="text-indigo-400 font-bold hover:text-indigo-300">
                  Recovery?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold rounded-xl shadow-xl shadow-indigo-600/10 hover:shadow-indigo-600/30 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : 'Sign In'}
                </div>
              </button>
            </form>

            {/* Demo Keys - Now Clickable */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Quick Demo Access</span>
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
              
              {/* Admin Demo Button */}
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="w-full bg-white/5 border border-white/5 p-2.5 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer mb-2"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[8px] text-slate-500 font-bold uppercase">Admin Access</span>
                  <code className="text-indigo-400 text-[10px] font-mono">superadmin@system.com</code>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-slate-500 font-bold uppercase">Pass</span>
                  <div className="text-emerald-400 text-[10px] font-mono">Super@123</div>
                </div>
              </button>
              
              {/* Viewer Demo Button */}
              <button
                type="button"
                onClick={() => handleDemoLogin('viewer')}
                className="w-full bg-white/5 border border-white/5 p-2.5 rounded-xl flex justify-between items-center group hover:bg-white/10 transition-all cursor-pointer"
              >
                <div className="flex flex-col text-left">
                  <span className="text-[8px] text-slate-500 font-bold uppercase">Viewer Access</span>
                  <code className="text-purple-400 text-[10px] font-mono">ims_viewer@system.com</code>
                </div>
                <div className="text-right">
                  <span className="text-[8px] text-slate-500 font-bold uppercase">Pass</span>
                  <div className="text-emerald-400 text-[10px] font-mono">Viewer@123</div>
                </div>
              </button>
            </div>
          </div>
          
          <p className="mt-6 text-center text-slate-600 text-[10px] font-medium tracking-tight">
            IMS Engine v4.2 • Secured with SSL
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;