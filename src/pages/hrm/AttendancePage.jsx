import React from "react";
import AttendanceHeader from "../../components/hrm/attendance/AttendanceHeader";
import KPIStrip from "../../components/hrm/attendance/KPIStrip";
import MonthlyTrendChart from "../../components/hrm/attendance/MonthlyTrendChart";
import TodaysStatus from "../../components/hrm/attendance/TodaysStatus";
import ShiftOverview from "../../components/hrm/attendance/ShiftOverview";
import ClockInDistribution from "../../components/hrm/attendance/ClockInDistribution";
import AttendanceHeatmap from "../../components/hrm/attendance/AttendanceHeatmap";
import RecentActivity from "../../components/hrm/attendance/RecentActivity";
import PendingApprovals from "../../components/hrm/attendance/PendingApprovals";
import DeptAttendanceRate from "../../components/hrm/attendance/DeptAttendanceRate";
import WorkingHoursAnalysis from "../../components/hrm/attendance/WorkingHoursAnalysis";
import DailyAttendanceTable from "../../components/hrm/attendance/DailyAttendanceTable";
import BottomInfoStrip from "../../components/hrm/attendance/BottomInfoStrip";
import Footer from "../../components/common/fotter";

export default function AttendancePage() {
  return (
    <div className="min-h-screen bg-gray-50 \">
      <div className="max-w-[2560px] mx-auto space-y-5 p-5">
        <AttendanceHeader />
        <KPIStrip />

        {/* Row 1: Monthly Trend | Today's Status | Shift Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <MonthlyTrendChart />
          </div>
          <div className="lg:col-span-3">
            <TodaysStatus />
          </div>
          <div className="lg:col-span-3">
            <ShiftOverview />
          </div>
        </div>

        {/* Row 2: Clock-In | Heatmap | Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <ClockInDistribution />
          </div>
          <div className="lg:col-span-4">
            <AttendanceHeatmap />
          </div>
          <div className="lg:col-span-4">
            <RecentActivity />
          </div>
        </div>

        {/* Row 3: Pending Approvals | Dept Rate | Working Hours */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            <PendingApprovals />
          </div>
          <div className="lg:col-span-5">
            <DeptAttendanceRate />
          </div>
          <div className="lg:col-span-4">
            <WorkingHoursAnalysis />
          </div>
        </div>

        <DailyAttendanceTable />
        <BottomInfoStrip />
      </div>
      <Footer />
    </div>
  );
}
