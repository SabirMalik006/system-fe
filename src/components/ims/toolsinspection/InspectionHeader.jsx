import React, { useState } from 'react';
import { Upload, Calendar, Plus } from 'lucide-react';
import SimpleTrainingModal from './SimpleTrainingModal';

export default function InspectionHeader({ onExport, onKitCreated }) {
  const [showModal, setShowModal] = useState(false);
  const [dateDisplay] = useState(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  });

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-[20px] font-black text-gray-900 leading-tight">Inspection</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <button onClick={onExport} className="flex items-center gap-1.5 border border-gray-200 bg-white text-gray-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Upload size={14} className="text-gray-500" />
            Export
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 bg-white text-gray-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <Calendar size={14} className="text-gray-500" />
            {dateDisplay}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded-xl transition-colors shadow-sm"
          >
            <Plus size={14} />
            Toolkit
          </button>
        </div>
      </div>
      <SimpleTrainingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => { setShowModal(false); if (onKitCreated) onKitCreated(); }}
      />
    </>
  );
}
