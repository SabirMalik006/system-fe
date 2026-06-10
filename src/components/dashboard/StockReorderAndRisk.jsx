import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { dashboardAPI, stockOutAPI } from '../../services/api';

const donutSegments = [
  { pct: 0.35, color: '#1A8FA0', offset: 0, path: '/items' },
  { pct: 0.25, color: '#E2E8F0', offset: 0.35, path: '/procurement-management' },
  { pct: 0.20, color: '#1E4D7B', offset: 0.60, path: '/reports' },
  { pct: 0.20, color: '#163A50', offset: 0.80, path: '/stock-returns' },
];

function DonutChart() {
  const navigate = useNavigate();
  const cx = 120, cy = 120, r = 95, stroke = 40;
  const circumference = 2 * Math.PI * r;

  function polarToXY(angleDeg, radius) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  let cumulativePct = 0;
  const segments = donutSegments.map((seg) => {
    const dash = seg.pct * circumference;
    const gap = circumference - dash;
    const rotation = cumulativePct * 360 - 90;
    cumulativePct += seg.pct;
    return { ...seg, dash, gap, rotation, path: seg.path };
  });

  const handleCenterClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      navigate('/dashboard');
    }, 300);
  };

  const handleSegmentClick = (path) => {
    navigate(path);
  };

  const imageClickHandlers = {
    '/a4.svg': () => navigate('/stock-returns'),
    '/a3.svg': () => navigate('/reports'),
    '/88.png': () => navigate('/procurement-management'),
    '/Overlay+Border+OverlayBlur.png': () => navigate('/items'),
  };

  const handleImageClick = (imgPath) => {
    if (imageClickHandlers[imgPath]) {
      imageClickHandlers[imgPath]();
    }
  };

  return (
    <div className="relative w-full max-w-[360px] h-[360px] mx-auto flex justify-center items-center">
      <svg width="360" height="360" viewBox="0 0 240 240" className="w-full h-full">
        
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={stroke}
            strokeDasharray={`${seg.dash} ${seg.gap}`}
            strokeLinecap="butt"
            transform={`rotate(${seg.rotation} ${cx} ${cy})`}
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleSegmentClick(seg.path)}
          />
        ))}

        {/* Images - Clickable */}
        {[
          { angle: 255, img: '/a4.svg', label: 'Tools', path: '/stock-returns' },
          { angle: 335, img: '/a3.svg', label: 'Consumable', path: '/reports' },
          { angle: 60, img: '/88.png', label: 'Sanitary', path: '/procurement-management' },
          { angle: 160, img: '/Overlay+Border+OverlayBlur.png', label: 'Electrical', path: '/items' },
        ].map((pos, i) => {
          const pt = polarToXY(pos.angle, r + 1);
          return (
            <g 
              key={i} 
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleImageClick(pos.img)}
            >
              <foreignObject x={pt.x - 13} y={pt.y - 15} width="33" height="33">
                <img
                  src={pos.img}
                  alt={pos.label}
                  className="w-full h-full object-contain"
                />
              </foreignObject>
            </g>
          );
        })}

        {/* White Circle Behind IMS Text with Shadow - Clickable */}
        <circle
          cx={cx}
          cy={cy}
          r="48"
          fill="white"
          style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))', cursor: 'pointer' }}
          onClick={handleCenterClick}
          className="hover:opacity-80 transition-opacity"
        />

        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fontSize="22"
          fontWeight="500"
          fill="#1A8FA0"
          style={{ dominantBaseline: 'middle', cursor: 'pointer' }}
          onClick={handleCenterClick}
          className="hover:opacity-80 transition-opacity"
        >
          IMS
        </text>
      </svg>
    </div>
  );
}

export default function StockDashboard() {
  const [depletionItems, setDepletionItems] = useState([]);
  const [issuanceItems, setIssuanceItems] = useState([]);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardAPI.getDepletion(),
      dashboardAPI.getHealth(),
      stockOutAPI.getIssuanceByUnit(),
    ]).then(([depRes, healthRes, issuanceRes]) => {
      if (depRes.data.success) setDepletionItems(depRes.data.depletion);
      if (healthRes.data.success) setHealth(healthRes.data.health);
      if (issuanceRes.data.success) {
        setIssuanceItems(issuanceRes.data.units.map(u => ({
          rank: u.rank,
          label: u.label,
          pct: `${u.percentage}%`,
          color: u.color,
          bg: u.color,
        })));
      }
    }).catch(() => {
      toast.error('Failed to load dashboard data');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const dbLoad = health?.databaseLoad || '0%';
  const syncStatus = health?.syncStatus || 'N/A';
  const opHealth = health?.operationalHealth || { normal: '0%', returned: '0%', damaged: '0%', safePercentage: 0, risk: 'N/A' };

  return (
    <div className="flex flex-col xl:flex-row gap-5 md:gap-6 p-4 md:p-6 bg-[#f4f6fb] min-h-screen w-full">

      {/* LEFT PANEL - Stock Depletion Timeline */}
      <div className="flex-1 xl:flex-[0_0_45%] bg-white rounded-2xl border border-[#E0E8EC] p-5 md:p-6 shadow-sm flex flex-col gap-6">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xs font-semibold tracking-widest text-[#1E293B] uppercase">
            Stock Depletion Timeline
          </span>
          <span className="text-[10px] text-[#3B82F6] font-semibold tracking-widest">
            PROJECTED DATA
          </span>
        </div>

        {loading ? (
          <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">Loading...</div>
        ) : depletionItems.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">No depletion data</div>
        ) : (
        <div className="flex flex-col gap-5">
          {depletionItems.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <span className="text-[13px] font-semibold text-[#1E293B]">{item.name}</span>
                  <span className="text-[10px] font-semibold text-[#8D8E90] ml-1.5">{item.tag}</span>
                </div>
                <span className="text-xs text-[#718096] whitespace-nowrap">{item.days}</span>
              </div>
              <div className="h-[6px] bg-[#edf2f7] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${item.pct}%`, background: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="mt-4">
          <DonutChart />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex flex-col gap-5">

        {/* Top Two Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#1a3a5c] rounded-xl p-5 md:p-6 text-white">
            <div className="text-md text-[#fff] mb-2 font-light">Database Load</div>
            <div className="text-3xl font-bold">{dbLoad}</div>
          </div>

          <div className="bg-[#2ec4b6] rounded-xl p-5 md:p-6 text-white">
            <div className="text-md text-white mb-2 font-light">Sync Status</div>
            <div className="text-3xl font-bold">{syncStatus}</div>
          </div>
        </div>

        {/* Operational Health Card */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
          
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 flex-wrap">
            {/* Circular Progress */}
            
            <div className="relative w-20 h-20 md:w-[80px] md:h-[80px] flex-shrink-0 mx-auto md:mx-0">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="40"
                  cy="40"
                  r="32"
                  fill="none"
                  stroke="#1A8FA0"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 32 * (opHealth.safePercentage / 100)} ${2 * Math.PI * 32 * ((100 - opHealth.safePercentage) / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(26,143,160,0.15) 0%, rgba(26,143,160,0.06) 60%, transparent 85%)',
                  }}
                />

                <div className="text-base font-bold text-[#2d3748] relative z-10">{opHealth.safePercentage}%</div>
                <div className="text-[9px] text-[#a0aec0] -mt-0.5">SAFE</div>
              </div>
            </div>

            {/* Low Risk Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="text-md font-semibold text-[#a0aec0] tracking-widest uppercase mb-2">
                Operational Health
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="text-lg md:text-2xl font-bold text-[#2d3748]">{opHealth.risk}</span>
                <span className="w-2 h-2 rounded-full bg-[#1A8FA0]" />
              </div>
              <div className="text-lg text-[#64748B]">System returns within optimal range</div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 md:gap-8 justify-center">
              {[
                { label: 'NORMAL', val: opHealth.normal, color: '#1E4D7B', bar: '#1A8FA0' },
                { label: 'RETURNED', val: opHealth.returned, color: '#1E4D7B', bar: '#1a6cb5' },
                { label: 'DAMAGED', val: opHealth.damaged, color: '#e53e3e', bar: '#e53e3e' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-[10px] text-[#94A3B8] tracking-widest mb-1 font-bold">{s.label}</div>
                  <div className="text-lg font-bold" style={{ color: s.color }}>{s.val}</div>
                  <div className="w-8 h-1 mx-auto mt-1.5" style={{ background: s.bar, borderRadius: 2 }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Issuance Items */}
        <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm flex-1">
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">Loading...</div>
          ) : issuanceItems.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-gray-400 text-sm">No issuance data</div>
          ) : (
          <div className="flex flex-col gap-5">
            {issuanceItems.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0"
                  style={{ background: item.bg }}
                >
                  {item.rank}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[#1E4D7B] tracking-widest uppercase mb-1">
                    {item.label}
                  </div>
                  <div className="text-2xl font-base text-[#2d3748] leading-none">
                    {item.pct}
                  </div>
                  <div className="text-xs text-[#163A50] font-medium mt-1">
                    Total Issuance Volume
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

      </div>
    </div>
  );
}
