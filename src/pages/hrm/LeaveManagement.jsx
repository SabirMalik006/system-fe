import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import toast from "react-hot-toast";
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
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dateError, setDateError] = useState('');
  const [form, setForm] = useState({
    employeeName: '', employeeId: '', designation: '', department: '',
    type: 'Annual', startDate: '', endDate: '', durationDays: '',
    reason: '', urgency: 'Normal',
  });

  const todayStr = new Date().toISOString().split('T')[0];

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

  useEffect(() => { fetchAll(); }, []);

  const calcDuration = () => {
    if (form.startDate && form.endDate) {
      const s = new Date(form.startDate);
      const e = new Date(form.endDate);
      if (e < s) {
        setDateError('End date cannot be earlier than start date');
        setForm(f => ({ ...f, durationDays: '-' }));
      } else {
        setDateError('');
        const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
        setForm(f => ({ ...f, durationDays: String(diff) }));
      }
    }
  };

  useEffect(() => { calcDuration(); }, [form.startDate, form.endDate]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!form.employeeName.trim()) {
      toast.error('Employee name is required');
      return;
    }
    if (/^\d+$/.test(form.employeeName.trim())) {
      toast.error('Employee name cannot be only numbers');
      return;
    }
    if (!form.employeeId.trim()) {
      toast.error('Employee ID is required');
      return;
    }
    if (!form.startDate || form.startDate < todayStr) {
      toast.error('Start date cannot be in the past');
      return;
    }
    if (!form.endDate || form.endDate < form.startDate) {
      toast.error('End date must be on or after start date');
      return;
    }
    setSubmitting(true);
    try {
      await leaveAPI.create({
        employeeName: form.employeeName,
        employeeId: form.employeeId,
        designation: form.designation,
        department: form.department,
        type: form.type,
        startDate: form.startDate,
        endDate: form.endDate,
        durationDays: form.durationDays,
        reason: form.reason,
        urgency: form.urgency,
        status: 'Pending',
        initials: form.employeeName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      });
      toast.success('Leave applied successfully');
      setShowModal(false);
      setForm({ employeeName: '', employeeId: '', designation: '', department: '', type: 'Annual', startDate: '', endDate: '', durationDays: '', reason: '', urgency: 'Normal' });
      fetchAll();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to apply leave');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dce9f7] font-sans">
      <div className="w-full max-w-[2560px] mx-auto px-3 sm:px-4 md:px-5 py-4 sm:py-5 flex flex-col gap-3 sm:gap-4">
        <div className="flex items-start justify-between">
          <LeaveHeader />
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shrink-0">
            <Plus size={14} /> Apply Leave
          </button>
        </div>
        <LeaveKPICards data={kpiData} />
        <LeaveApprovalQueue data={approvalQueue} onRefresh={() => {
          leaveAPI.getApprovalQueue().then(r => setApprovalQueue(r.data.data || []));
        }} />
        <LeaveCharts data={chartData} />
        <OrganizationLeaveBalance data={balancesData} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a3a8f] px-5 py-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Apply for Leave</h2>
              <button onClick={() => setShowModal(false)} className="text-white/70 hover:text-white"><X size={16} /></button>
            </div>
            <form onSubmit={handleApply} className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Employee Name *</label>
                  <input required value={form.employeeName} onChange={e => setForm({...form, employeeName: e.target.value})}
                    className={`w-full text-xs border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 ${/^\d+$/.test(form.employeeName.trim()) ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                  {/^\d+$/.test(form.employeeName.trim()) && (
                    <p className="text-[10px] text-red-500 mt-0.5">Numeric values are not allowed</p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Employee ID *</label>
                  <input required value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Designation</label>
                  <input value={form.designation} onChange={e => setForm({...form, designation: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Department</label>
                  <input value={form.department} onChange={e => setForm({...form, department: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Leave Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                  <option value="Annual">Annual</option>
                  <option value="Sick">Sick</option>
                  <option value="Casual">Casual</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Start Date *</label>
                  <input type="date" required min={todayStr} value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">End Date *</label>
                  <input type="date" required min={form.startDate || todayStr} value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              {dateError && (
                <p className="text-[11px] text-red-500 font-medium">{dateError}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Duration (Days)</label>
                  <input readOnly value={form.durationDays}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-700" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Urgency</label>
                  <select value={form.urgency} onChange={e => setForm({...form, urgency: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                    <option value="Normal">Normal</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Reason</label>
                <textarea rows={3} value={form.reason} onChange={e => setForm({...form, reason: e.target.value})}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 resize-none" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Leave'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
