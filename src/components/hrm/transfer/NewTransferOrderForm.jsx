import React, { useState } from "react";
import { RefreshCw, ChevronDown, User } from "lucide-react";

const inputCls =
  "w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors font-semibold";
const selectCls = `${inputCls} appearance-none pr-7 cursor-pointer`;
const labelCls =
  "block text-[10px] font-bold text-gray-600 tracking-wider uppercase mb-1.5";

const cmesUnits = [
  "CMES ISB/LHR",
  "CMES COMPAK",
  "CMES ORMARA",
  "CMES COMLOG",
  "CMES COMCOAST",
  "CMES COMKAR",
];

const geAeOptions = [
  "GE SOUTH",
  "GE EAST",
  "GE KARSAZ",
  "AGE MANORA",
  "GE FLEET",
  "AGE MEHRAN",
  "GE TURBAT",
  "GE LOGISTIC",
  "GE MARIPUR",
  "GE GAWADAR",
  "GE EASTERN",
  "GE ORMARA",
  "GE ISLAMABAD",
  "GE LAHORE",
];

export default function NewTransferOrderForm() {
  const [form, setForm] = useState({
    employee: "",
    sourceUnit: "CMES ISB/LHR",
    destUnit: "",
    currentDesig: "GE SOUTH",
    targetDesig: "",
    effectiveDate: "mm/dd/yyyy",
    orderNumber: "TRF-2023-XXXX",
  });
  const [isHardAreaActive, setIsHardAreaActive] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <RefreshCw size={16} className="text-[#274c77]" />
        <h2 className="text-base font-bold text-gray-900">
          New Transfer Order
        </h2>
      </div>

      <div className="flex flex-col gap-4 flex-1 justify-between">
        <div className="flex flex-col gap-4">
          {/* Employee Name */}
          <div>
            <label className={labelCls}>Employee Name</label>
            <div className="relative">
              <select className={selectCls}>
                <option value="">Select Employee...</option>
                <option>Ali Mir</option>
                <option>Ikram Akram</option>
                <option>Naveed Gul</option>
                <option>Hamza Younas</option>
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Source + Destination Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Source Unit</label>
              <div className="relative">
                <select
                  className={selectCls}
                  value={form.sourceUnit}
                  onChange={(e) => set("sourceUnit", e.target.value)}
                >
                  <option value="">Select Unit...</option>
                  {cmesUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Destination Unit</label>
              <div className="relative">
                <select
                  className={selectCls}
                  value={form.destUnit}
                  onChange={(e) => set("destUnit", e.target.value)}
                >
                  <option value="">Select Unit...</option>
                  {cmesUnits.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Current + Target Designation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Current Designation</label>
              <div className="relative">
                <select
                  className={selectCls}
                  value={form.currentDesig}
                  onChange={(e) => set("currentDesig", e.target.value)}
                >
                  {geAeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
            <div>
              <label className={labelCls}>Target Designation</label>
              <div className="relative">
                <select
                  className={selectCls}
                  value={form.targetDesig}
                  onChange={(e) => set("targetDesig", e.target.value)}
                >
                  <option value="">Select Designation...</option>
                  {geAeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Effective Date + Order Number + Hard Area Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Effective Date</label>
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Order Number</label>
              <input
                type="text"
                defaultValue="TRF-2023-XXXX"
                className={`${inputCls} bg-white text-gray-900 border-gray-200 cursor-not-allowed`}
                readOnly
              />
            </div>
            <div>
              <label className={labelCls}>Hard Area Transfer</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsHardAreaActive(!isHardAreaActive)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                    isHardAreaActive ? "bg-[#2196F3]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      isHardAreaActive ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {isHardAreaActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full py-3 bg-[#274c77] hover:bg-blue-800 text-white text-sm font-bold rounded-lg transition-colors mt-2">
          Submit Transfer Order
        </button>
      </div>
    </div>
  );
}
