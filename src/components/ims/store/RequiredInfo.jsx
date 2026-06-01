import React, { useState } from "react";

const RequiredInfo = () => {
  const [quantity, setQuantity] = useState(30);

  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity(quantity + 1);
    } else if (type === "decrement" && quantity > 0) {
      setQuantity(quantity - 1);
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
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            ITEM RECEIVED (ITEM MASTER)
          </label>
          <select className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white">
            <option>Ind. control Power Drill Gen 4 (ITM-RC1-TM-001)</option>
            <option>Electric Screwdriver (ITM-RC1-TM-002)</option>
            <option>Hammer Drill (ITM-RC1-TM-003)</option>
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Item received from vendor
          </p>
        </div>

        {/* Quantity */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            QUANTITY RECEIVED
          </label>
          <div className="relative w-32">
            <input
              type="text"
              value={quantity}
              className="w-full px-4 py-2.5 text-base text-center border border-gray-300 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white font-medium"
              readOnly
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-0.5">
              <button
                onClick={() => handleQuantityChange("increment")}
                className="p-0.5 hover:bg-gray-100 rounded"
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-500"
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
                className="p-0.5 hover:bg-gray-100 rounded"
              >
                <svg
                  className="w-3.5 h-3.5 text-gray-500"
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

        {/* Receiving Unit and Date & Time - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Receiving Unit */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              RECEIVING UNIT / WAREHOUSE
            </label>
            <input className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white" />
          </div>

          {/* Receiving Date & Time */}
          {/* <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">RECEIVING DATE & TIME</label>
                        <input
                            type="text"
                            value="Central Warehouse A"
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-[#94A3B8]"
                            readOnly
                        />
                        
                    </div> */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              RECEIVING USER
            </label>
            <input
              type="text"
              value="Alex Richardson (ID: WH-MGR-001)"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-[#94A3B8]"
              readOnly
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Date & Time of receipt
            </label>
            <input
              type="text"
              value="Feb 15, 2020, 06:30 AM"
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
