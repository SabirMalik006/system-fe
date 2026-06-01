import React, { useState } from "react";
import QuickInsightCard from "./QuickInsightCard";
import StatsCards from "./StatsCards";
import RecentIssuances from "./RecentIssuances";
import EntrySummary from "./EntrySummary";
import StorageLocation from "./StorageLocation";
import RequestInfo from "./RequestInfo";
import RecipientInfo from "./RecipientInfo";
import ApprovalSection from "./ApprovalSection";
import IssuanceSuccessModal from "./IssuanceSuccessModal";
import Footer from "../../../components/common/fotter";

const StockOutEntry = () => {
  const [quantity, setQuantity] = useState(450);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const availableStock = 450;
  const isExceeding = quantity > availableStock;

  const handleConfirmIssuance = () => {
    // Check if there's any error
    if (isExceeding) {
      // Don't show modal if there's an error
      return;
    }
    // Show success modal
    setShowSuccessModal(true);
  };

  const handlePrintReceipt = () => {
    // Handle print functionality
    window.print();
  };

  const handleNewIssuance = () => {
    // Reset form and close modal
    setQuantity(450);
    setShowSuccessModal(false);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="max-w-[2560px] mx-auto bg-[#E8F4FF] min-h-screen">
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Stock Out Entry{" "}
            <span className="text-base sm:text-lg font-normal text-gray-400">
              (Item Issuance)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Create a new issuance record for items leaving the warehouse.
          </p>
        </div>

        {/* Main Grid - Responsive Layout */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6 order-1 lg:order-0">
            <RequestInfo
              quantity={quantity}
              setQuantity={setQuantity}
              availableStock={availableStock}
            />
            <RecipientInfo />
            <ApprovalSection onConfirm={handleConfirmIssuance} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-5 order-2 lg:order-none">
            <QuickInsightCard currentStock={1250} safetyThreshold={200} />
            {/* Hide Low Stock Alerts when error shows */}
            <StatsCards showLowStockAlert={!isExceeding} />
            <EntrySummary />
            <StorageLocation />
          </div>
        </div>

        {/* Recent Issuances - Full Width at Bottom - Hide when error shows */}
        <div className="w-full mt-6 lg:mt-0">
          <RecentIssuances showRecentIssuances={!isExceeding} />
        </div>
      </div>
      <Footer />

      {/* Success Modal */}
      <IssuanceSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        onPrint={handlePrintReceipt}
        onNewIssuance={handleNewIssuance}
        recordId="ISS-2023-0894-X"
      />
    </div>
  );
};

export default StockOutEntry;
