import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { stockOutAPI, itemsAPI } from "../../../services/api";
import toast, { Toaster } from 'react-hot-toast';

const StockOutEntry = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdTransaction, setCreatedTransaction] = useState(null);
  const [stats, setStats] = useState({
    totalIssuances: 0,
    pendingApprovals: 0,
    approvedIssuances: 0,
    lowStockAlerts: 0
  });
  const [recentIssuances, setRecentIssuances] = useState([]);
  
  const [formData, setFormData] = useState({
    itemId: "",
    quantity: 0,
    issuedTo: "",
    department: "Main Warehouse",
    reference: "stock_out",
    referenceId: "",
    notes: ""
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchRecentIssuances();
  }, []);

  useEffect(() => {
    // Fetch item details if itemId changes
    if (formData.itemId) {
      fetchItemDetails(formData.itemId);
    } else {
      setSelectedItem(null);
    }
  }, [formData.itemId]);

  const fetchStats = async () => {
    try {
      const response = await stockOutAPI.getSummary();
      if (response.data.success) {
        const summary = response.data.summary;
        setStats({
          totalIssuances: summary.totalIssuances || 0,
          pendingApprovals: summary.pendingApprovals || 0,
          approvedIssuances: summary.completedIssuances || 0,
          lowStockAlerts: summary.lowStockCount || 0
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Keep default stats on error
    }
  };

  const fetchRecentIssuances = async () => {
    try {
      const response = await stockOutAPI.getTransactions(1, 6);
      if (response.data.success) {
        const transactions = response.data.transactions || [];
        // Format transactions for display
        const formatted = transactions.map(transaction => ({
          issuedTo: transaction.officer,
          itemName: transaction.item,
          transactionDate: transaction.date,
          timeAgo: getTimeAgo(transaction.date)
        }));
        setRecentIssuances(formatted);
      }
    } catch (error) {
      console.error("Error fetching recent issuances:", error);
      // Keep default empty list on error
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const fetchItemDetails = async (id) => {
    try {
      const response = await itemsAPI.getItemById(id);
      if (response.data.success) {
        setSelectedItem(response.data.item);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
      toast.error("Failed to load item details");
    }
  };

  const availableStock = selectedItem ? (selectedItem.currentStock || 0) : 0;
  const isExceeding = quantity > availableStock;

  const handleConfirmIssuance = async () => {
    if (!formData.itemId) {
      toast.error("Please select an item");
      return;
    }
    
    if (quantity <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (isExceeding) {
      toast.error(`Insufficient stock! Available: ${availableStock}, Requested: ${quantity}`);
      return;
    }

    if (!formData.issuedTo) {
      toast.error("Please enter recipient name");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        quantity: Number(quantity) || 0
      };
      const response = await stockOutAPI.createStockOut(payload);
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/stock-issuance');
      }
    } catch (error) {
      console.error("Error creating stock out:", error);
      toast.error(error.response?.data?.message || "Failed to create stock out");
    } finally {
      setLoading(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleNewIssuance = () => {
    // Reset form
    setFormData({
      itemId: "",
      quantity: 0,
      issuedTo: "",
      department: "Main Warehouse",
      reference: "stock_out",
      referenceId: "",
      notes: ""
    });
    setQuantity(0);
    setSelectedItem(null);
    setShowSuccessModal(false);
    setCreatedTransaction(null);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="max-w-[2560px] mx-auto bg-[#E8F4FF] min-h-screen">
      <Toaster position="top-right" />
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
              formData={formData}
              setFormData={setFormData}
              quantity={quantity}
              setQuantity={setQuantity}
              selectedItem={selectedItem}
            />
            <RecipientInfo
              issuedTo={formData.issuedTo}
              setIssuedTo={(value) => setFormData({ ...formData, issuedTo: value })}
            />
            <ApprovalSection 
              onConfirm={handleConfirmIssuance}
              loading={loading}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-5 order-2 lg:order-none">
            <QuickInsightCard 
              currentStock={availableStock} 
              safetyThreshold={selectedItem?.threshold || 200} 
            />
            <StatsCards 
              showLowStockAlert={!isExceeding}
              totalIssuances={stats.totalIssuances}
              pendingApprovals={stats.pendingApprovals}
              approvedIssuances={stats.approvedIssuances}
              lowStockAlerts={stats.lowStockAlerts}
            />
            <EntrySummary 
              selectedItem={selectedItem}
              quantity={quantity}
            />
            <StorageLocation />
          </div>
        </div>

        {/* Recent Issuances - Full Width at Bottom */}
        <div className="w-full mt-6 lg:mt-0">
          <RecentIssuances 
            showRecentIssuances={!isExceeding}
            recentIssuances={recentIssuances}
          />
        </div>
      </div>
      <Footer />

      {/* Success Modal */}
      <IssuanceSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        onPrint={handlePrintReceipt}
        onNewIssuance={handleNewIssuance}
        recordId={createdTransaction?.referenceId || "ISS-NA"}
      />
    </div>
  );
};

export default StockOutEntry;
