import React, { useState, useEffect } from "react";
import LeaveHeader from "../../components/hrm/leave/LeaveHeader";
import LeaveKPICards from "../../components/hrm/leave/LeaveKPICards";
import LeaveApprovalQueue from "../../components/hrm/leave/LeaveApprovalQueue";
import LeaveCharts from "../../components/hrm/leave/LeaveCharts";
import OrganizationLeaveBalance from "../../components/hrm/leave/OrganizationLeaveBalance";
import { leaveAPI } from "../../services/api";

export default function LeaveManagement() {
  const [kpiData, setKpiData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [balancesData, setBalancesData] = useState([]);
  const [approvalQueue, setApprovalQueue] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [kpiRes, chartRes, balanceRes, queueRes] = await Promise.allSettled([
          leaveAPI.getKPIStats(),
          leaveAPI.getChartData(),
          leaveAPI.getLeaveBalances(),
          leaveAPI.getApprovalQueue(),
        ]);
        if (kpiRes.status === 'fulfilled') setKpiData(kpiRes.value.data.data);
        if (chartRes.status === 'fulfilled') setChartData(chartRes.value.data.data);
        if (balanceRes.status === 'fulfilled') setBalancesData(balanceRes.value.data.data || []);
        if (queueRes.status === 'fulfilled') setApprovalQueue(queueRes.value.data.data || []);
      } catch (err) {
        console.error('Error fetching leave data:', err);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-[#dce9f7] font-sans">
      <div className="w-full max-w-[2560px] mx-auto px-3 sm:px-4 md:px-5 py-4 sm:py-5 flex flex-col gap-3 sm:gap-4">
        <LeaveHeader />
        <LeaveKPICards data={kpiData} />
        <LeaveApprovalQueue data={approvalQueue} onRefresh={() => {
          leaveAPI.getApprovalQueue().then(r => setApprovalQueue(r.data.data || []));
        }} />
        <LeaveCharts data={chartData} />
        <OrganizationLeaveBalance data={balancesData} />
      </div>
    </div>
  );
}
