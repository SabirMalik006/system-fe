import React, { useState, useEffect, useCallback } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { incidentAPI } from '../../../services/api';

const severityStyles = {
  'Verbal Warning': 'text-gray-600',
  'Written Warning': 'border border-orange-400 text-orange-500 bg-white',
  'Final Warning': 'border border-red-500 text-red-600 bg-white',
  Suspension: 'border border-red-700 text-red-700 bg-red-50',
};

const statusConfig = {
  Open: { color: 'text-blue-500', dot: 'bg-blue-500' },
  Closed: { color: 'text-gray-500', dot: 'bg-gray-400' },
  Escalated: { color: 'text-red-500', dot: 'bg-red-500' },
};

const typeStyles = {
  Misconduct: { color: 'text-blue-600', bg: 'bg-blue-50' },
  Tardiness: { color: 'text-orange-500', bg: 'bg-orange-50' },
  Performance: { color: 'text-blue-500', bg: 'bg-blue-50' },
  Insubordination: { color: 'text-purple-600', bg: 'bg-purple-50' },
  Other: { color: 'text-gray-500', bg: 'bg-gray-50' },
};

export default function RecentIncidentsTable({ filters, onEdit, refreshKey }) {
  const [incidents, setIncidents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);

  const fetchIncidents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await incidentAPI.getAll({
        page,
        limit: 10,
        search: filters.search,
        status: filters.status,
        severity: filters.severity,
        incidentType: filters.incidentType,
      });
      setIncidents(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to fetch incidents:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchIncidents(1);
  }, [fetchIncidents, refreshKey]);

  return (
    <div className="bg-[#1a3a6e] rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-3.5">
        <h2 className="text-sm font-bold text-white">Recent Incidents</h2>
        <span className="text-xs bg-blue-500/30 text-blue-200 font-semibold px-3 py-1 rounded-full">
          Displaying {incidents.length} of {pagination.total}
        </span>
      </div>

      <div className="bg-white">
        <div className="grid grid-cols-[2fr_2fr_2fr_1.5fr_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-white">
          {['EMPLOYEE', 'DATE & TYPE', 'SEVERITY', 'STATUS', ''].map((h, i) => (
            <div key={i} className="text-[10px] font-bold text-gray-400 tracking-wider">{h}</div>
          ))}
        </div>

        {loading ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">Loading...</div>
        ) : incidents.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-gray-400">No incidents found</div>
        ) : (
          incidents.map((inc, i) => {
            const ts = typeStyles[inc.incidentType] || typeStyles.Other;
            const sc = statusConfig[inc.status] || statusConfig.Open;
            const ss = severityStyles[inc.severity] || 'text-gray-600';
            return (
              <div
                key={inc._id}
                onClick={() => onEdit && onEdit(inc._id)}
                className={`grid grid-cols-[2fr_2fr_2fr_1.5fr_auto] gap-4 items-center px-5 py-4 ${
                  i < incidents.length - 1 ? 'border-b border-gray-100' : ''
                } hover:bg-gray-50 transition-colors cursor-pointer`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0 overflow-hidden">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="18" r="18" fill="#E2E8F0"/>
                      <circle cx="18" cy="14" r="6" fill="#94A3B8"/>
                      <ellipse cx="18" cy="28" rx="10" ry="7" fill="#94A3B8"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 leading-tight">{inc.employeeName}</div>
                    <div className="text-xs text-gray-400">{inc.employeeRole || '—'}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-700 leading-tight">{inc.date}</div>
                  <span className={`text-xs font-semibold ${ts.color} ${ts.bg} px-1.5 py-0.5 rounded mt-0.5 inline-block`}>
                    {inc.incidentType}
                  </span>
                </div>

                <div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded ${ss}`}>
                    {inc.severity}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                  <span className={`text-sm font-medium ${sc.color}`}>{inc.status}</span>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); onEdit && onEdit(inc._id); }}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical size={15} className="text-gray-400" />
                </button>
              </div>
            );
          })
        )}

        {pagination.pages > 1 && (
          <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchIncidents(pagination.page - 1)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="text-xs text-gray-400">
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => fetchIncidents(pagination.page + 1)}
              className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}

        {!loading && incidents.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 text-center">
            <button
              onClick={() => fetchIncidents(1)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All Incident Logs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
