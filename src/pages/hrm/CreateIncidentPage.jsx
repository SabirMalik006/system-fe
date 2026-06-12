import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import IncidentRecordForm from '../../components/hrm/compliance/IncidentRecordForm';

export default function CreateIncidentPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#EEF4FB] font-sans">
      <div className="max-w-[2560px] mx-auto px-5 py-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/compliance')}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                New Incident Record
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the form below to record a new disciplinary incident
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/compliance')}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm flex-shrink-0"
          >
            <Plus size={15} />
            Back to Compliance
          </button>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <IncidentRecordForm onSuccess={() => navigate('/compliance')} />
        </div>
      </div>
    </div>
  );
}
