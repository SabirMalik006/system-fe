import React, { useState, useEffect } from "react";
import HrmKPICards from "../../components/hrm/dashboard/HrmKPICards";
import SystemAlerts from "../../components/hrm/dashboard/SystemAlerts";
import WorkforceShortageLiveStatus from "../../components/hrm/dashboard/WorkforceShortageLiveStatus";
import DutyStatus from "../../components/hrm/dashboard/DutyStatus";
import MesPersonnel from "../../components/hrm/dashboard/MesPersonnel";
import WorkforceMetrics from "../../components/hrm/dashboard/WorkforceMetrics";
import SkillProficiency from "../../components/hrm/dashboard/SkillProficiency";
import LeaveVsApproval from "../../components/hrm/dashboard/LeaveVsApproval";
import Footer from "../../components/common/fotter";
import { hrmDashboardAPI } from "../../services/api";

export default function HrmDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await hrmDashboardAPI.getStats();
        setData(res.data.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#e8f2fb] font-sans">
      <div className="w-full max-w-[2560px] mx-auto px-4 sm:px-5 py-6 flex flex-col gap-5">
        <HrmKPICards data={data?.kpis} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 flex flex-col gap-5">
            <SystemAlerts data={data?.systemAlerts} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <WorkforceShortageLiveStatus data={{
                shortages: data?.shortages,
                attendanceUpdates: data?.attendanceUpdates,
                fieldPerformance: data?.fieldPerformance,
              }} />
              <DutyStatus data={data?.dutyStatus} />
            </div>
          </div>
          <div className="xl:col-span-1">
            <MesPersonnel data={data?.mesPersonnel} />
          </div>
        </div>

        <WorkforceMetrics data={data?.workforceMetrics} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SkillProficiency data={data?.skillProficiency} />
          <LeaveVsApproval data={data?.leaveVsApproval} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
