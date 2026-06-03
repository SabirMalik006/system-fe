import React from "react";

const AdditionalRemarks = ({ formData, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="text-lg font-semibold text-[#1E293B] mb-4">
        Additional Remarks
      </h2>

      <textarea
        rows="3"
        placeholder="Optional — any additional observations or notes about this return..."
        className="text-[#1E293B] placeholder:text-gray-400 w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white resize-none"
        value={formData.notes}
        onChange={(e) => onChange("notes", e.target.value)}
      />
    </div>
  );
};

export default AdditionalRemarks;
