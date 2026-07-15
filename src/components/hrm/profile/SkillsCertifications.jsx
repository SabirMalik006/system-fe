import React, { useState } from 'react';
import { Award, Plus, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { employeeAPI } from '../../../services/api';

const levelColors = {
    'Expert': '#3B82F6',
    'Advanced': '#2563eb',
    'Intermediate': '#60a5fa',
    'Beginner': '#bfdbfe',
};

export default function SkillsCertifications({ employee = {} }) {
  const [showForm, setShowForm] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [saving, setSaving] = useState(false);

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

  const handleAddSkill = async () => {
    if (!skillName.trim()) {
      toast.error('Please enter a skill name');
      return;
    }
    setSaving(true);
    try {
      const updatedSkills = [...(employee.skills || []), { name: skillName.trim(), level: skillLevel }];
      const res = await employeeAPI.update(employee._id, { skills: updatedSkills });
      if (res.data.success) {
        toast.success('Skill added successfully');
        setShowForm(false);
        setSkillName('');
        setSkillLevel('Beginner');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add skill');
    } finally {
      setSaving(false);
    }
  };

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
          onClick={() => setShowForm(true)}
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">Add Skill</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Skill Name</label>
                <input
                  type="text"
                  value={skillName}
                  onChange={e => setSkillName(e.target.value)}
                  placeholder="e.g. Welding"
                  className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                  onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Proficiency Level</label>
                <select
                  value={skillLevel}
                  onChange={e => setSkillLevel(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 appearance-none bg-white"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSkill}
                  disabled={saving}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#1A6FC4] rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {saving ? 'Adding...' : 'Add Skill'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
