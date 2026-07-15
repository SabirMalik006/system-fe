import React, { useState, useCallback, useRef } from "react";
import ComplianceHeader from "../../components/hrm/compliance/ComplianceHeader";
import ComplianceFilters from "../../components/hrm/compliance/ComplianceFilters";
import RecentIncidentsTable from "../../components/hrm/compliance/RecentIncidentsTable";
import IncidentStatCards from "../../components/hrm/compliance/IncidentStatCards";
import IncidentCharts from "../../components/hrm/compliance/IncidentCharts";
import IncidentRecordForm from "../../components/hrm/compliance/IncidentRecordForm";

export default function Compliance() {
  const formRef = useRef(null);
  const [filterValues, setFilterValues] = useState({
    search: '',
    incidentType: '',
    severity: '',
    status: '',
  });
  const [editId, setEditId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFilterChange = useCallback((filters) => {
    setFilterValues(filters);
  }, []);

  const handleEditIncident = useCallback((id) => {
    setEditId(id);
  }, []);

  const handleFormSuccess = useCallback(() => {
    setEditId(null);
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-[#EEF4FB] font-sans">
      <div className="max-w-[2560px] mx-auto px-5 py-5 flex flex-col gap-4">
        <ComplianceHeader onNewIncident={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
        <ComplianceFilters onChange={handleFilterChange} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 flex flex-col gap-4">
            <RecentIncidentsTable
              filters={filterValues}
              onEdit={handleEditIncident}
              refreshKey={refreshKey}
            />
            <IncidentStatCards refreshKey={refreshKey} />
            <IncidentCharts refreshKey={refreshKey} />
          </div>
          <div className="xl:col-span-1" ref={formRef}>
            <IncidentRecordForm
              editId={editId}
              onSuccess={handleFormSuccess}
              onCancel={() => setEditId(null)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
