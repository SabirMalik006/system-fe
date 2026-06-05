import React, { useState, useEffect } from "react";
import { itemsAPI } from "../../../services/api";

const RequiredInfo = ({ formData, setFormData }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchItems();
  }, []);

  const handleQuantityChange = (type) => {
    const currentQty = parseInt(formData.quantity) || 0;
    if (type === "increment") {
      setFormData({ ...formData, quantity: currentQty + 1 });
    } else if (type === "decrement" && currentQty > 0) {
      setFormData({ ...formData, quantity: currentQty - 1 });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-semibold text-[#2B8CEE] mb-4">
        Required Information
      </h2>

      <div className="space-y-4">
        {/* Item Received */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block uppercase">
            ITEM RECEIVED (ITEM MASTER)
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
          <p className="text-xs text-gray-400 mt-1">
            Item received from vendor
          </p>
        </div>

        {/* Quantity */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block uppercase">
            QUANTITY RECEIVED
          </label>
          <div className="relative w-32">
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 text-base text-center border border-gray-300 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white font-medium"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-0.5">
              <button
                onClick={() => handleQuantityChange("increment")}
                className="p-0.5 hover:bg-gray-100 rounded"
              >
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => handleQuantityChange("decrement")}
                className="p-0.5 hover:bg-gray-100 rounded"
              >
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Receiving Unit and Date & Time - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Receiving Unit */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block uppercase">
              RECEIVING UNIT / WAREHOUSE
            </label>
            <input 
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Warehouse A"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white" 
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block uppercase">
              RECEIVING USER
            </label>
            <input
              type="text"
              value={formData.userName || "Current User"}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-[#94A3B8]"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block uppercase">
              Date & Time of receipt
            </label>
            <input
              type="text"
              value={new Date().toLocaleString()}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-[#94A3B8]"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequiredInfo;
