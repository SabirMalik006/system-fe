import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { employeeAPI } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import ConfirmModal from '../../common/ConfirmModal';
import toast from 'react-hot-toast';

const statusStyle = {
  Active: 'bg-[#3b82f6] text-white',
  'On Leave': 'bg-[#06b6d4] text-white',
  Suspended: 'bg-red-500 text-white',
  Terminated: 'bg-gray-500 text-white',
  Retired: 'bg-gray-400 text-white',
};

export default function DepartmentTable() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Type');
  const [departments, setDepartments] = useState(['All Departments']);
  const [openMenuId, setOpenMenuId] = useState(null);
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
      await employeeAPI.deleteWithAccount(deleteTarget._id);
      toast.success('Employee deleted');
      setOpenMenuId(null);
      setDeleteTarget(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const fetchDepartments = () => {
    employeeAPI.getAll({ limit: 1000 }).then(({ data: res }) => {
      if (res.success) {
        const depts = [...new Set((res.data || []).flatMap(e => [e.department, e.unit]).filter(Boolean))];
        if (depts.length > 0) setDepartments(['All Departments', ...depts.sort()]);
      }
    }).catch(() => {});
  };

  useEffect(() => { fetchDepartments(); }, []);

  const fetchEmployees = () => {
    const params = { page, limit: 10, search };
    if (statusFilter !== 'All Status') params.status = statusFilter;
    if (typeFilter !== 'All Type') params.type = typeFilter;
    if (deptFilter !== 'All Departments') params.department = deptFilter;
    employeeAPI.getAll(params).then(({ data: res }) => {
      if (res.success) {
        setEmployees(res.data);
        setTotal(res.pagination?.total || 0);
      }
    }).catch(() => {});
  };

  useEffect(() => { fetchEmployees(); }, [page, statusFilter, typeFilter, deptFilter]);

  useEffect(() => {
    const timer = setTimeout(() => { setPage(1); fetchEmployees(); }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 flex flex-col mt-2">
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white border-b border-gray-100/50">
        <div className="relative flex-1 min-w-[300px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search employee ID, name, designation..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] border border-gray-200 rounded-lg bg-[#fafafa] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors" />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <select value={deptFilter} onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
            className="text-[13px] border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-600 focus:outline-none focus:border-blue-400 cursor-pointer min-w-[140px] appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}>
            {departments.map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="text-[13px] border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-600 focus:outline-none focus:border-blue-400 cursor-pointer min-w-[140px] appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}>
            {['All Status', 'Active', 'On Leave', 'Suspended', 'Terminated', 'Retired'].map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
            className="text-[13px] border border-gray-200 rounded-lg px-4 py-2 bg-white text-gray-600 focus:outline-none focus:border-blue-400 cursor-pointer min-w-[140px] appearance-none"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}>
            {['All Type', 'Permanent', 'Contract', 'Temporary'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#1e6fbe] text-white">
            <tr>
              {['Employee','Employee ID','Designation','Department','Unit','Type','Status','Joined','Actions'].map((h, i) => (
                <th key={h} className={`px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${i === 8 ? 'text-center' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {employees.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-12 text-gray-400 text-sm">No employees found</td></tr>
            ) : (
              employees.map((emp, i) => (
                <tr key={emp._id} className="hover:bg-blue-50/20 transition-colors cursor-pointer" onClick={() => navigate(`/employee-profile?id=${emp._id}`)}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs border border-gray-100">
                        {emp.firstName?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-[13px]">{emp.firstName} {emp.lastName}</p>
                        <p className="text-gray-400 text-[11px] mt-0.5">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500 whitespace-nowrap font-medium">{emp.employeeId || 'N/A'}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-800 whitespace-nowrap font-bold">{emp.designation || 'N/A'}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500 whitespace-nowrap font-medium">{emp.department || emp.unit || 'N/A'}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500 whitespace-nowrap leading-snug w-24">{emp.unit || 'N/A'}</td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500 whitespace-nowrap leading-snug w-24">{emp.employmentType || 'N/A'}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-[11px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap shadow-sm ${statusStyle[emp.employmentStatus] || 'bg-gray-100 text-gray-500'}`}>
                      {emp.employmentStatus || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-gray-500 whitespace-nowrap font-medium">{emp.joiningDate || 'N/A'}</td>
                  <td className="px-4 py-3.5 text-center relative">
                    <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === emp._id ? null : emp._id); }}
                      className="text-gray-300 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                        <circle cx="12" cy="6" r="1" fill="currentColor" />
                        <circle cx="12" cy="18" r="1" fill="currentColor" />
                      </svg>
                    </button>
                    {openMenuId === emp._id && (
                      <div ref={menuRef} className="absolute right-0 top-full mt-1 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]">
                        <button onClick={() => { navigate(`/employee-profile?id=${emp._id}`); setOpenMenuId(null); }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          View Profile
                        </button>
                        <button onClick={() => { navigate(`/personnel-profile?edit=${emp._id}`); setOpenMenuId(null); }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-blue-50 flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          Edit
                        </button>
                        {user?.role === 'dwece' && (
                          <>
                            <hr className="my-1 border-gray-100" />
                            <button onClick={() => { setOpenMenuId(null); setDeleteTarget(emp); }}
                              className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-6 py-4 bg-[#fafbfc] border-t border-gray-100 rounded-b-xl">
        <p className="text-[12px] text-gray-500 font-medium">Showing 1 to {employees.length} of {total} employees</p>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
            className="px-3 py-1 text-[12px] font-medium text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50">Previous</button>
          {Array.from({ length: Math.min(5, Math.ceil(total / 10)) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-7 h-7 text-[12px] font-bold rounded-md flex items-center justify-center transition-colors ${page === p ? 'bg-[#1e6fbe] text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / 10)}
            className="px-3 py-1 text-[12px] font-medium text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50">Next</button>
        </div>
      </div>
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Employee"
        message={deleteTarget ? `Permanently delete ${deleteTarget.firstName} ${deleteTarget.lastName} and their linked user account? This cannot be undone.` : ''}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
