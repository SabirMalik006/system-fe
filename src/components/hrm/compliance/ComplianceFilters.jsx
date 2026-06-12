import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, User } from 'lucide-react';

export default function ComplianceFilters({ onChange }) {
  const [search, setSearch] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [severity, setSeverity] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    onChange({ search, incidentType, severity, status });
  }, [search, incidentType, severity, status, onChange]);

  const selectCls = 'flex items-center justify-between gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-500 cursor-pointer hover:border-blue-300 transition-colors w-full';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-blue-400 transition-colors sm:col-span-1">
          <User size={14} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by employee name..."
            className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder-gray-400"
          />
        </div>

        <div className="relative">
          <select
            value={incidentType}
            onChange={e => setIncidentType(e.target.value)}
            className={`${selectCls} appearance-none pr-8`}
          >
            <option value="">Incident Type</option>
            <option value="Misconduct">Misconduct</option>
            <option value="Tardiness">Tardiness</option>
            <option value="Performance">Performance</option>
            <option value="Insubordination">Insubordination</option>
            <option value="Other">Other</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={severity}
            onChange={e => setSeverity(e.target.value)}
            className={`${selectCls} appearance-none pr-8`}
          >
            <option value="">Severity</option>
            <option value="Verbal Warning">Verbal Warning</option>
            <option value="Written Warning">Written Warning</option>
            <option value="Final Warning">Final Warning</option>
            <option value="Suspension">Suspension</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className={`${selectCls} appearance-none pr-8`}
          >
            <option value="">Status</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
            <option value="Escalated">Escalated</option>
          </select>
          <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
