import React, { useState } from "react";

const ApprovalSection = ({ onConfirm }) => {
  const [approvingAuthority, setApprovingAuthority] = useState("");
  const [confirmPolicy, setConfirmPolicy] = useState(false);

  const handleReset = () => {
    setApprovingAuthority("");
    setConfirmPolicy(false);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex gap-2 items-center">
        <img src="tik.png" alt="" className="pb-3" />
        <h2 className="text-xl font-semibold text-[#2B8CEE] mb-4">
          Approval & Verification
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">
            APPROVING AUTHORITY
          </label>
          <input
            value={approvingAuthority}
            onChange={(e) => setApprovingAuthority(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-[#2B8CEE] mb-1.5 block">
            CURRENT STATUS
          </label>
          <input
            type="text"
            value="Draft"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
            readOnly
          />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          id="policyCheck"
          checked={confirmPolicy}
          onChange={(e) => setConfirmPolicy(e.target.checked)}
          className="rounded border-gray-300 text-[#1A8FA0] focus:ring-[#1A8FA0]"
        />
        <label htmlFor="policyCheck" className="text-sm text-gray-600">
          I confirm that this issuance complies with company policy.
        </label>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset Form
        </button>
        <button
          onClick={handleConfirm}
          className="px-4 py-2 text-sm text-white bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B] rounded-lg hover:from-[#1D4ED8] hover:to-[#1976D2] transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1"
        >
          <img src="pp.png" alt="" />
          Confirm Issuance
        </button>
      </div>
    </div>
  );
};

export default ApprovalSection;
