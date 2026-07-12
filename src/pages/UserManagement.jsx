import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/common/ConfirmModal';
import {
  Users, UserPlus, Shield, Search, ChevronLeft, ChevronRight,
  Edit3, Trash2, Eye, EyeOff, X, Check, AlertTriangle,
  Crown, Anchor, Briefcase, Wrench, UserCheck, UserX,
  Filter, RefreshCw, Mail, Phone, Building2, Calendar, Lock, Unlock
} from 'lucide-react';

const ROLE_LIMITS = { cmes: 6, ages_ges: 14 };

const ROLES = [
  { value: 'cmes', label: 'CMES', color: '#7c3aed', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: Crown },
  { value: 'ages_ges', label: "AGE'S/GE'S", color: '#2563eb', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Shield },
  { value: 'charge_head', label: 'Charge Head', color: '#0891b2', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', icon: Briefcase },
  { value: 'ims_manager', label: 'IMS Manager', color: '#059669', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: UserCheck },
  { value: 'ims_viewer', label: 'IMS Viewer', color: '#65a30d', bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', icon: Eye },
  { value: 'hr_manager', label: 'HR Manager', color: '#d97706', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: UserCheck },
  { value: 'hr_viewer', label: 'HR Viewer', color: '#ea580c', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: Eye },
  { value: 'finance', label: 'Finance', color: '#0d9488', bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', icon: Briefcase },
  { value: 'employee', label: 'Employee', color: '#6366f1', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: Users },
  { value: 'tradesman', label: 'Tradesman', color: '#be185d', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', icon: Wrench },
];

const getRoleConfig = (role) => ROLES.find(r => r.value === role) || ROLES[ROLES.length - 1];

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export default function UserManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const canManage = ['super_admin', 'dwece', 'charge_head'].includes(user?.role);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [roleCounts, setRoleCounts] = useState({});
  const [roleLimits, setRoleLimits] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'employee', department: '', designation: '', phone: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await authAPI.getUsers({ page, limit: 12, search, role: roleFilter });
      setUsers(res.data.users);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  const fetchRoleCounts = async () => {
    try {
      const res = await authAPI.getRoleCounts();
      setRoleCounts(res.data.counts);
      setRoleLimits(res.data.limits || {});
    } catch (err) {
      console.error('Failed to load role counts');
    }
  };

  useEffect(() => { fetchUsers(); }, [fetchUsers]);
  useEffect(() => { fetchRoleCounts(); }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const openCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'employee', department: '', designation: '', phone: '' });
    setShowPassword(false);
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditingUser(u);
    setFormData({ name: u.name || '', email: u.email || '', password: '', role: u.role || 'employee', department: u.department || '', designation: u.designation || '', phone: u.phone || '' });
    setShowPassword(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'employee', department: '', designation: '', phone: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editingUser) {
        const data = { name: formData.name, email: formData.email, role: formData.role, department: formData.department, designation: formData.designation, phone: formData.phone };
        await authAPI.updateUser(editingUser._id, data);
        toast.success('User updated successfully');
      } else {
        await authAPI.register(formData);
        toast.success('User created successfully');
      }
      closeModal();
      fetchUsers();
      fetchRoleCounts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await authAPI.deleteUser(deletingUser._id);
      toast.success('User deleted successfully');
      setShowDeleteModal(false);
      setDeletingUser(null);
      fetchUsers();
      fetchRoleCounts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  };

  const openDelete = (u) => {
    setDeletingUser(u);
    setShowDeleteModal(true);
  };

  const totalUsers = Object.values(roleCounts).reduce((a, b) => a + b, 0);
  const cmesCount = roleCounts.cmes || 0;
  const agesGesCount = roleCounts.ages_ges || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-[slideUp_0.4s_ease-out]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B4E89] to-[#1A8FA0] flex items-center justify-center shadow-lg">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                <p className="text-sm text-gray-500">Manage system users and role assignments</p>
              </div>
            </div>
          </div>
          {canManage && (
            <button
              onClick={openCreate}
              className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#0B4E89] via-[#0F5D98] to-[#1A8FA0] text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl shadow-blue-600/30 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] overflow-hidden cursor-pointer"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out" />
              <span className="relative flex items-center justify-center w-7 h-7 bg-white/20 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors duration-300">
                <UserPlus size={15} className="group-hover:rotate-90 transition-transform duration-300" />
              </span>
              <span className="relative">Add New User</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-blue-100/50 hover:-translate-y-0.5 transition-all duration-300 animate-[slideUp_0.4s_ease-out_0.05s_both]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              <p className="text-xs text-gray-500 font-medium">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-purple-100/50 hover:-translate-y-0.5 transition-all duration-300 animate-[slideUp_0.4s_ease-out_0.1s_both]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Crown size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{cmesCount}<span className="text-sm font-normal text-gray-400">/6</span></p>
              <p className="text-xs text-gray-500 font-medium">CMES Slots</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-indigo-100/50 hover:-translate-y-0.5 transition-all duration-300 animate-[slideUp_0.4s_ease-out_0.15s_both]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{agesGesCount}<span className="text-sm font-normal text-gray-400">/14</span></p>
              <p className="text-xs text-gray-500 font-medium">AGE'S/GE'S Slots</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-0.5 transition-all duration-300 animate-[slideUp_0.4s_ease-out_0.2s_both]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Briefcase size={20} className="text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{(roleCounts.charge_head || 0) + (roleCounts.ims_manager || 0) + (roleCounts.hr_manager || 0)}</p>
              <p className="text-xs text-gray-500 font-medium">Managers + CH</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Limits Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 animate-[slideUp_0.5s_ease-out_0.2s_both]">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crown size={16} className="text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">CMES Limit</span>
            </div>
            <span className="text-sm font-bold text-purple-600">{cmesCount}/6</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min((cmesCount / 6) * 100, 100)}%`, background: cmesCount >= 6 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
            />
          </div>
          {cmesCount >= 6 && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertTriangle size={12} /> Maximum limit reached</p>
          )}
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">AGE'S/GE'S Limit</span>
            </div>
            <span className="text-sm font-bold text-blue-600">{agesGesCount}/14</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min((agesGesCount / 14) * 100, 100)}%`, background: agesGesCount >= 14 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #2563eb, #3b82f6)' }}
            />
          </div>
          {agesGesCount >= 14 && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1"><AlertTriangle size={12} /> Maximum limit reached</p>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6 animate-[slideUp_0.5s_ease-out_0.15s_both]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1A8FA0] focus:ring-2 focus:ring-[#1A8FA0]/20 outline-none transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1A8FA0] focus:ring-2 focus:ring-[#1A8FA0]/20 outline-none transition-all min-w-[160px]"
          >
            <option value="">All Roles</option>
            {ROLES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <button
            onClick={() => { setSearch(''); setRoleFilter(''); setPage(1); }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} />
            Reset
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-[slideUp_0.5s_ease-out_0.25s_both]">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-gray-500">
              <RefreshCw size={20} className="animate-spin" />
              <span className="text-sm font-medium">Loading users...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Users size={28} className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium">No users found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">User</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Role</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4 hidden md:table-cell">Department</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4 hidden lg:table-cell">Joined</th>
                    {canManage && (
                      <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-4">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const rc = getRoleConfig(u.role);
                    const RoleIcon = rc.icon;
                    return (
                      <tr key={u._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0"
                              style={{ background: `linear-gradient(135deg, ${rc.color}, ${rc.color}dd)` }}
                            >
                              {getInitials(u.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{u.name}</p>
                              <p className="text-xs text-gray-500 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${rc.bg} ${rc.text} ${rc.border} border`}>
                            <RoleIcon size={12} />
                            {rc.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 hidden md:table-cell">
                          <span className="text-sm text-gray-600">{u.department || '—'}</span>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          {u.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="text-sm text-gray-500">{formatDate(u.createdAt)}</span>
                        </td>
                        {canManage && (
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEdit(u)}
                                className="p-2 text-gray-400 hover:text-[#0B4E89] hover:bg-blue-50 rounded-lg transition-all"
                                title="Edit user"
                              >
                                <Edit3 size={15} />
                              </button>
                              {u.role !== 'super_admin' && u.role !== 'dwece' && u._id !== user?.id && (
                                <button
                                  onClick={() => openDelete(u)}
                                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  title="Delete user"
                                >
                                  <Trash2 size={15} />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-semibold text-gray-700">{(page - 1) * 12 + 1}</span> to{' '}
                  <span className="font-semibold text-gray-700">{Math.min(page * 12, total)}</span> of{' '}
                  <span className="font-semibold text-gray-700">{total}</span> users
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                          page === pageNum
                            ? 'bg-[#0B4E89] text-white shadow-md shadow-blue-500/25'
                            : 'text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-[slideUp_0.35s_ease-out] modal-scroll">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#0B4E89] via-[#0F5D98] to-[#1A8FA0] px-6 py-5 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center animate-[pulse-ring_2s_ease-out_infinite]">
                    {editingUser ? <Edit3 size={18} className="text-white" /> : <UserPlus size={18} className="text-white" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{editingUser ? 'Edit User' : 'Create New User'}</h3>
                    <p className="text-xs text-blue-100">{editingUser ? 'Update user details and role' : 'Add a new user to the system'}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 cursor-pointer">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1A8FA0] focus:ring-2 focus:ring-[#1A8FA0]/20 outline-none transition-all"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1A8FA0] focus:ring-2 focus:ring-[#1A8FA0]/20 outline-none transition-all"
                  placeholder="user@example.com"
                />
              </div>

              {/* Password (only for create) */}
              {!editingUser && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1A8FA0] focus:ring-2 focus:ring-[#1A8FA0]/20 outline-none transition-all"
                      placeholder="Min 6 characters"
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Role */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1A8FA0] focus:ring-2 focus:ring-[#1A8FA0]/20 outline-none transition-all"
                >
                  {ROLES.map(r => {
                    const limit = ROLE_LIMITS[r.value];
                    const count = roleCounts[r.value] || 0;
                    const atLimit = limit && count >= limit;
                    return (
                      <option key={r.value} value={r.value} disabled={atLimit && formData.role !== r.value}>
                        {r.label} {limit ? `(${count}/${limit})` : ''} {atLimit ? '— FULL' : ''}
                      </option>
                    );
                  })}
                </select>
                {ROLE_LIMITS[formData.role] && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-500">Slot usage</span>
                      <span className={`font-semibold ${(roleCounts[formData.role] || 0) >= ROLE_LIMITS[formData.role] ? 'text-red-600' : 'text-gray-700'}`}>
                        {roleCounts[formData.role] || 0}/{ROLE_LIMITS[formData.role]}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(((roleCounts[formData.role] || 0) / ROLE_LIMITS[formData.role]) * 100, 100)}%`,
                          background: (roleCounts[formData.role] || 0) >= ROLE_LIMITS[formData.role]
                            ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                            : 'linear-gradient(90deg, #0B4E89, #1A8FA0)'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Department & Designation */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1A8FA0] focus:ring-2 focus:ring-[#1A8FA0]/20 outline-none transition-all"
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1A8FA0] focus:ring-2 focus:ring-[#1A8FA0]/20 outline-none transition-all"
                    placeholder="e.g. Manager"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-[#1A8FA0] focus:ring-2 focus:ring-[#1A8FA0]/20 outline-none transition-all"
                  placeholder="e.g. +92 300 1234567"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="group px-5 py-2.5 text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-gray-700 rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="group relative flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#0B4E89] via-[#0F5D98] to-[#1A8FA0] hover:from-[#0a4378] hover:via-[#0e5588] hover:to-[#178090] rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] overflow-hidden cursor-pointer"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 ease-out" />
                  {formLoading ? (
                    <RefreshCw size={16} className="relative animate-spin" />
                  ) : editingUser ? (
                    <Check size={16} className="relative group-hover:scale-110 transition-transform duration-200" />
                  ) : (
                    <UserPlus size={16} className="relative group-hover:rotate-90 transition-transform duration-300" />
                  )}
                  <span className="relative">{editingUser ? 'Update User' : 'Create User'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setDeletingUser(null); }}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deletingUser?.name}? This action cannot be undone and all their sessions will be terminated.`}
        confirmText="Delete User"
        variant="danger"
      />
    </div>
  );
}
