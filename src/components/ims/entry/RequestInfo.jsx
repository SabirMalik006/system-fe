import React, { useState, useEffect } from "react";
import { itemsAPI } from "../../../services/api";

const RequestInfo = ({ formData, setFormData, quantity, setQuantity, selectedItem }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await itemsAPI.getItems(1, 100);
      if (response.data.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  };

  const availableStock = selectedItem ? (selectedItem.currentStock || 0) : 0;
  const isExceeding = quantity > availableStock;
  const stockAfterIssue = availableStock - quantity;

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      {/* Header with Icon */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold text-[#2B8CEE]">
          Required Information
        </h2>
      </div>

      {/* Item Issued and Quantity - Side by Side */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        {/* Item Issued */}
        <div>
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            ITEM ISSUED *
          </label>
          <select
            value={formData.itemId}
            onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
          >
            <option value="">Select an item...</option>
            {items.map(item => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.identifiers})
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-[#64748B] block">
              QUANTITY *
            </label>
            {isExceeding && (
              <span className="text-xs text-red-500">
                Stock after issue:{" "}
                <span className="font-medium">{Math.max(0, stockAfterIssue)}</span>
              </span>
            )}
          </div>
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange("decrement")}
              className="w-14 h-12 flex items-center justify-center border border-gray-300 rounded-l-lg text-gray-600 bg-[#F1F5F9] text-xl hover:bg-gray-200 transition-colors"
            >
              -
            </button>
            <input
              type="text"
              value={quantity}
              className={`w-full px-4 py-3 text-base text-center border-t border-b border-gray-300 focus:outline-none focus:border-[#1A8FA0] bg-white font-medium ${
                isExceeding ? "border-red-500" : ""
              }`}
              readOnly
            />
            <button
              onClick={() => handleQuantityChange("increment")}
              className="w-14 h-12 flex items-center justify-center border border-gray-300 rounded-r-lg text-gray-600 bg-[#F1F5F9] text-xl hover:bg-gray-200 transition-colors"
            >
              +
            </button>
          </div>
          {/* Error Message - Only show when exceeding */}
          {isExceeding && (
            <div className="mt-2 text-xs text-red-500">
              Requested quantity exceeds available stock. Available stock:{" "}
              {availableStock}
            </div>
          )}
        </div>
      </div>

      {/* Purpose of Issuance and Issuing Unit - Side by Side */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            PURPOSE OF ISSUANCE *
          </label>
          <input
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g., Daily repair work, Maintenance..."
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white text-[#64748B]"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            ISSUING UNIT/DEPARTMENT *
          </label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white text-[#64748B]"
          >
            <option>Main Warehouse</option>
            <option>Secondary Warehouse</option>
            <option>Storage Unit A</option>
            <option>Tools Store</option>
          </select>
        </div>
      </div>

      {/* Issuing User and Date - Side by Side */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            ISSUING USER
          </label>
          <input
            type="text"
            value="Current User"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-[#64748B]"
            readOnly
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            DATE & TIME
          </label>
          <input
            type="text"
            value={new Date().toLocaleString()}
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-[#64748B]"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default RequestInfo;
