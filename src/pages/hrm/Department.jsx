import React from "react";
import { useNavigate } from "react-router-dom";
import DepartmentKPICards from "../../components/hrm/department/DepartmentKPICards";
import DepartmentCharts from "../../components/hrm/department/DepartmentCharts";
import DepartmentBarChart from "../../components/hrm/department/DepartmentBarChart";
import DepartmentTable from "../../components/hrm/department/DepartmentTable";

export default function Department() {
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate("/personnel-profile");
  };

  return (
    <div className="min-h-screen bg-[#e8f2fb] font-sans">
      <div className="w-full max-w-[2560px] mx-auto px-4 sm:px-5 py-4 flex flex-col gap-4">
        <div className="flex justify-end gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export CSV
          </button>
          <button
            onClick={handleAddEmployee}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e6fbe] text-white rounded-lg text-sm font-medium hover:bg-[#175fa5] transition-colors cursor-pointer"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Employee
          </button>
        </div>
        <DepartmentKPICards />
        <DepartmentCharts />
        <DepartmentBarChart />
        <DepartmentTable />
      </div>
    </div>
  );
}
