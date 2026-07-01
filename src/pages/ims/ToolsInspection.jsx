import React, { useState, useEffect, useCallback } from 'react';
import InspectionHeader from '../../components/ims/toolsinspection/InspectionHeader';
import InspectionKPICards from '../../components/ims/toolsinspection/InspectionKPICards';
import AssignedKitsTable from '../../components/ims/toolsinspection/AssignedKitsTable';
import InspectionForm from '../../components/ims/toolsinspection/InspectionForm';
import InspectionBottomStats from '../../components/ims/toolsinspection/InspectionBottomStats';
import { toolKitAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ToolsInspection() {
  const [kpiData, setKpiData] = useState(null);
  const [kits, setKits] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [deptStats, setDeptStats] = useState([]);
  const [conditionSummary, setConditionSummary] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const fetchAll = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const status = activeTab === 'All' ? '' : activeTab === 'Overdue' ? '' : activeTab;
      const [kpiRes, kitsRes, deptRes, condRes, recentRes] = await Promise.all([
        toolKitAPI.getKPIStats(),
        toolKitAPI.getAll({ page, limit: 10, search, status }),
        toolKitAPI.getByDepartment(),
        toolKitAPI.getConditionSummary(),
        toolKitAPI.getRecentActivity(),
      ]);
      if (kpiRes.data.success) setKpiData(kpiRes.data.data);
      if (kitsRes.data.success) {
        setKits(kitsRes.data.data);
        setPagination(kitsRes.data.pagination);
      }
      if (deptRes.data.success) setDeptStats(deptRes.data.data);
      if (condRes.data.success) setConditionSummary(condRes.data.data);
      if (recentRes.data.success) setRecentActivity(recentRes.data.data);
    } catch (err) {
      console.error('Failed to fetch inspection data:', err);
    } finally {
      setLoading(false);
    }
  }, [search, activeTab]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id) => {
    try {
      await toolKitAPI.delete(id);
      toast.success('Tool kit deleted');
      fetchAll(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete tool kit');
    }
  };

  const handleExport = async () => {
    try {
      const res = await toolKitAPI.exportToolKits();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `toolkits_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8f2fb] font-sans">
      <div className="w-full max-w-[2500px] mx-auto px-3 sm:px-4 md:px-5 py-4 sm:py-5 flex flex-col gap-4 sm:gap-5">
        <InspectionHeader onExport={handleExport} onKitCreated={() => fetchAll(1)} />
        <InspectionKPICards data={kpiData} loading={loading} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <div className="md:col-span-2">
            <AssignedKitsTable
              kits={kits}
              pagination={pagination}
              loading={loading}
              search={search}
              onSearchChange={setSearch}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onPageChange={(p) => fetchAll(p)}
              onDelete={handleDelete}
            />
          </div>
          <div className="space-y-4">
            <InspectionForm onInspectionSubmitted={() => fetchAll(1)} />
          </div>
        </div>
        <InspectionBottomStats
          deptStats={deptStats}
          conditionSummary={conditionSummary}
          recentActivity={recentActivity}
          loading={loading}
        />
      </div>
    </div>
  );
}
