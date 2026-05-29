import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

const alerts = [
  { type: 'warning', title: 'Critical Stock', desc: 'Aluminum Door Handle  175mm  CMES COMKAR ', text: 'Remaining units below threshold (80 units)' , action: 'Reorder Now', actionColor: 'white', actionBg: '#dc2626' },
  { type: 'success', title: 'Approval Required', desc: 'New Vendor Registration: ,M/S Three Star Ceramic', text:'Compliance check completed. Ready for final review.', action: 'Approve', actionColor: '#ffffff', actionBg: '#094440' },
];

// helo


export default function AlertCenter() {
  return (
    <div className="bg-white rounded-lg shadow-lg border border-[#E0E8EC] p-3 sm:p-3.5 mb-4 relative overflow-hidden">
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <span className="font-semibold text-base sm:text-lg text-[#0D2B4A]">Alert Center</span>
          <span className="px-2 py-0.5 rounded-sm text-[10px] sm:text-xs font-semibold bg-[#1A8FA0] text-white">3 New</span>
        </div>
        <button className="flex items-center justify-center gap-1 text-xs sm:text-sm text-[#1A8FA0] font-semibold">
          Clear All 
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-3">
        {alerts.map((alert, i) => (
          <div key={i} className="flex-1 flex flex-col sm:flex-row items-start gap-3 p-3 rounded-lg" style={{ background: '#1E4D7B0D', border: '1px solid #1E4D7B1A' }}>
            {/* Image on Left Side - Centered on mobile */}
            <img 
              src={i === 0 ? "/Background.svg" : "/Background (1).svg"}
              alt="background" 
              className="w-10 h-10 sm:w-11 sm:h-11 flex-shrink-0 rounded-lg mx-auto sm:mx-0 sm:mt-1.5"
            />
            
            {/* Content - Centered on mobile */}
            <div className="flex-1 text-center sm:text-left ml-10 sm:ml-0">
              <div className="font-semibold text-[10px] sm:text-xs text-[#1E4D7B] uppercase mb-0.5 ">{alert.title}</div>
              <div className="text-xs sm:text-sm text-[#0D2B4A] font-medium leading-relaxed">{alert.desc}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">{alert.text}</div>
            </div>
            
            {/* Buttons Container - Centered on mobile */}
            <div className="mt-3 flex items-center justify-center sm:justify-end gap-2 flex-shrink-0 w-full sm:w-auto ">
              <button className="px-2 py-1.5 rounded-md text-[10px] sm:text-xs font-bold whitespace-nowrap" style={{ background: alert.actionBg, color: alert.actionColor }}>
                {alert.action}
              </button>
              
              {/* Second Button - Only for 2nd alert (i === 1) */}
              {i === 1 && (
                <button className="px-2 py-1.5 rounded-md text-[10px] sm:text-xs font-bold whitespace-nowrap bg-white text-[#1E4D7B] border border-[#1E4D7B]">
                  Ignore
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}