import React, { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { itemsAPI } from "../../../services/api";

const RequiredInfo = ({ formData, onChange, onItemSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchItems();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const searchItems = async () => {
    setIsSearching(true);
    try {
      const response = await itemsAPI.getItems(1, 5, searchTerm);
      if (response.data.success) {
        setSearchResults(response.data.items);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Failed to search items:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (item) => {
    onItemSelect(item);
    setSearchTerm(item.name);
    setShowResults(false);
  };

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      onChange("quantity", formData.quantity + 1);
    } else if (type === "decrement" && formData.quantity > 1) {
      onChange("quantity", formData.quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <img src="Icon (1).svg" alt="" />
        <h2 className="text-lg font-semibold text-[#0F172A]">
          Required Information
        </h2>
      </div>

      {/* Row 1: Item Returned and Quantity Returned - Side by Side */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div className="relative">
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            ITEM RETURNED
          </label>
          <div className="relative">
            <input
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white text-[#0F172A]"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 size={16} className="animate-spin text-gray-400" />
              </div>
            )}
          </div>

          {showResults && searchResults.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((item) => (
                <div
                  key={item._id}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
                  onClick={() => handleSelect(item)}
                >
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    {item.sku} | Stock: {item.currentStock}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            QUANTITY RETURNED
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.quantity}
              className="w-full px-4 py-2 text-base text-center border border-gray-300 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white font-medium"
              readOnly
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col">
              <button
                onClick={() => handleQuantityChange("increment")}
                className="p-0.5 hover:bg-gray-100 rounded transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleQuantityChange("decrement")}
                className="p-0.5 hover:bg-gray-100 rounded transition-colors"
              >
                <svg
                  className="w-4 h-4 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Return Reason and Returning Staff - Side by Side */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            RETURN REASON
          </label>
          <select
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white text-[#0F172A]"
            value={formData.reason}
            onChange={(e) => onChange("reason", e.target.value)}
          >
            <option value="DAMAGED">DAMAGED</option>
            <option value="EXPIRED">EXPIRED</option>
            <option value="EXCESS">EXCESS</option>
            <option value="DEFECTIVE">DEFECTIVE</option>
            <option value="PROJECT_END">PROJECT END</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            RETURNING Staff
          </label>
          <input
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg text-[#0F172A]"
            value={formData.returningStaff}
            onChange={(e) => onChange("returningStaff", e.target.value)}
            placeholder="Name of the person returning"
          />
        </div>
      </div>

      {/* Row 3: Reason Description */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            REASON DESCRIPTION
          </label>
          <textarea
            rows="2"
            placeholder="Detailed explanation of the return..."
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white resize-none text-[#0F172A]"
            value={formData.reasonDescription}
            onChange={(e) => onChange("reasonDescription", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RequiredInfo;
