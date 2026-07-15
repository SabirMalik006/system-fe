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
  const [linkedUser, setLinkedUser] = useState(null);
  const [userDeactivated, setUserDeactivated] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [tasks, setTasks] = useState([]);
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
      if (data.success) {
        setEmployee(data.data);
        const lu = data.data.linkedUser || null;
        setLinkedUser(lu);
        setUserDeactivated(lu ? !lu.isActive : false);
      } else {
        toast.error('Employee not found');
        setError('Employee not found. The ID may be invalid.');
      }
    }).catch(() => {
      toast.error('Failed to load employee profile');
      setError('Failed to load employee data. Please try again.');
    })
    .finally(() => setLoading(false));
  }, [empId, user]);

  const refetchEmployee = () => {
    if (!empId) return;
    employeeAPI.getById(empId).then(({ data }) => {
      if (data.success) {
        setEmployee(data.data);
        const lu = data.data.linkedUser || null;
        setLinkedUser(lu);
        if (lu) setUserDeactivated(!lu.isActive);
      }
    });
  };

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
          setUserDeactivated(true);
          refetchEmployee();
        } catch (err) {
          toast.error(err.response?.data?.error || 'Failed to deactivate account');
        }
      },
    });
  };

  const handleActivate = () => {
    if (!employee) return;
    const name = `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'this employee';
    setConfirm({
      isOpen: true,
      variant: 'success',
      title: 'Activate Account',
      message: `Activate user account for ${name}? This will restore their login access.`,
      onConfirm: async () => {
        try {
          await employeeAPI.activateAccount(employee._id);
          toast.success('User account activated successfully');
          setConfirm(prev => ({ ...prev, isOpen: false }));
          setUserDeactivated(false);
          refetchEmployee();
        } catch (err) {
          toast.error(err.response?.data?.error || 'Failed to activate account');
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

  const isDwece = user?.role === 'dwece';

  return (
    <div className="min-h-screen bg-[#dce9f7] font-sans">
      <ProfileActionBar
        onEdit={() => navigate(`/personnel-profile?edit=${employee._id}`)}
        onDeactivate={isDwece && !userDeactivated ? handleDeactivate : undefined}
        onActivate={isDwece && userDeactivated ? handleActivate : undefined}
        onDelete={isDwece ? handleDelete : undefined}
        onViewReport={handleViewReport}
        onAssignTask={() => setActiveSection(activeSection === 'assignTask' ? null : 'assignTask')}
        onTaskSummary={() => setActiveSection(activeSection === 'taskSummary' ? null : 'taskSummary')}
        onSendMessage={() => setActiveSection(activeSection === 'sendMessage' ? null : 'sendMessage')}
      />
      <ProfileMetaBar employee={employee} />

      {activeSection && (
        <div className="max-w-[2560px] mx-auto px-4 sm:px-5 pt-4">
          {activeSection === 'assignTask' && (() => {
            const highCount = tasks.filter(t => t.priority === 'High').length;
            const medCount = tasks.filter(t => t.priority === 'Medium').length;
            const lowCount = tasks.filter(t => t.priority === 'Low').length;
            return (
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
                    <p className="text-xl font-extrabold text-gray-900 mt-1">{highCount}</p>
                    <p className="text-[10px] text-gray-500">pending</p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                    <p className="text-[10px] font-bold text-yellow-600 uppercase">Medium</p>
                    <p className="text-xl font-extrabold text-gray-900 mt-1">{medCount}</p>
                    <p className="text-[10px] text-gray-500">pending</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-[10px] font-bold text-green-600 uppercase">Low</p>
                    <p className="text-xl font-extrabold text-gray-900 mt-1">{lowCount}</p>
                    <p className="text-[10px] text-gray-500">pending</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Total</p>
                    <p className="text-xl font-extrabold text-gray-900 mt-1">{tasks.length}</p>
                    <p className="text-[10px] text-gray-500">tasks</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {tasks.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No tasks assigned yet</p>
                  ) : tasks.map((t, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={t.done || false}
                          onChange={() => {
                            const updated = [...tasks];
                            updated[i] = { ...updated[i], done: !updated[i].done };
                            setTasks(updated);
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600" />
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
                <button onClick={() => {
                  if (tasks.some(t => t.task.startsWith('New task for'))) {
                    toast.error('Please edit the pending task first');
                    return;
                  }
                  const name = `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'Employee';
                  setTasks(prev => [...prev, {
                    task: `New task for ${name}`,
                    due: 'Not set',
                    priority: 'Low',
                    done: false,
                  }]);
                }} className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline">
                  <Plus size={12} /> Add Task
                </button>
              </div>
            </div>
            );
          })()}

          {activeSection === 'taskSummary' && (() => {
            const completed = tasks.filter(t => t.done).length;
            const inProgress = tasks.filter(t => !t.done).length;
            const overdue = 0;
            return (
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
                    { icon: CheckCircle, label: 'Completed', value: completed, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
                    { icon: Clock, label: 'In Progress', value: inProgress, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
                    { icon: AlertCircle, label: 'Overdue', value: overdue, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
                    { icon: Target, label: 'Total', value: tasks.length, color: 'text-gray-900', bg: 'bg-gray-50', border: 'border-gray-200' },
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className={`${stat.bg} rounded-xl p-4 border ${stat.border}`}>
                        <Icon size={16} className={stat.color} />
                        <p className="text-lg font-extrabold text-gray-900 mt-2">{stat.value}</p>
                        <p className="text-[10px] text-gray-500">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>
                {tasks.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-4">No tasks yet</p>
                ) : (
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
                      {tasks.map((t, i) => (
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
                              t.done ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>{t.done ? 'Completed' : 'In Progress'}</span>
                          </td>
                          <td className="py-2.5 text-xs text-gray-500">{t.due}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            </div>
            );
          })()}

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
                    value={messageSubject} onChange={e => setMessageSubject(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Message</label>
                  <textarea rows={4} placeholder="Type your message..."
                    value={messageBody} onChange={e => setMessageBody(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 resize-none mt-1" />
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button onClick={() => {
                    if (!messageSubject.trim() || !messageBody.trim()) {
                      toast.error('Please fill in both subject and message');
                      return;
                    }
                    toast.success(`Message sent to ${employee.firstName} ${employee.lastName}`);
                    setMessageSubject('');
                    setMessageBody('');
                    setActiveSection(null);
                  }} className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Send size={12} /> Send
                  </button>
                  <button onClick={() => {
                    if (!messageSubject.trim() && !messageBody.trim()) {
                      toast.error('Nothing to save as draft');
                      return;
                    }
                    const drafts = JSON.parse(localStorage.getItem('messageDrafts') || '[]');
                    drafts.push({
                      to: `${employee.firstName} ${employee.lastName}`,
                      employeeId: employee._id,
                      subject: messageSubject,
                      message: messageBody,
                      savedAt: new Date().toISOString(),
                    });
                    localStorage.setItem('messageDrafts', JSON.stringify(drafts));
                    toast.success('Message saved as draft');
                    setMessageSubject('');
                    setMessageBody('');
                    setActiveSection(null);
                  }} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
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
