import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StoreHeader from "./StoreHeader";
import RequiredInfo from "./RequiredInfo";
import AdditionalInfo from "./AdditionalInfo";
import LineItems from "./LineItems";
import InventoryUpdate from "./InventoryUpdate";
import ItemDetail from "./ItemDetail";
import FinancialSummary from "./FinancialSummary";
import Footer from "../../common/fotter";
import { stockInAPI, itemsAPI } from "../../../services/api";
import toast, { Toaster } from 'react-hot-toast';

const StoreReceipt = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    itemId: "",
    quantity: 0,
    department: "Main Warehouse",
    notes: "",
    reference: "stock_in",
    referenceId: "",
    issuedTo: "",
  });

  const initialFormData = {
    itemId: "",
    quantity: 0,
    department: "Main Warehouse",
    notes: "",
    reference: "stock_in",
    referenceId: "",
    issuedTo: "",
  };

  useEffect(() => {
    if (formData.itemId) {
      fetchItemDetails(formData.itemId);
    } else {
      setSelectedItem(null);
    }
  }, [formData.itemId]);

  const fetchItemDetails = async (id) => {
    try {
      const response = await itemsAPI.getItemById(id);
      if (response.data.success) {
        setSelectedItem(response.data.item);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const handleClearForm = () => {
    setFormData({ ...initialFormData });
    setSelectedItem(null);
    toast.success("Form cleared");
  };

  const handleSaveDraft = () => {
    const draft = { ...formData, savedAt: new Date().toISOString() };
    localStorage.setItem("stockInDraft", JSON.stringify(draft));
    toast.success("Draft saved successfully");
  };

  const handleReviewSubmit = () => {
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!formData.itemId || formData.quantity <= 0) {
      alert("Please select an item and enter a valid quantity.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        unitPrice: selectedItem?.unitPrice || 0,
      };
      const response = await stockInAPI.createTransaction(payload);
      if (response.data.success) {
        toast.success("Stock In recorded successfully!");
        navigate("/stock-in");
      }
    } catch (error) {
      console.error("Error creating stock in transaction:", error);
      toast.error(error.response?.data?.message || "Failed to record stock in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-[#E8F4FF] min-h-screen">
      <Toaster position="top-right" />
      <div className="p-4 sm:p-6">
        {/* Header */}
        <StoreHeader onClearForm={handleClearForm} onSaveDraft={handleSaveDraft} onReviewSubmit={handleReviewSubmit} />

        {/* Main Grid - Responsive */}
        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Form */}
          <div className="lg:col-span-2 space-y-6 order-2 lg:order-none">
            <RequiredInfo formData={formData} setFormData={setFormData} />
            <AdditionalInfo formData={formData} setFormData={setFormData} />
            <LineItems />

            {/* Action Buttons - Added */}
            <div className="flex flex-wrap items-center justify-end gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-4 sm:px-6 py-2.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 sm:px-6 py-2.5 text-sm text-white bg-gradient-to-b from-[#1E4D7B] to-[#1E4D7B] rounded-lg hover:from-[#1D4ED8] hover:to-[#1976D2] transition-all shadow-sm disabled:opacity-50"
              >
                {loading ? "Processing..." : "Complete Receipt & Update Stock"}
              </button>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1 space-y-6 order-1 lg:order-none">
            <InventoryUpdate
              selectedItem={selectedItem}
              quantity={formData.quantity}
            />
            {/* ... existing stats cards ... */}

            {/* Stats Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {/* STORES REPORT */}
              <div className="bg-gradient-to-b from-[#1E4D7B] to-[#1E4D7B] rounded-xl border border-gray-200 p-3 text-white">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 sm:w-8 h-6 sm:h-8 text-white/90 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <div>
                    <div className="text-xs text-white/80 uppercase">
                      Items in Stock
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      {selectedItem ? selectedItem.stock : "0"}
                    </div>
                  </div>
                </div>
              </div>

              {/* FINANCE INFORMATION */}
              <div className="bg-gradient-to-b from-[#1E4D7B] to-[#1E4D7B] rounded-xl border border-gray-200 p-3 text-white">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-6 sm:w-8 h-6 sm:h-8 text-white/90 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <div className="text-xs text-white/80 uppercase">
                      Unit Price
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-white">
                      PKR {selectedItem ? selectedItem.unitPrice : "0"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ItemDetail selectedItem={selectedItem} />
            <FinancialSummary
              selectedItem={selectedItem}
              quantity={formData.quantity}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StoreReceipt;
