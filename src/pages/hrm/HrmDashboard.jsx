import React from "react";
// Removed: import HrmDashboardHeader from '../../components/hrm/dashboard/HrmDashboardHeader';
import HrmKPICards from "../../components/hrm/dashboard/HrmKPICards";
import SystemAlerts from "../../components/hrm/dashboard/SystemAlerts";
import WorkforceShortageLiveStatus from "../../components/hrm/dashboard/WorkforceShortageLiveStatus";
import DutyStatus from "../../components/hrm/dashboard/DutyStatus";
import MesPersonnel from "../../components/hrm/dashboard/MesPersonnel";
import WorkforceMetrics from "../../components/hrm/dashboard/WorkforceMetrics";
// AnalyticsSection is removed as per design
import SkillProficiency from "../../components/hrm/dashboard/SkillProficiency";
import LeaveVsApproval from "../../components/hrm/dashboard/LeaveVsApproval";
import Footer from "../../components/common/fotter";

export default function HrmDashboard() {
  return (
    <div className="min-h-screen bg-[#e8f2fb] font-sans">
      <div className="w-full max-w-[2560px] mx-auto px-4 sm:px-5 py-6 flex flex-col gap-5">
        {/* ── KPI Cards — Row 1 ── */}
        <HrmKPICards />

        {/* ── Main Top Grid — Row 2 ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* LEFT COLUMN (2/3 width) */}
          <div className="xl:col-span-2 flex flex-col gap-5">
            {/* System Alerts spanning full left column width */}
            <SystemAlerts />

            {/* Nested Grid for Left Column Bottom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <WorkforceShortageLiveStatus />
              <DutyStatus />
            </div>
          </div>

          {/* RIGHT COLUMN (1/3 width) */}
          <div className="xl:col-span-1">
            {/* MES Personnel takes the column */}
            <MesPersonnel />
          </div>
        </div>

        {/* ── Metrics Grid — Row 3 ── */}
        <WorkforceMetrics />

        {/* ── Bottom Charts — Row 4 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SkillProficiency />
          <LeaveVsApproval />
        </div>
      </div>
      <Footer />
    </div>
  );
}
