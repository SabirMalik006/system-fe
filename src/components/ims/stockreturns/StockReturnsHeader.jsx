import React, { useState, useRef, useEffect } from "react";
import { Download, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { stockReturnAPI } from "../../../services/api";
import { exportToCSV } from "../../../utils/exportUtils";

export default function StockReturnsHeader() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      // Fetch all transactions (page 1, large limit)
      const response = await stockReturnAPI.getTransactions(1, 1000);
      if (response.data.success) {
        const data = response.data.transactions;
        const exportHeaders = [
          { label: "RETURN ID", key: "id" },
          { label: "DATE LOGGED", key: "date" },
          { label: "INVENTORY ITEM", key: "item" },
          { label: "QTY", key: "qty" },
          { label: "REASON", key: "reason" },
          { label: "CONDITION", key: "condition" },
          { label: "RETURNING STAFF", key: "staff" },
          { label: "ORIGIN UNIT", key: "origin" },
          { label: "STATUS", key: "status" },
        ];
        exportToCSV(data, exportHeaders, "all_stock_returns");
      }
    } catch (error) {
      console.error("Export failed", error);
    } finally {
      setIsExporting(false);
    }
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowCreateModal(false);
      }
    };

    if (showCreateModal) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "unset";
    };
  }, [showCreateModal]);

  return (
    <>
      {/* Page Header */}
      <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl text-center sm:text-left font-black font-medium text-[#0F172A] tracking-wide">
            STOCK RETURNS
          </h1>
          <p className="text-sm sm:text-md text-center sm:text-left text-[#64748B] mt-0.5 font-light">
            All recorded return transactions
          </p>
        </div>
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <button
            onClick={handleExportAll}
            disabled={isExporting}
            className="flex items-center gap-1.5 border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm cursor-pointer hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <Download size={14} />
            {isExporting ? "EXPORTING..." : "EXPORT"}
          </button>
          <button
            onClick={() => navigate("/return")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#3B82F6] to-[#1E4D7B] hover:from-[#2563EB] hover:to-[#1A3A6B] text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
          >
            <Plus size={16} />
            New Return
          </button>
        </div>
      </div>

      {/* ====================== CREATE NEW ITEM MODAL ====================== */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div
            ref={modalRef}
            className="bg-white rounded-sm w-full max-w-sm shadow-xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-white flex items-center justify-between px-4 py-2.5">
              <h2 className="text-lg font-semibold text-gray-800">
                Create New Item
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3">
              {/* Item ID */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
                  Item ID
                </label>
                <input
                  type="text"
                  value="ITEM-2024001"
                  readOnly
                  className="w-full bg-[#F1F5F9] border border-gray-300 rounded-sm px-2.5 py-1.5 text-gray-700 focus:outline-none text-xs"
                />
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
                  Item Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hammer Set"
                  className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#1A8FA0] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Item Identifier */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
                    Item Identifier (SKU/Barcode)
                  </label>
                  <div className="relative border border-gray-300 rounded-sm">
                    <input
                      type="text"
                      placeholder="Scan or enter SKU"
                      className="w-full px-2.5 py-1.5 pr-16 focus:outline-none text-xs rounded-sm"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <img
                        src="/Container (3).png"
                        alt=""
                        className="h-3.5 w-3.5 object-contain cursor-pointer"
                      />
                      <img
                        src="/Text.png"
                        alt=""
                        className="h-3.5 w-3.5 object-contain cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
                    Category
                  </label>
                  <select className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#1A8FA0] text-xs">
                    <option>Sanitary</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Lighting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Unit of Measure */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
                    Unit of Measure
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., pcs, boxes, meters"
                    className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none text-xs"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
                    Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-gray-500 text-xs">
                      $
                    </span>
                    <input
                      type="text"
                      className="w-full bg-[#F1F5F9] border border-gray-300 rounded-sm pl-6 pr-2.5 py-1.5 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Minimum Stock Level */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
                    Minimum Stock Level
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10"
                    className="w-full border bg-[#F8FAFC] border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none text-xs"
                  />
                </div>

                {/* Threshold */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
                    Threshold
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25"
                    className="w-full bg-[#F8FAFC] border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none text-xs"
                  />
                </div>
              </div>

              {/* Current Stock and Status */}
              <div className="grid grid-cols-2 gap-3">
                {/* Current Stock */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-0.5">
                    Current Stock
                  </label>
                  <input
                    type="text"
                    value="500 units"
                    readOnly
                    className="w-full bg-gray-100 border border-gray-300 rounded-sm px-2.5 py-1.5 text-gray-700 text-xs"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[11px] font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative w-8 h-4 bg-[#2196F3] rounded-full cursor-pointer">
                      <div className="absolute top-0.5 right-0.5 w-3 h-3 bg-white rounded-full shadow"></div>
                    </div>
                    <span className="text-[11px] font-medium text-gray-700">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 flex  gap-2 px-4 py-2.5 border-t">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-1.5 border border-gray-300 rounded-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors text-xs"
              >
                Cancel
              </button>
              <button className="flex-1 py-1.5 bg-[#2196F3] text-white rounded-sm font-medium hover:bg-[#167a89] transition-colors text-xs">
                Create Item
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
