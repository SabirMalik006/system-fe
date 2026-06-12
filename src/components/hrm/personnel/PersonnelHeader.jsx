import React from 'react';
import { IdCard, FileText, X, Upload, Loader } from 'lucide-react';

export default function PersonnelHeader({ loading, onSaveDraft, onSubmit, onCancel }) {
  return (
    <header className="bg-gradient-to-r from-[#0B4E89] to-[#0F5D98] px-5 sm:px-8 py-6 flex items-center justify-between sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <img src="/99.svg" alt=""  />
        </div>
        <span className="text-white text-lg font-bold tracking-tight">Personnel Profile</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onSaveDraft}
          disabled={loading}
          className="flex items-center gap-1.5 border border-[#6DB8E8] text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <FileText size={14} className='text-[#6DB8E8]' />
          <span className="hidden sm:inline font-semibold text-[#6DB8E8]">Save Draft</span>
        </button>

        <button
          onClick={onCancel}
          disabled={loading}
          className="flex items-center gap-1.5 bg-white text-gray-700 text-sm font-semibold px-3 sm:px-4 py-2 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X size={14} />
          <span className="hidden sm:inline">Cancel</span>
        </button>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="flex items-center gap-1.5 bg-[#3B82F6] hover:bg-blue-700 text-white text-sm font-semibold px-3 sm:px-4 py-2 rounded-md transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader size={14} className="animate-spin" /> : <Upload size={14} />}
          <span className="hidden sm:inline">{loading ? 'Saving...' : 'Save & Submit'}</span>
        </button>
      </div>
    </header>
  );
}
