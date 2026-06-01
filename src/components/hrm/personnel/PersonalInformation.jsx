import React, { useState } from "react";
import { User, ClipboardList } from "lucide-react";

const inputCls =
  "w-full border border-gray-200 rounded-sm px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors bg-white";
const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5";

export default function PersonalInformation() {
  const [gender, setGender] = useState("");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* Section title */}
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-gray-100">
        <div className="w-5 h-5  rounded flex items-center justify-center">
          <ClipboardList className="text-blue-800" />
        </div>
        <h2 className="text-base font-semibold text-gray-900">
          Personal Information
        </h2>
      </div>

      {/* Row 1: First Name, Last Name, DOB */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 ">
        <div>
          <label className={labelCls}>
            First Name <span className="text-red-400">*</span>
          </label>
          <input placeholder="e.g. Salar" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>
            Last Name <span className="text-red-400">*</span>
          </label>
          <input placeholder="e.g. Khan" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Date of Birth</label>
          <input type="text" placeholder="mm/dd/yyyy" className={inputCls} />
        </div>
      </div>

      {/* Row 2: Gender, CNIC, Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className={labelCls}>Gender</label>
          <div className="relative">
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className={`${inputCls} appearance-none pr-8 cursor-pointer`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 4l4 4 4-4"
                stroke="#9ca3af"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div>
          <label className={labelCls}>
            CNIC / ID Number <span className="text-red-400">*</span>
          </label>
          <input placeholder="00000-0000000-0" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Phone Number</label>
          <input placeholder="+92 1904578484" className={inputCls} />
        </div>
      </div>

      {/* Row 3: Email, Emergency Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Email Address</label>
          <input
            type="email"
            placeholder="salarkhan@company.com"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>
            Emergency Contact (Name &amp; Relationship)
          </label>
          <input
            placeholder="Zubair Khan (Brother) - +92 3457109357"
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}
