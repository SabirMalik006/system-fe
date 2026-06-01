import React, { useState } from "react";

const RequiredInfo = () => {
  const [quantity, setQuantity] = useState(12);
  const [returnReason, setReturnReason] = useState("");

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 0) {
      setQuantity(quantity - 1);
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
        <div>
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            ITEM RETURNED
          </label>
          <input className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white text-[#0F172A]"></input>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            QUANTITY RETURNED
          </label>
          <div className="relative">
            <input
              type="text"
              value={quantity}
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
          <textarea
            rows="3"
            placeholder="Why is this being returned?"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white resize-none text-[#0F172A]"
            style={{ height: "42px" }}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            RETURNING Staff
          </label>
          <input className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg  text-[#0F172A] appearance-none pr-10"></input>
        </div>
      </div>

      {/* Row 3: Demolition Stock - New Field */}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="text-sm font-medium text-[#64748B] mb-2 block">
            DEMOLUTION STOCK
          </label>
          <select className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white text-[#0F172A]">
            <option>Select Stock</option>
            <option>Scrap Material</option>
            <option>Damaged Goods</option>
            <option>End of Life Items</option>
            <option>Recyclable Items</option>
          </select>
        </div>
        <div>{/* Empty div to maintain grid alignment */}</div>
      </div>
    </div>
  );
};

export default RequiredInfo;
