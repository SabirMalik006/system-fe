import React from "react";
import Footer from "../../common/fotter";

const StockOutEntry = () => {
  return (
    <div className=" max-w-[2560px] mx-auto bg-[#E8F4FF]">
      {/* Header */}
      <div className="pt-6 px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Stock Out Entry{" "}
          <span className="text-lg font-normal text-[#94A3B8]">
            (Item Issuance)
          </span>
        </h1>
        <p className="text-md text-[#64748B]">
          Create a new issuance record for items leaving the warehouse.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Main Form - Left Side (2 columns) */}
        <div className="col-span-2 space-y-6">
          {/* Required Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Required Information
            </h2>

            {/* Item Issued */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                ITEM ISSUED
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search item name or SKU"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]"
                />
                <span className="absolute right-3 top-2 text-gray-400">🔍</span>
              </div>
            </div>

            {/* Quantity with Stock Warning */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">
                  QUANTITY*
                </label>
                <span className="text-xs text-gray-500">
                  Stock after issue:{" "}
                  <span className="text-red-500 font-medium">-50</span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                  -
                </button>
                <input
                  type="text"
                  value="500"
                  className="w-20 px-3 py-1.5 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]"
                />
                <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50">
                  +
                </button>
              </div>
              <div className="mt-2 text-xs text-red-500">
                Requested quantity exceeds available stock. Available stock: 450
              </div>
            </div>

            {/* Purpose and Unit */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  PURPOSE OF ISSUANCE
                </label>
                <input className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  ISSUING UNIT/DEPARTMENT
                </label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]">
                  <option>Main Warehouse</option>
                  <option>Secondary Warehouse</option>
                </select>
              </div>
            </div>

            {/* Issuing User and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  ISSUING USER
                </label>
                <input
                  type="text"
                  value="Alex Richardson (Store Manager)"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  DATE & TIME
                </label>
                <input
                  type="text"
                  value="08/12/2024, 02:30 PM"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Recipient Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Recipient Information
            </h2>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                PERSONNEL (RECIPIENT)
              </label>
              <input
                type="text"
                placeholder="Type staff name or ID..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]"
              />
            </div>
          </div>

          {/* Approval & Verification Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Approval & Verification
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  APPROVING AUTHORITY
                </label>
                <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]">
                  <option>Select Supervisor...</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  CURRENT STATUS
                </label>
                <input
                  type="text"
                  value="Draft"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  readOnly
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="policyCheck"
                className="rounded border-gray-300 text-[#1A8FA0] focus:ring-[#1A8FA0]"
              />
              <label htmlFor="policyCheck" className="text-sm text-gray-600">
                I confirm that this issuance complies with company policy.
              </label>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">
                Reset Form
              </button>
              <button className="px-4 py-2 text-sm text-white bg-[#1A8FA0] rounded-md hover:bg-[#167a89]">
                Confirm Issuance
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quick Insight (1 column) */}
        <div className="col-span-1 space-y-6 ">
          {/* Quick Insight Card */}
          <div className="bg-gradient-to-t from-[#1E4D7B] to-[#1A6FC4] rounded-lg border border-gray-200 p-6 text-white z-1 relative">
            <img
              src="/Vector.png"
              alt=""
              className="absolute top-0 right-0 z-0"
            />
            <div className="flex items-center gap-2 font-500">
              <img src="/f.png" alt="" className="pb-2" />
              <h2 className="text-md font-semibold  mb-3">Quick Insight</h2>
            </div>

            <div className="mb-4 z-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="">Current Stock:</span>
                <span className="font-medium z-1">1,260 Units</span>
                {/* <img src="/3.png" alt="" /> */}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="">Safety Threshold:</span>
                <span className="font-medium z-1 ">200 Units</span>
              </div>
            </div>

            <p className="text-xs">
              * Stock availability projections based on current issuance path.
            </p>
          </div>

          {/* Stats Cards */}
          {/* Stats Cards with Gradient - All Three */}
          <div className="grid grid-cols-1 gap-4">
            {/* TOTAL ISSUANCES */}
            <div className="bg-gradient-to-b from-[#3AA5B9] to-[#1E4F7A] rounded-lg border border-gray-200 p-2 py-3 px-4 text-white">
              <div className="flex items-center gap-2">
                <img src="/Overlay.png" alt="" className="h-11 w-11 mr-2" />
                <div>
                  <div className="text-xs">TOTAL ISSUANCES</div>
                  <div className="text-2xl font-light">24</div>
                </div>
              </div>
            </div>

            {/* PENDING APPROVALS */}
            <div className="bg-gradient-to-b from-[#3AA5B9] to-[#1E4F7A] rounded-lg border border-gray-200 p-2 py-3 px-4 text-white">
              <div className="flex items-center gap-2">
                <img
                  src="/Overlay (1).png "
                  alt=""
                  className="h-11 w-11 mr-2"
                />
                <div>
                  <div className="text-xs">PENDING APPROVALS</div>
                  <div className="text-2xl font-light">05</div>
                </div>
              </div>
            </div>

            {/* AMOUNT TO TAKE */}
            <div className="bg-gradient-to-b from-[#3AA5B9] to-[#1E4F7A] rounded-lg border border-gray-200 p-2 py-3 px-4 text-white">
              <div className="flex items-center gap-2">
                <img src="/Overlay (2).png" alt="" className="h-11 w-11 mr-2" />
                <div>
                  <div className="text-xs">AMOUNT TO TAKE</div>
                  <div className="text-2xl font-light">12</div>
                </div>
              </div>
            </div>
          </div>

          {/* Entry Summary Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
              Entry Summary
            </h2>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sub-Total Units:</span>
                <span className="font-medium text-gray-900">0.00</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Estimated Weight:</span>
                <span className="font-medium text-gray-900">0.00 kg</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Package count:</span>
                <span className="font-medium text-gray-900">
                  Unit Allocation
                </span>
              </div>
            </div>

            {/* <div>
                            <label className="text-sm font-medium text-gray-700 mb-1 block">STORAGE LOCATION</label>
                            <input
                                type="text"
                                value="Aisle 4, Shelf B-12"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                                readOnly
                            />
                        </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StockOutEntry;
