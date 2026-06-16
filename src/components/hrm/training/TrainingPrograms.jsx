import React, { useState } from 'react';
import { Download, Plus, Search } from 'lucide-react';
import TrainingFormModal from './TrainingFormModal';
import { trainingAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import ConfirmModal from '../../common/ConfirmModal';

export default function TrainingPrograms({ programs, pagination, onRefresh, onPageChange }) {
  const [activeTab, setActiveTab] = useState('All Programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filteredPrograms = programs ? programs.filter(p => {
    if (activeTab === 'All Programs') return true;
    if (activeTab === 'All Status') return true;
    if (activeTab === 'All Types') return true;
    if (activeTab === 'Completed') return p.status === 'Completed';
    if (activeTab === 'Ongoing') return p.status === 'Ongoing';
    if (activeTab === 'Upcoming') return p.status === 'Upcoming';
    return true;
  }) : [];

  const searchedPrograms = searchTerm
    ? filteredPrograms.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.instructor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredPrograms;

  const handleAddProgram = async (formData) => {
    try {
      if (editingProgram) {
        await trainingAPI.update(editingProgram._id, formData);
        toast.success('Program updated');
      } else {
        await trainingAPI.create(formData);
        toast.success('Program created');
      }
      setIsModalOpen(false);
      setEditingProgram(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save program');
    }
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setIsModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await trainingAPI.delete(deleteTarget);
      toast.success('Program deleted');
      setDeleteTarget(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    }
  };

  const handleExportCSV = async () => {
    try {
      const res = await trainingAPI.exportTrainings();
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `training-programs-${Date.now()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Export complete');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const statusColors = {
    Completed: 'text-green-600',
    Ongoing: 'text-blue-600',
    Upcoming: 'text-orange-500',
    Postponed: 'text-red-500',
  };

  const statusDots = {
    Completed: 'bg-green-500',
    Ongoing: 'bg-blue-500',
    Upcoming: 'bg-orange-400',
    Postponed: 'bg-red-400',
  };

  const typeColors = {
    Workshop: 'bg-blue-100 text-blue-700',
    'On-Site': 'bg-purple-100 text-purple-700',
    Classroom: 'bg-green-100 text-green-700',
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Training Programs</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download size={12} />
              Export CSV
            </button>
            <button
              onClick={() => { setEditingProgram(null); setIsModalOpen(true); }}
              className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={12} />
              Add Program
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 px-4 sm:px-5 py-3 border-b border-gray-100">
          {['All Programs', 'All Status', 'All Types'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 ml-auto">
            <Search size={11} className="text-gray-400" />
            <input
              placeholder="Search program here..."
              className="text-xs outline-none bg-transparent text-gray-600 placeholder-gray-400 w-36 sm:w-48"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-[#1E4D7B]">
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">Title</th>
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">Category</th>
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">Type</th>
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">Instructor</th>
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">Start Date</th>
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">End Date</th>
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">Duration</th>
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">Enrolled</th>
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">Completed</th>
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">Avg Score</th>
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">Status</th>
                <th className="text-left px-3 py-2.5 text-[10px] sm:text-[11px] font-bold text-white tracking-wider whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {searchedPrograms.length === 0 ? (
                <tr><td colSpan={12} className="text-center py-8 text-gray-400 text-sm">No training programs found</td></tr>
              ) : (
                searchedPrograms.map((p, i) => (
                  <tr key={p._id || i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-5">
                      <div className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight max-w-[200px]">{p.title}</div>
                      <div className="text-xs text-gray-400">{p.description}</div>
                    </td>
                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{p.category || '—'}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[9px] sm:text-[12px] font-light px-2 py-0.5 rounded ${typeColors[p.type] || 'bg-gray-100 text-gray-600'}`}>{p.type || '—'}</span>
                    </td>
                    <td className="px-3 py-3 text-xs sm:text-sm font-bold text-gray-600">{p.instructor || '—'}</td>
                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{p.startDate ? new Date(p.startDate).toLocaleDateString('en-GB') : '—'}</td>
                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-600 whitespace-nowrap">{p.endDate ? new Date(p.endDate).toLocaleDateString('en-GB') : '—'}</td>
                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-600">{p.duration || '—'}</td>
                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-600">{p.enrolled ?? '—'}</td>
                    <td className="px-3 py-3 text-xs sm:text-sm text-gray-600">{p.completed ?? '—'}</td>
                    <td className="px-3 py-3 text-xs sm:text-sm font-bold text-[#1A6FC4]">{p.avgScore ?? '—'}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusDots[p.status] || 'bg-gray-400'}`} />
                        <span className={`text-[10px] sm:text-[11px] font-semibold ${statusColors[p.status] || 'text-gray-600'}`}>{p.status || '—'}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(p)} className="text-xs text-blue-600 font-semibold hover:text-blue-700">Edit</button>
                        <button onClick={() => setDeleteTarget(p._id)} className="text-xs text-red-500 font-semibold hover:text-red-700">Del</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-3 border-t border-gray-100">
          <span className="text-[10px] sm:text-xs text-gray-400">
            Showing {((pagination?.page || 1) - 1) * 10 + 1}–{Math.min((pagination?.page || 1) * 10, pagination?.total || 0)} of {pagination?.total || 0} Programs
          </span>
          <div className="flex items-center gap-1">
            {pagination && Array.from({ length: Math.min(pagination.pages || 1, 5) }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => onPageChange && onPageChange(n)}
                className={`w-6 h-6 rounded text-[10px] sm:text-xs font-semibold ${
                  n === (pagination?.page || 1) ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <TrainingFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProgram(null); }}
        onSubmit={handleAddProgram}
        initialData={editingProgram}
      />
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Program"
        message="Delete this training program? This action cannot be undone."
      />
    </>
  );
}
