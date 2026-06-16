import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { employeeAPI } from "../../services/api";
import ConfirmModal from "../../components/common/ConfirmModal";
import ProfileActionBar from "../../components/hrm/profile/ProfileActionBar";
import ProfileMetaBar from "../../components/hrm/profile/ProfileMetaBar";
import ProfileHero from "../../components/hrm/profile/ProfileHero";
import ProfileKPICards from "../../components/hrm/profile/ProfileKPICards";
import ProfileCharts from "../../components/hrm/profile/ProfileCharts";
import PersonalInformation from "../../components/hrm/profile/PersonalInformation";
import ProfessionalEmployment from "../../components/hrm/profile/ProfessionalEmployment";
import ServiceHistoryLog from "../../components/hrm/profile/ServiceHistoryLog";
import KPIsSection from "../../components/hrm/profile/KPIsSection";
import SkillsCertifications from "../../components/hrm/profile/SkillsCertifications";
import AccountOverview from "../../components/hrm/profile/AccountOverview";
import UserAccountLinkage from "../../components/hrm/profile/UserAccountLinkage";
import Footer from "../../components/common/fotter";

export default function EmployeeProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const empId = searchParams.get('id');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ isOpen: false, variant: 'danger', title: '', message: '', onConfirm: null });

  useEffect(() => {
    if (!empId) {
      navigate('/department');
      return;
    }
    setLoading(true);
    employeeAPI.getById(empId).then(({ data }) => {
      if (data.success) setEmployee(data.data);
      else navigate('/department');
    }).catch(() => navigate('/department'))
    .finally(() => setLoading(false));
  }, [empId]);

  const handleDeactivate = () => {
    if (!employee) return;
    const name = `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'this employee';
    setConfirm({
      isOpen: true,
      variant: 'warning',
      title: 'Deactivate Account',
      message: `Deactivate user account for ${name}? This will prevent them from logging in.`,
      onConfirm: async () => {
        try {
          await employeeAPI.deactivateAccount(employee._id);
          toast.success('User account deactivated successfully');
          setConfirm(prev => ({ ...prev, isOpen: false }));
        } catch (err) {
          toast.error(err.response?.data?.error || 'Failed to deactivate account');
        }
      },
    });
  };

  const handleDelete = () => {
    if (!employee) return;
    const name = `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'this employee';
    setConfirm({
      isOpen: true,
      variant: 'danger',
      title: 'Delete Employee',
      message: `Permanently delete ${name} and their linked user account? This cannot be undone.`,
      onConfirm: async () => {
        try {
          await employeeAPI.deleteWithAccount(employee._id);
          toast.success('Employee and account deleted');
          navigate('/department');
        } catch (err) {
          toast.error(err.response?.data?.error || 'Failed to delete');
        }
      },
    });
  };

  const handleViewReport = async () => {
    if (!employee) return;
    try {
      const res = await employeeAPI.exportEmployees();
      const url = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `employee-report-${employee.employeeId || employee._id}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast.success('Report downloaded');
    } catch (err) {
      toast.error('Failed to generate report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#dce9f7] font-sans flex items-center justify-center">
        <div className="text-blue-600 font-semibold">Loading...</div>
      </div>
    );
  }

  if (!employee) return null;

  return (
    <div className="min-h-screen bg-[#dce9f7] font-sans">
      <ProfileActionBar
        onEdit={() => navigate(`/personnel-profile?edit=${employee._id}`)}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
        onViewReport={handleViewReport}
      />
      <ProfileMetaBar employee={employee} />
      <div className="max-w-[2560px] mx-auto px-4 sm:px-5 py-4 flex flex-col gap-4">
        <ProfileHero employee={employee} />
        <ProfileKPICards employee={employee} />
        <ProfileCharts employee={employee} />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 flex flex-col gap-4">
            <PersonalInformation employee={employee} />
            <ProfessionalEmployment employee={employee} />
            <ServiceHistoryLog employee={employee} />
            <KPIsSection employee={employee} />
          </div>
          <div className="xl:col-span-1 flex flex-col gap-4">
            <SkillsCertifications employee={employee} />
            <AccountOverview employee={employee} />
            <UserAccountLinkage employee={employee} />
          </div>
        </div>
      </div>
      <Footer />
      <ConfirmModal
        isOpen={confirm.isOpen}
        onClose={() => setConfirm(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirm.onConfirm}
        title={confirm.title}
        message={confirm.message}
        variant={confirm.variant}
      />
    </div>
  );
}
