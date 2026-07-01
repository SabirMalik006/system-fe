import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { X, Target, ClipboardList, Mail, CheckCircle, Clock, AlertCircle, Send, MessageSquare, Plus, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import { employeeAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
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
  const { user } = useAuth();
  const empId = searchParams.get('id');
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState({ isOpen: false, variant: 'danger', title: '', message: '', onConfirm: null });
  const [activeSection, setActiveSection] = useState(null);
  const selfEmployee = useMemo(() => {
    if (empId || !user) return null;
    const names = (user.name || '').split(' ');
    return {
      _id: user.id,
      firstName: names[0] || '',
      lastName: names.slice(1).join(' ') || '',
      employeeId: user.employeeId || user.id,
      email: user.email,
      phone: user.phone || '',
      designation: user.designation || user.role || '',
      department: user.department || '',
      unit: '',
      employmentStatus: 'Active',
      employmentType: 'Permanent',
      joiningDate: user.joinDate ? new Date(user.joinDate).toLocaleDateString('en-GB') : '',
      dateOfBirth: '',
      gender: '',
      cnic: '',
      emergencyContact: '',
      trade: '',
      geAe: '',
      rating: 4,
      profilePhoto: user.profileImage || '',
      skills: [],
      serviceHistory: [],
    };
  }, [empId, user]);

  useEffect(() => {
    if (!empId) {
      if (user) {
        setEmployee(selfEmployee);
        setLoading(false);
      } else {
        setError('Please log in to view your profile.');
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    setError(null);
    employeeAPI.getById(empId).then(({ data }) => {
      if (data.success) setEmployee(data.data);
      else {
        toast.error('Employee not found');
        setError('Employee not found. The ID may be invalid.');
      }
    }).catch(() => {
      toast.error('Failed to load employee profile');
      setError('Failed to load employee data. Please try again.');
    })
    .finally(() => setLoading(false));
  }, [empId, user]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-[#dce9f7] font-sans flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md">
          <div className="text-4xl mb-4 text-gray-300">!</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Employee Profile</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/department" className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
            Back to Department
          </Link>
        </div>
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
        onAssignTask={() => setActiveSection(activeSection === 'assignTask' ? null : 'assignTask')}
        onTaskSummary={() => setActiveSection(activeSection === 'taskSummary' ? null : 'taskSummary')}
        onSendMessage={() => setActiveSection(activeSection === 'sendMessage' ? null : 'sendMessage')}
      />
      <ProfileMetaBar employee={employee} />

      {activeSection && (
        <div className="max-w-[2560px] mx-auto px-4 sm:px-5 pt-4">
          {activeSection === 'assignTask' && (
            <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
              <div className="bg-[#1a3a8f] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target size={15} className="text-blue-200" />
                  <h2 className="text-sm font-bold text-white">Assign Task</h2>
                </div>
                <button onClick={() => setActiveSection(null)} className="text-white/70 hover:text-white"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-[10px] font-bold text-red-600 uppercase">High</p>
                    <p className="text-xl font-extrabold text-gray-900 mt-1">3</p>
                    <p className="text-[10px] text-gray-500">pending</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <p className="text-[10px] font-bold text-yellow-600 uppercase">Medium</p>
                    <p className="text-xl font-extrabold text-gray-900 mt-1">5</p>
                    <p className="text-[10px] text-gray-500">pending</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-[10px] font-bold text-green-600 uppercase">Low</p>
                    <p className="text-xl font-extrabold text-gray-900 mt-1">2</p>
                    <p className="text-[10px] text-gray-500">pending</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Total</p>
                    <p className="text-xl font-extrabold text-gray-900 mt-1">10</p>
                    <p className="text-[10px] text-gray-500">tasks</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { task: 'Inspect plumbing Line B', due: 'Today, 5:00 PM', priority: 'High' },
                    { task: 'Complete maintenance report', due: 'Tomorrow, 12:00 PM', priority: 'Medium' },
                    { task: 'Review safety protocols', due: 'Jul 5, 9:00 AM', priority: 'Low' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                        <div>
                          <p className="text-xs font-medium text-gray-900">{t.task}</p>
                          <p className="text-[10px] text-gray-400">{t.due}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        t.priority === 'High' ? 'bg-red-100 text-red-700' :
                        t.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>{t.priority}</span>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline">
                  <Plus size={12} /> Add Task
                </button>
              </div>
            </div>
          )}

          {activeSection === 'taskSummary' && (
            <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
              <div className="bg-[#1a3a8f] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ClipboardList size={15} className="text-blue-200" />
                  <h2 className="text-sm font-bold text-white">Task Summary</h2>
                </div>
                <button onClick={() => setActiveSection(null)} className="text-white/70 hover:text-white"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: CheckCircle, label: 'Completed', value: '12', color: 'text-green-600', bg: 'bg-green-50' },
                    { icon: Clock, label: 'In Progress', value: '5', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { icon: AlertCircle, label: 'Overdue', value: '2', color: 'text-red-600', bg: 'bg-red-50' },
                    { icon: Target, label: 'Total', value: '19', color: 'text-gray-900', bg: 'bg-gray-50' },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className={`${stat.bg} rounded-xl p-4 border ${
                        i === 0 ? 'border-green-200' : i === 1 ? 'border-blue-200' : i === 2 ? 'border-red-200' : 'border-gray-200'
                      }`}>
                        <Icon size={16} className={stat.color} />
                        <p className="text-lg font-extrabold text-gray-900 mt-2">{stat.value}</p>
                        <p className="text-[10px] text-gray-500">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold text-gray-500 uppercase border-b border-gray-100">
                        <th className="pb-2 pr-4">Task</th>
                        <th className="pb-2 pr-4">Priority</th>
                        <th className="pb-2 pr-4">Status</th>
                        <th className="pb-2">Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { task: 'Inspect plumbing Line B', priority: 'High', status: 'In Progress', due: 'Today' },
                        { task: 'Complete maintenance report', priority: 'Medium', status: 'Pending', due: 'Tomorrow' },
                        { task: 'Review safety protocols', priority: 'Low', status: 'Completed', due: 'Jul 5' },
                      ].map((t, i) => (
                        <tr key={i}>
                          <td className="py-2.5 pr-4 text-xs font-medium text-gray-900">{t.task}</td>
                          <td className="py-2.5 pr-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              t.priority === 'High' ? 'bg-red-100 text-red-700' :
                              t.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>{t.priority}</span>
                          </td>
                          <td className="py-2.5 pr-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              t.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>{t.status}</span>
                          </td>
                          <td className="py-2.5 text-xs text-gray-500">{t.due}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'sendMessage' && (
            <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
              <div className="bg-[#1a3a8f] px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail size={15} className="text-blue-200" />
                  <h2 className="text-sm font-bold text-white">Send Message</h2>
                </div>
                <button onClick={() => setActiveSection(null)} className="text-white/70 hover:text-white"><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">To</label>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <UserCheck size={12} className="text-gray-400" />
                    {employee.firstName} {employee.lastName}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Subject</label>
                  <input type="text" placeholder="Enter subject..."
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Message</label>
                  <textarea rows={4} placeholder="Type your message..."
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 resize-none mt-1" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Send size={12} /> Send
                  </button>
                  <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <MessageSquare size={12} /> Draft
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
