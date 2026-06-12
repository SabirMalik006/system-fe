import React, { useState } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

const levelColors = {
  Expert:       'text-blue-600',
  Intermediate: 'text-teal-600',
  Beginner:     'text-gray-500',
};

export default function SkillsProficiency({ skills = [], onChange }) {
  const [skillName, setSkillName] = useState('');
  const [level, setLevel] = useState('Level');

  const addSkill = () => {
    if (!skillName.trim()) return;
    onChange([...skills, { name: skillName, level: level === 'Level' ? 'Beginner' : level }]);
    setSkillName('');
    setLevel('Level');
  };

  const removeSkill = (i) => onChange(skills.filter((_, idx) => idx !== i));

  return (
    <div className="bg-white rounded-2xl border-2 border-[#1A6FC4] shadow-sm p-3 sm:p-5">
      <div className="flex items-center gap-2 mb-4 sm:mb-5 pb-3 border-b border-gray-100">
        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center">
          <img src="22.svg" alt="" className="w-full h-full" />
        </div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Skills & Proficiency</h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 sm:mb-4 sm:ml-1">
        <div className="flex flex-1 border border-[#4A7FA0] rounded-md bg-white focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-colors">
          <input
            value={skillName}
            onChange={e => setSkillName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addSkill()}
            placeholder="Skill Name..."
            className="flex-1 px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm text-[#4A7FA0] placeholder-gray-400 outline-none bg-transparent rounded-l-md"
          />
          <div className="w-px h-5 sm:h-7 bg-[#4A7FA0] my-auto"></div>
          <div className="relative">
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="appearance-none px-2 sm:px-3 py-2 sm:py-2.5 pr-5 sm:pr-7 text-xs sm:text-sm text-[#4A7FA0] outline-none cursor-pointer bg-transparent rounded-r-md"
            >
              <option value="Level" disabled>Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
            <ChevronDown size={12} className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-[#4A7FA0] pointer-events-none" />
          </div>
        </div>
        <button
          onClick={addSkill}
          className="w-full sm:w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors shadow-sm sm:ml-2"
        >
          <Plus size={16} className="text-white" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-2.5">
        {skills.map((s, i) => (
          <div key={i} className="flex items-start justify-between gap-3 sm:gap-22 border border-[#4A7FA0] rounded-lg px-3 sm:px-5 py-3 sm:py-4 bg-white group">
            <div className="flex-1">
              <div className="text-sm sm:text-md font-semibold text-gray-800 leading-tight">{s.name}</div>
              <div className={`text-xs sm:text-sm font-bold ${levelColors[s.level] || 'text-gray-500'}`}>{s.level}</div>
            </div>
            <button onClick={() => removeSkill(i)} className="text-[#4A7FA0] hover:text-gray-500 transition-colors mt-0.5 sm:mt-1 flex-shrink-0">
              <X size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
