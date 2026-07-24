import React, { useState, useCallback, useRef, useEffect } from "react";
import { Plus } from 'lucide-react';
import TransferKPICards from "../../components/hrm/transfer/TransferKPICards";
import NewTransferOrderForm from "../../components/hrm/transfer/NewTransferOrderForm";
import QuickTransferHistory from "../../components/hrm/transfer/QuickTransferHistory";
import RecentTransferOrders from "../../components/hrm/transfer/RecentTransferOrders";
import TransferAnalytics from "../../components/hrm/transfer/TransferAnalytics";

export default function InterUnitTransfer() {
  const formRef = useRef(null);
  const [editId, setEditId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showForm]);

  const handleFormSuccess = useCallback(() => {
    setEditId(null);
    setShowForm(false);
    setRefreshKey(k => k + 1);
  }, []);

  const handleFormCancel = useCallback(() => {
    setEditId(null);
    setShowForm(false);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 py-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-tight">
              Inter-Unit Transfer
            </h1>
            <p className="text-sm md:text-base text-gray-500 mt-1">
              Manage and track personnel transfers across units and designations
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-[#274c77] hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm flex-shrink-0"
          >
            <Plus size={15} />
            New Transfer Order
          </button>
        </div>

        <TransferKPICards refreshKey={refreshKey} />

        {showForm ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div ref={formRef}>
                <NewTransferOrderForm
                  editId={editId}
                  onSuccess={handleFormSuccess}
                  onCancel={handleFormCancel}
                />
              </div>
              <QuickTransferHistory refreshKey={refreshKey} />
            </div>
            <RecentTransferOrders refreshKey={refreshKey} />
            <TransferAnalytics refreshKey={refreshKey} />
          </>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-5xl flex flex-col gap-4">
              <QuickTransferHistory refreshKey={refreshKey} />
              <RecentTransferOrders refreshKey={refreshKey} />
              <TransferAnalytics refreshKey={refreshKey} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
