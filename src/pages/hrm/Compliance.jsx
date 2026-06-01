import React from "react";
import ComplianceHeader from "../../components/hrm/compliance/ComplianceHeader";
import ComplianceFilters from "../../components/hrm/compliance/ComplianceFilters";
import RecentIncidentsTable from "../../components/hrm/compliance/RecentIncidentsTable";
import IncidentStatCards from "../../components/hrm/compliance/IncidentStatCards";
import IncidentCharts from "../../components/hrm/compliance/IncidentCharts";
import IncidentRecordForm from "../../components/hrm/compliance/IncidentRecordForm";

export default function Compliance() {
  return (
    <div className="min-h-screen bg-[#EEF4FB] font-sans">
      <div className="max-w-[2560px] mx-auto px-5 py-5 flex flex-col gap-4">
        <ComplianceHeader />
        <ComplianceFilters />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Left: Table + Stats + Charts */}
          <div className="xl:col-span-2 flex flex-col gap-4">
            <RecentIncidentsTable />
            <IncidentStatCards />
            <IncidentCharts />
          </div>
          {/* Right: Incident Record Form */}
          <div className="xl:col-span-1">
            <IncidentRecordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
