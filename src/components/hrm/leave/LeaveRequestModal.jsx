import React, { useState } from 'react';
import { X } from 'lucide-react';
import { leaveAPI } from '../../../services/api';
import toast from 'react-hot-toast';

export default function LeaveRequestModal({ onClose, leaveData, onAction }) {
  const [loading, setLoading] = useState(false);

  const data = leaveData || {};
  const workflow = data.workflow || [
    { level: 'L1: Supervisor', status: 'PENDING', date: null, note: 'Waiting for action...', active: true },
    { level: 'L2: Dept Head', status: 'PENDING', date: null, note: 'Waiting for action...', active: true },
    { level: 'L3: HR Administrator', status: null, date: null, note: null, active: false },
  ];

  const handleApprove = async () => {
    setLoading(true);
    try {
      await leaveAPI.approveLeave(data._id, { level: 'L1: Supervisor' });
      toast.success('Leave approved');
      if (onAction) onAction();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to approve');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await leaveAPI.rejectLeave(data._id, { reason: 'Rejected by manager' });
      toast.success('Leave rejected');
      if (onAction) onAction();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={onClose}>
      <div className="bg-[#e8f2fb] rounded-xl w-full max-w-[320px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="bg-[#1a3a8f] px-4 py-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Leave Request Details</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors"><X size={16} /></button>
        </div>

        <div className="px-4 py-3 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 border-2 border-white shadow-sm">
              <span className="text-xs font-bold text-blue-800">{data.initials || data.employeeName?.charAt(0) || '?'}</span>
            </div>
            <div>
              <div className="text-xs font-black text-gray-900">{data.employeeName || 'N/A'}</div>
              <div className="text-[10px] text-gray-500">{data.empId || data.employeeId || ''}</div>
              <div className="text-[10px] text-gray-500">{data.designation || ''}</div>
            </div>
          </div>

          <div className="border-t border-blue-100" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Leave Type</div>
              <div className="text-xs font-medium text-gray-900">{data.type || 'N/A'}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Days</div>
              <div className="text-xs font-medium text-gray-900">{data.durationDays || 'N/A'}</div>
            </div>
          </div>

          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Duration</div>
            <div className="text-xs font-medium text-gray-900">{data.durationRange || `${data.startDate || ''} – ${data.endDate || ''}`}</div>
          </div>

          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Reason</div>
            <div className="text-[10px] text-gray-700 italic leading-relaxed">"{data.reason || 'No reason provided'}"</div>
          </div>

          <div className="border-t border-blue-100" />

          <div>
            <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Approval Workflow</div>
            <div className="flex flex-col gap-2">
              {workflow.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm ${step.status === 'APPROVED' ? 'bg-green-500' : step.status === 'REJECTED' ? 'bg-red-500' : step.active ? 'bg-blue-400' : 'bg-gray-300'}`} />
                    {i < workflow.length - 1 && <span className="w-0.5 h-5 bg-gray-200 mt-0.5" />}
                  </div>
                  <div className="flex-1 min-w-0 -mt-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold ${step.active ? 'text-gray-800' : 'text-gray-400'}`}>{step.level}</span>
                      {step.status && (
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${step.status === 'APPROVED' ? 'bg-green-100 text-green-700' : step.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                          {step.status}
                        </span>
                      )}
                    </div>
                    {step.date && <div className="text-[9px] text-gray-400 mt-0.5">{step.date}</div>}
                    {step.note && <div className={`text-[9px] mt-0.5 ${step.note.startsWith('"') ? 'text-gray-500 italic' : 'text-gray-400'}`}>{step.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-3 flex items-center justify-end gap-2 border-t border-blue-100">
          <button onClick={handleReject} disabled={loading}
            className="px-4 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-sm transition-colors border border-red-200 disabled:opacity-50">
            {loading ? 'Processing...' : 'Decline'}
          </button>
          <button onClick={handleApprove} disabled={loading}
            className="px-4 py-1.5 text-xs font-bold bg-[#1A8FA0] hover:bg-blue-900 text-white rounded-sm transition-colors shadow-sm disabled:opacity-50">
            {loading ? 'Processing...' : 'Approve Leave'}
          </button>
        </div>
      </div>
    </div>
  );
}
