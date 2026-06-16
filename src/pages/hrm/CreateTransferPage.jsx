import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import NewTransferOrderForm from '../../components/hrm/transfer/NewTransferOrderForm';

export default function CreateTransferPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 py-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/inter-unit-transfer')}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                New Transfer Order
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the details below to create a new inter-unit transfer
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/inter-unit-transfer')}
            className="flex items-center gap-1.5 bg-[#274c77] hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm flex-shrink-0"
          >
            <Plus size={15} />
            Back to Transfers
          </button>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <NewTransferOrderForm onSuccess={() => navigate('/inter-unit-transfer')} />
        </div>
      </div>
    </div>
  );
}
