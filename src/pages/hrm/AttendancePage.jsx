import React, { useState, useEffect } from "react";
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
import { attendanceAPI } from "../../services/api";

export default function AttendancePage() {
  const [kpiData, setKpiData] = useState(null);
  const [trendData, setTrendData] = useState([]);
  const [todayStatus, setTodayStatus] = useState(null);
  const [shiftData, setShiftData] = useState(null);
  const [clockInData, setClockInData] = useState([]);
  const [heatmapData, setHeatmapData] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [approvalsData, setApprovalsData] = useState([]);
  const [deptRateData, setDeptRateData] = useState([]);
  const [workingHoursData, setWorkingHoursData] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleDataChange = () => setRefreshKey(k => k + 1);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [
          kpiRes, trendRes, todayRes, shiftRes,
          clockRes, heatRes, activityRes, approvalsRes,
          deptRes, workingRes,
        ] = await Promise.allSettled([
          attendanceAPI.getKPIStats(),
          attendanceAPI.getMonthlyTrend(),
          attendanceAPI.getTodayStatus(),
          attendanceAPI.getShiftOverview(),
          attendanceAPI.getClockInDistribution(),
          attendanceAPI.getHeatmap(),
          attendanceAPI.getRecentActivity(),
          attendanceAPI.getPendingApprovals(),
          attendanceAPI.getDeptAttendanceRate(),
          attendanceAPI.getWorkingHoursAnalysis(),
        ]);

        if (kpiRes.status === 'fulfilled') setKpiData(kpiRes.value.data.data);
        if (trendRes.status === 'fulfilled') setTrendData(trendRes.value.data.data || []);
        if (todayRes.status === 'fulfilled') setTodayStatus(todayRes.value.data.data);
        if (shiftRes.status === 'fulfilled') setShiftData(shiftRes.value.data.data);
        if (clockRes.status === 'fulfilled') setClockInData(clockRes.value.data.data || []);
        if (heatRes.status === 'fulfilled') setHeatmapData(heatRes.value.data.data);
        if (activityRes.status === 'fulfilled') setActivityData(activityRes.value.data.data || []);
        if (approvalsRes.status === 'fulfilled') {
          const data = approvalsRes.value.data.data || [];
          setApprovalsData(data);
          setPendingCount(data.length);
        }
        if (deptRes.status === 'fulfilled') setDeptRateData(deptRes.value.data.data || []);
        if (workingRes.status === 'fulfilled') setWorkingHoursData(workingRes.value.data.data || []);
      } catch (err) {
        console.error('Error fetching attendance data:', err);
      }
    };
    fetchAll();
  }, [refreshKey]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[2560px] mx-auto space-y-5 p-5">
        <AttendanceHeader kpiData={kpiData} onDataChange={handleDataChange} />
        <KPIStrip data={kpiData} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <MonthlyTrendChart data={trendData} />
          </div>
          <div className="lg:col-span-3">
            <TodaysStatus data={todayStatus} />
          </div>
          <div className="lg:col-span-3">
            <ShiftOverview data={shiftData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4">
            <ClockInDistribution data={clockInData} />
          </div>
          <div className="lg:col-span-4">
            <AttendanceHeatmap data={heatmapData} />
          </div>
          <div className="lg:col-span-4">
            <RecentActivity data={activityData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            <PendingApprovals data={approvalsData} />
          </div>
          <div className="lg:col-span-5">
            <DeptAttendanceRate data={deptRateData} />
          </div>
          <div className="lg:col-span-4">
            <WorkingHoursAnalysis data={workingHoursData} />
          </div>
        </div>

        <DailyAttendanceTable onDataChange={handleDataChange} refreshKey={refreshKey} />
        <BottomInfoStrip pendingCount={pendingCount} />
      </div>
      <Footer />
    </div>
  );
}
