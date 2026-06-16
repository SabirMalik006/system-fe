import React, { useState } from 'react';
import { Upload, Calendar, Plus } from 'lucide-react';
import TrainingFormModal from './TrainingFormModal';
import { trainingAPI } from '../../../services/api';
import toast from 'react-hot-toast';

export default function TrainingHeader({ onRefresh }) {
  const [showForm, setShowForm] = useState(false);

  const handleCreateProgram = async (formData) => {
    try {
      await trainingAPI.create(formData);
      toast.success('Training program created');
      setShowForm(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create program');
    }
  };

  const handleExport = async () => {
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

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-base font-black text-gray-900 leading-tight">
            Training Management
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 border border-gray-200 bg-white text-gray-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Upload size={14} className="text-gray-500" />
            Export
          </button>

          <button className="flex items-center gap-1.5 border border-gray-200 bg-white text-gray-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Calendar size={14} className="text-gray-500" />
            {today}
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={14} />
            New Program
          </button>
        </div>
      </div>

      <TrainingFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreateProgram}
      />
    </>
  );
}
