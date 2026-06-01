import React from "react";
import LeaveHeader from "../../components/hrm/leave/LeaveHeader";
import LeaveKPICards from "../../components/hrm/leave/LeaveKPICards";
import LeaveApprovalQueue from "../../components/hrm/leave/LeaveApprovalQueue";
import LeaveCharts from "../../components/hrm/leave/LeaveCharts";
import OrganizationLeaveBalance from "../../components/hrm/leave/OrganizationLeaveBalance";

export default function LeaveManagement() {
  return (
    <div className="min-h-screen bg-[#dce9f7] font-sans">
      <div className="w-full max-w-[2560px] mx-auto px-3 sm:px-4 md:px-5 py-4 sm:py-5 flex flex-col gap-3 sm:gap-4">
        <LeaveHeader />
        <LeaveKPICards />
        <LeaveApprovalQueue />
        <LeaveCharts />
        <OrganizationLeaveBalance />
      </div>
    </div>
  );
}
