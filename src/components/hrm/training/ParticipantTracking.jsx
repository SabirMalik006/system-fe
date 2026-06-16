import React, { useState } from 'react';
import { Download, UserPlus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { trainingAPI } from '../../../services/api';

export default function ParticipantTracking({ participants, pagination, onRefresh, onPageChange }) {
  const [activeFilter, setActiveFilter] = useState('All Participants');
  const [searchTerm, setSearchTerm] = useState('');
  const filters = ['All Participants', 'Completed', 'In Progress', 'Not Started'];

  const filtered = participants ? participants.filter(p => {
    const matchesSearch = !searchTerm ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.empId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) : [];

  const resultStyles = {
    Completed: 'bg-green-100 text-green-700',
    Promoted: 'bg-purple-100 text-purple-700',
    Failed: 'bg-red-100 text-red-700',
    'In Progress': 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="bg-[#1a3a8f] overflow-hidden shadow-sm rounded-2xl">
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <h2 className="text-sm font-bold text-white">Participant Tracking</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] font-bold bg-white/15 text-white px-2 py-0.5 rounded">
              {pagination?.total || 0} Total
            </span>
            <span className="text-[9px] font-bold bg-white/15 text-white px-2 py-0.5 rounded">
              {participants?.filter(p => p.progress > 0 && p.progress < 100).length || 0} Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={async () => {
              try {
                const res = await trainingAPI.exportParticipants();
                const url = URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.download = `training-participants-${Date.now()}.csv`;
                link.click();
                URL.revokeObjectURL(url);
                toast.success('Export complete');
              } catch (err) {
                toast.error('Export failed');
              }
            }}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download size={12} />
            Export CSV
          </button>
          <button
            onClick={() => toast.success('Add participant form would open')}
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
          >
            <UserPlus size={12} />
            Add Participant
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 pb-3 flex-wrap">
        {filters.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              activeFilter === f ? 'bg-white text-blue-700' : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {f}
          </button>
        ))}
        <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 ml-auto">
          <Search size={11} className="text-blue-200" />
          <input
            placeholder="Search..."
            className="text-xs outline-none bg-transparent text-white placeholder-blue-200 w-24"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-t-xl overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Employee', 'Department', 'Institute', 'Program', 'Start Date', 'Planned End', 'Result', 'Score', 'Start Test', 'Test Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-3 py-2.5 text-[12px] font-bold text-gray-900 tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} className="text-center py-8 text-gray-400 text-sm">No participants found</td></tr>
            ) : (
              filtered.map((p, i) => (
                <tr key={p._id || i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-[10px] font-bold flex-shrink-0">
                        {p.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-900 leading-tight whitespace-nowrap">{p.name}</div>
                        <div className="text-[9px] text-gray-400">{p.empId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[11px] text-gray-600">{p.department || '—'}</td>
                  <td className="px-3 py-3 text-[11px] text-gray-600">{p.institute || '—'}</td>
                  <td className="px-3 py-3 text-[11px] text-gray-600">{p.program || '—'}</td>
                  <td className="px-3 py-3 text-[11px] text-gray-600 whitespace-nowrap">{p.startDate ? new Date(p.startDate).toLocaleDateString('en-GB') : '—'}</td>
                  <td className="px-3 py-3 text-[11px] text-gray-600 whitespace-nowrap">{p.endDate ? new Date(p.endDate).toLocaleDateString('en-GB') : '—'}</td>
                  <td className="px-3 py-3">
                    {p.result && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${resultStyles[p.result] || 'bg-gray-100 text-gray-600'}`}>{p.result}</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-[11px] font-bold text-gray-800">{p.score ?? '—'}</td>
                  <td className="px-3 py-3">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-blue-600" style={{ width: `${p.progress || 0}%` }} />
                    </div>
                    <div className="text-[9px] text-gray-400 mt-0.5">{p.progress || 0}%</div>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => toast.success('Starting test...')}
                      className="text-[10px] font-semibold text-blue-600 border border-blue-300 px-2 py-0.5 rounded hover:bg-blue-50 transition-colors whitespace-nowrap"
                    >
                      Start Test
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      onClick={() => toast.success('View participant details')}
                      className="text-xs text-blue-600 font-semibold hover:text-blue-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white flex items-center justify-between px-5 py-3 border-t border-gray-100 rounded-b-2xl">
        <span className="text-[10px] text-gray-400">
          Showing 1–{Math.min(10, pagination?.total || 0)} of {pagination?.total || 0} records
        </span>
        <div className="flex items-center gap-1">
          {pagination && Array.from({ length: Math.min(pagination.pages || 1, 5) }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => onPageChange && onPageChange(n)}
              className={`w-6 h-6 rounded text-[10px] font-semibold ${
                n === (pagination?.page || 1) ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
