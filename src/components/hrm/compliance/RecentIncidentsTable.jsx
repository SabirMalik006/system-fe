import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react';
import { incidentAPI } from '../../../services/api';
import ConfirmModal from '../../common/ConfirmModal';
import toast from 'react-hot-toast';

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
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuUpward, setMenuUpward] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await incidentAPI.delete(deleteTarget._id);
      toast.success('Incident deleted');
      setOpenMenuId(null);
      setDeleteTarget(null);
      fetchIncidents(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete incident');
    }
  };

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

  const openMenu = (e, id) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setMenuUpward(spaceBelow < 200);
    setOpenMenuId(id);
  };

  return (
    <div className="bg-[#1a3a6e] rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-5 py-3.5">
        <h2 className="text-sm font-bold text-white">Recent Incidents</h2>
        <span className="text-xs bg-blue-500/30 text-blue-200 font-semibold px-3 py-1 rounded-full">
          Displaying {incidents.length} of {pagination.total}
        </span>
      </div>

      <div className="bg-white">
        <div className="hidden sm:grid grid-cols-[2fr_2fr_2fr_1.5fr_auto] gap-4 px-5 py-3 border-b border-gray-100 bg-white">
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
                className={`sm:grid sm:grid-cols-[2fr_2fr_2fr_1.5fr_auto] sm:gap-4 sm:items-center px-5 py-4 ${
                  i < incidents.length - 1 ? 'border-b border-gray-100' : ''
                } hover:bg-gray-50 transition-colors cursor-pointer`}
              >
                {/* Mobile card view */}
                <div className="sm:hidden flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="18" r="18" fill="#E2E8F0"/>
                      <circle cx="18" cy="14" r="6" fill="#94A3B8"/>
                      <ellipse cx="18" cy="28" rx="10" ry="7" fill="#94A3B8"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 leading-tight truncate">{inc.employeeName}</div>
                    <div className="text-xs text-gray-400 truncate">{inc.employeeRole || '—'}</div>
                  </div>
                  <div className="relative ml-auto shrink-0">
                    <button
                      onClick={(e) => openMenu(e, inc._id)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical size={15} className="text-gray-400" />
                    </button>
                    {openMenuId === inc._id && (
                      <div ref={menuRef} className={`absolute right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] ${menuUpward ? 'bottom-full mb-2' : 'top-full mt-1'}`}>
                        <button onClick={() => { onEdit && onEdit(inc._id); setOpenMenuId(null); }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 flex items-center gap-2">
                          <Eye size={14} /> View Details
                        </button>
                        <button onClick={() => { onEdit && onEdit(inc._id); setOpenMenuId(null); }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 flex items-center gap-2">
                          <Pencil size={14} /> Edit
                        </button>
                        <hr className="my-1 border-gray-100" />
                        <button onClick={() => { setOpenMenuId(null); setDeleteTarget(inc); }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="sm:hidden flex items-center gap-3 text-xs text-gray-500">
                  <span>{inc.date}</span>
                  <span className={`font-semibold ${ts.color} ${ts.bg} px-1.5 py-0.5 rounded`}>{inc.incidentType}</span>
                  <span className={`font-semibold px-2 py-0.5 rounded ${ss}`}>{inc.severity}</span>
                  <span className={`flex items-center gap-1 ml-auto ${sc.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {inc.status}
                  </span>
                </div>

                {/* Desktop grid view */}
                <div className="hidden sm:flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0 overflow-hidden">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="18" r="18" fill="#E2E8F0"/>
                      <circle cx="18" cy="14" r="6" fill="#94A3B8"/>
                      <ellipse cx="18" cy="28" rx="10" ry="7" fill="#94A3B8"/>
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 leading-tight truncate">{inc.employeeName}</div>
                    <div className="text-xs text-gray-400 truncate">{inc.employeeRole || '—'}</div>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <div className="text-sm text-gray-700 leading-tight">{inc.date}</div>
                  <span className={`text-xs font-semibold ${ts.color} ${ts.bg} px-1.5 py-0.5 rounded mt-0.5 inline-block`}>
                    {inc.incidentType}
                  </span>
                </div>

                <div className="hidden sm:block">
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded ${ss}`}>
                    {inc.severity}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${sc.dot}`} />
                  <span className={`text-sm font-medium ${sc.color}`}>{inc.status}</span>
                </div>

                <div className="hidden sm:block relative">
                  <button
                    onClick={(e) => openMenu(e, inc._id)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical size={15} className="text-gray-400" />
                  </button>
                  {openMenuId === inc._id && (
                    <div ref={menuRef} className={`absolute right-0 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px] ${menuUpward ? 'bottom-full mb-2' : 'top-full mt-1'}`}>
                      <button onClick={() => { onEdit && onEdit(inc._id); setOpenMenuId(null); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 flex items-center gap-2">
                        <Eye size={14} /> View Details
                      </button>
                      <button onClick={() => { onEdit && onEdit(inc._id); setOpenMenuId(null); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 flex items-center gap-2">
                        <Pencil size={14} /> Edit
                      </button>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={() => { setOpenMenuId(null); setDeleteTarget(inc); }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </div>
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

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Incident"
        message={`Are you sure you want to delete the incident record for "${deleteTarget?.employeeName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
