import React, { useState } from 'react';
import { Calendar, BriefcaseMedical, GraduationCap, Check, Filter, Share2, ExternalLink } from 'lucide-react';

const tabs = ['Priority Alerts', 'Pending Approvals', 'Archive'];

export default function SystemAlerts({ data }) {
  const [activeTab, setActiveTab] = useState('Priority Alerts');

  if (!data) {
    return (
      <div className="bg-white rounded-[20px] shadow-sm flex flex-col h-[340px] animate-pulse">
        <div className="px-6 pt-5 pb-2">
          <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const {
    totalAlerts = 0,
    lateComers = 0,
    hazardsCount = 0,
    trainingUpdates = 0,
    pendingApprovals = 0,
    attendanceCorrections = 0,
    trainingEnrollments = 0,
    archivedAlerts = 0,
  } = data;

  const renderPriorityAlerts = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full min-w-[700px]">
      <div className="bg-white rounded-[16px] border border-gray-100 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
         <div>
           <div className="flex items-start justify-between mb-3">
             <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center shadow-sm">
               <Calendar size={18} strokeWidth={2.5} />
             </div>
             <div className="text-[9px] font-bold text-[#64748b] bg-gray-100 px-2.5 py-1 rounded-full tracking-wider">TODAY</div>
           </div>
           <h3 className="text-[12px] font-bold text-[#1e293b] mb-1">List of late comers</h3>
           <div className="text-[32px] font-black text-[#1e293b] leading-tight mb-2">{lateComers}</div>
           {lateComers > 0 && (
             <div className="flex items-center mt-3">
               <div className="flex -space-x-2">
                 {[...Array(Math.min(3, lateComers))].map((_, i) => (
                   <div key={i} className="w-7 h-7 rounded-full bg-[#1e3b5e] border-2 border-white flex items-center justify-center text-white">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                   </div>
                 ))}
               </div>
               {lateComers > 3 && <div className="ml-2 text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">+{lateComers - 3}</div>}
             </div>
           )}
         </div>
         <div className="mt-5 flex gap-2">
           <button className="flex-1 bg-[#3b82f6] hover:bg-blue-600 text-white text-[11px] font-bold py-2.5 rounded-xl transition-colors">Review All</button>
           <button className="px-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-400"><ExternalLink size={14} /></button>
         </div>
      </div>

      <div className="bg-white rounded-[16px] border border-gray-100 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
         <div>
           <div className="flex items-start justify-between mb-3">
             <div className="w-10 h-10 rounded-xl bg-[#8b1a10] text-white flex items-center justify-center shadow-sm">
               <BriefcaseMedical size={18} strokeWidth={2.5} />
             </div>
             {hazardsCount > 0 && (
               <div className="flex items-center gap-1 bg-[#8b1a10] text-white px-2 py-0.5 rounded-full">
                  <span className="w-1 h-1 bg-white rounded-full"></span>
                  <span className="text-[8px] font-bold tracking-wider">OPEN</span>
               </div>
             )}
           </div>
           <h3 className="text-[12px] font-bold text-[#1e293b] mb-1">Hazards & Tools safety</h3>
           <div className="flex items-baseline gap-1.5 mb-2">
             <div className="text-[32px] font-black text-[#1e293b] leading-tight">{hazardsCount}</div>
             <div className="text-[11px] font-bold text-[#3b82f6]">open incidents</div>
           </div>
         </div>
         <div className="mt-5 flex gap-2">
           <button className="flex-1 bg-[#8b1a10] hover:bg-red-900 text-white text-[11px] font-bold py-2.5 rounded-xl transition-colors">Send Reminders</button>
           <button className="px-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500"><Share2 size={14} /></button>
         </div>
      </div>

      <div className="bg-white rounded-[16px] border border-gray-100 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
         <div>
           <div className="flex items-start justify-between mb-3">
             <div className="w-10 h-10 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-sm">
               <GraduationCap size={20} strokeWidth={2.5} />
             </div>
             <div className="text-[9px] font-bold w-[65px] text-center text-white bg-[#3b82f6] px-2 py-1 rounded-full tracking-wider">{trainingUpdates > 0 ? 'NEW' : 'NONE'}</div>
           </div>
           <h3 className="text-[12px] font-bold text-[#1e293b] mb-1">Training Sessions</h3>
           <div className="flex items-baseline gap-1.5 mb-3">
             <div className="text-[32px] font-black text-[#1e293b] leading-tight">{trainingUpdates}</div>
             <div className="text-[11px] font-bold text-[#3b82f6] underline">upcoming</div>
           </div>
         </div>
         <div className="mt-4 flex gap-2">
           <button className="w-full bg-[#1e6fdb] hover:bg-blue-700 text-white text-[11px] font-bold py-2.5 rounded-xl transition-colors">Review Sessions</button>
         </div>
      </div>
    </div>
  );

  const renderPendingApprovals = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full min-w-[700px]">
      <div className="bg-white rounded-[16px] border border-gray-100 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            </div>
            <div className="text-[9px] font-bold bg-[#fef3c7] text-[#92400e] px-2.5 py-1 rounded-full tracking-wider">PENDING</div>
          </div>
          <h3 className="text-[12px] font-bold text-[#1e293b] mb-1">Leave Requests</h3>
          <div className="text-[32px] font-black text-[#1e293b] leading-tight mb-2">{pendingApprovals}</div>
          <p className="text-[10px] text-gray-500">Awaiting manager approval</p>
        </div>
        <div className="mt-5 flex gap-2">
          <button className="flex-1 bg-[#f59e0b] hover:bg-amber-600 text-white text-[11px] font-bold py-2.5 rounded-xl transition-colors">Review Now</button>
          <button className="px-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-400"><ExternalLink size={14} /></button>
        </div>
      </div>
      <div className="bg-white rounded-[16px] border border-gray-100 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#3b82f6] text-white flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <div className="text-[9px] font-bold bg-[#dbeafe] text-[#1e40af] px-2.5 py-1 rounded-full tracking-wider">TODAY</div>
          </div>
          <h3 className="text-[12px] font-bold text-[#1e293b] mb-1">Attendance Corrections</h3>
          <div className="text-[32px] font-black text-[#1e293b] leading-tight mb-2">{attendanceCorrections}</div>
          <p className="text-[10px] text-gray-500">Clock-in/out adjustments pending</p>
        </div>
        <div className="mt-5 flex gap-2">
          <button className="flex-1 bg-[#3b82f6] hover:bg-blue-600 text-white text-[11px] font-bold py-2.5 rounded-xl transition-colors">Resolve</button>
          <button className="px-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-400"><ExternalLink size={14} /></button>
        </div>
      </div>
      <div className="bg-white rounded-[16px] border border-gray-100 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#10b981] text-white flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div className="text-[9px] font-bold bg-[#d1fae5] text-[#065f46] px-2.5 py-1 rounded-full tracking-wider">{trainingEnrollments > 0 ? `${trainingEnrollments} NEW` : 'NONE'}</div>
          </div>
          <h3 className="text-[12px] font-bold text-[#1e293b] mb-1">Training Enrollments</h3>
          <div className="text-[32px] font-black text-[#1e293b] leading-tight mb-2">{trainingEnrollments}</div>
          <p className="text-[10px] text-gray-500">Upcoming training sessions</p>
        </div>
        <div className="mt-5 flex gap-2">
          <button className="flex-1 bg-[#10b981] hover:bg-emerald-600 text-white text-[11px] font-bold py-2.5 rounded-xl transition-colors">Assign</button>
          <button className="px-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-400"><ExternalLink size={14} /></button>
        </div>
      </div>
    </div>
  );

  const renderArchive = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full min-w-[700px]">
      <div className="bg-white rounded-[16px] border border-gray-100 p-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col justify-between">
        <div>
          <div className="w-10 h-10 rounded-xl bg-gray-300 text-white flex items-center justify-center shadow-sm mb-3">
            <Check size={18} strokeWidth={2.5} />
          </div>
          <h3 className="text-[12px] font-bold text-[#1e293b] mb-1">Completed Items</h3>
          <div className="text-[32px] font-black text-[#1e293b] leading-tight mb-2">{archivedAlerts}</div>
          <p className="text-[10px] text-gray-500">Resolved/completed records</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-[20px] shadow-sm flex flex-col h-[340px]">
      <div className="px-6 pt-5 pb-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#1e293b]">System Alerts</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              <span className="text-[11px] text-gray-500 font-medium">You have {totalAlerts} active alerts requiring immediate attention.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
              <Check size={14} className="text-gray-800" strokeWidth={3} />
              Mark all as read
            </button>
            <button className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
        <div className="flex gap-6 border-b border-gray-100">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`text-[12px] font-bold pb-3 relative transition-colors ${activeTab === tab ? 'text-[#8b1a10]' : 'text-gray-400 hover:text-gray-600'}`}>
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8b1a10] rounded-t-full"></div>}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1 bg-gray-50/50 rounded-b-[20px] overflow-x-auto">
        {activeTab === 'Priority Alerts' && renderPriorityAlerts()}
        {activeTab === 'Pending Approvals' && renderPendingApprovals()}
        {activeTab === 'Archive' && renderArchive()}
      </div>
    </div>
  );
}
