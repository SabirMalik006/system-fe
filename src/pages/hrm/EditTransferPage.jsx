import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import NewTransferOrderForm from '../../components/hrm/transfer/NewTransferOrderForm';

export default function EditTransferPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 py-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/inter-unit-transfer/${id}`)}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                Edit Transfer Order
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Update the transfer order details
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <NewTransferOrderForm
            editId={id}
            onSuccess={() => navigate(`/inter-unit-transfer/${id}`)}
            onCancel={() => navigate(`/inter-unit-transfer/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}
