import React from "react";
import TransferKPICards from "../../components/hrm/transfer/TransferKPICards";
import NewTransferOrderForm from "../../components/hrm/transfer/NewTransferOrderForm";
import QuickTransferHistory from "../../components/hrm/transfer/QuickTransferHistory";
import RecentTransferOrders from "../../components/hrm/transfer/RecentTransferOrders";
import TransferAnalytics from "../../components/hrm/transfer/TransferAnalytics";

export default function InterUnitTransfer() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 py-5 flex flex-col gap-4">
        <TransferKPICards />

        {/* Middle row: Form + Quick History */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <NewTransferOrderForm />
          <QuickTransferHistory />
        </div>

        <RecentTransferOrders />
        <TransferAnalytics />
      </div>
    </div>
  );
}
