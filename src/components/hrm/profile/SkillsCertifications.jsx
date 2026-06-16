import React from 'react';
import { Award, Plus, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const levelColors = {
    'Expert': '#3B82F6',
    'Advanced': '#2563eb',
    'Intermediate': '#60a5fa',
    'Beginner': '#bfdbfe',
};

export default function SkillsCertifications({ employee = {} }) {
  const skills = (employee.skills || []).map(s => ({
    name: s.name || 'Unknown Skill',
    cert: 'Cert: Recorded',
    expiry: 'Ongoing',
    level: s.level || 'Beginner',
    levelStyle: s.level === 'Expert' ? 'bg-[#3B82F6] text-white' : s.level === 'Advanced' ? 'bg-[#0C3188] text-white' : s.level === 'Intermediate' ? 'bg-[#0C3188] text-white' : 'bg-[#529CE5] text-white',
    pct: s.level === 'Expert' ? 95 : s.level === 'Advanced' ? 75 : s.level === 'Intermediate' ? 55 : 25,
    expiring: false,
  }));

  const display = skills.length > 0 ? skills : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-[#1A6FC4] p-3 rounded-md">
            <Award size={10} className="text-white" />
          </div>
          <h2 className="text-sm font-bold text-gray-800">Skills & Certifications</h2>
        </div>
        <button
          onClick={() => toast.success('Add skill form will open')}
          className="flex items-center gap-1 text-xs font-bold bg-[#1A6FC4] text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={12} />
          Add
        </button>
      </div>

      <div className="p-5 flex flex-col gap-4 min-h-[380px]">
        {display.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">No skills recorded</div>
        ) : (
          display.map((s, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-3">
                  <div className="text-sm font-bold text-[#0D1B2E] leading-tight">{s.name}</div>
                  <div className="text-[12px] text-[#7A8BA5] mt-0.5">{s.cert}</div>
                  <div className="flex items-center gap-1 text-[12px] text-[#1E293B]">
                    {s.expiring && <AlertTriangle size={9} className="text-orange-500" />}
                    {s.expiry}
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-xl flex-shrink-0 ${s.levelStyle}`}>
                  {s.level}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${s.pct}%`, background: levelColors[s.level] || '#bfdbfe' }}
                />
              </div>
            </div>
          ))
        )}

        <div className="flex items-center gap-x-4 gap-y-2 mt-3 flex-wrap pt-2 border-t border-gray-100">
          {Object.entries(levelColors).map(([label, color]) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color }} />
              <span className="text-[12px] text-[#7A8BA5]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
