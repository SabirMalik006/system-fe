import React from "react";

const RequestInfo = ({ formData, setFormData }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">
          Request Information
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500">REQ-2024-0812</span>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
            Draft saved 2 minutes ago
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">
            Request Type
          </label>
          <select
            value={formData.requestType}
            onChange={(e) =>
              setFormData({ ...formData, requestType: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
          >
            <option>Manual Request</option>
            <option>Auto Request</option>
            <option>Emergency Request</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">
            Requesting Unit
          </label>
          <select
            value={formData.requestingUnit}
            onChange={(e) =>
              setFormData({ ...formData, requestingUnit: e.target.value })
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
          >
            <option>Warehouse A - North Sector</option>
            <option>Warehouse B - South Sector</option>
            <option>Warehouse C - East Sector</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">
            Requesting User
          </label>
          <input
            type="text"
            value={formData.requestingUser || ""}
            onChange={(e) =>
              setFormData({ ...formData, requestingUser: e.target.value })
            }
            placeholder="Enter name..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 mb-1.5 block">
            Priority Level
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="priority"
                value="Low"
                checked={formData.priority === "Low"}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="text-[#1A8FA0]"
              />
              <span className="text-sm text-gray-600">Low</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="priority"
                value="Medium"
                checked={formData.priority === "Medium" || !formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="text-[#1A8FA0]"
              />
              <span className="text-sm text-gray-600">Medium</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="priority"
                value="High"
                checked={formData.priority === "High"}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="text-[#1A8FA0]"
              />
              <span className="text-sm text-gray-600">High</span>
            </label>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-600 mb-1.5 block">
          Reason for Purchase
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          rows="3"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
          placeholder="Describe why these items are needed..."
        />
      </div>
    </div>
  );
};

export default RequestInfo;
