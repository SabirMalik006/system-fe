import React from "react";

const ConditionReceipt = ({ formData, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex gap-2 items-center ">
        <img src="Icon (2).svg" alt="" className="pb-3" />
        <h2 className="text-lg font-semibold text-[#2B8CEE] mb-4">
          Condition & Receipt
        </h2>
      </div>

      {/* Item Condition - Increased Height */}
      <div className="mb-5">
        <label className="text-sm font-medium text-[#0F172A] mb-2 block">
          ITEM CONDITION UPON RETURN
        </label>
        <select
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white text-[#0F172A]"
          value={formData.condition}
          onChange={(e) => onChange("condition", e.target.value)}
        >
          <option value="SERVICEABLE">SERVICEABLE</option>
          <option value="REPAIRABLE">REPAIRABLE</option>
          <option value="UNSERVICEABLE">UNSERVICEABLE</option>
          <option value="BRAND_NEW">BRAND NEW</option>
          <option value="GOOD">GOOD</option>
          <option value="DAMAGED">DAMAGED</option>
        </select>
      </div>

      {/* Receiving Unit and Receiving User - Side by Side */}
      <div className="grid grid-cols-2 gap-6">
        {/* Receiving Unit */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            RECEIVING UNIT
          </label>
          <select
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
            value={formData.originUnit}
            onChange={(e) => onChange("originUnit", e.target.value)}
          >
            <option value="Main Distribution Hub">Main Distribution Hub</option>
            <option value="Warehouse A">Warehouse A</option>
            <option value="Warehouse B">Warehouse B</option>
          </select>
        </div>

        {/* Receiving User (Mapped to returningStaff in backend for simplicity, but here it's who receives it) */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            RECEIVING DEPARTMENT
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="identify the dept..."
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white pr-10"
              value={formData.department}
              onChange={(e) => onChange("department", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionReceipt;
