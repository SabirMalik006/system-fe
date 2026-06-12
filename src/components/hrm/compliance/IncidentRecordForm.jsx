import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronDown, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { incidentAPI } from '../../../services/api';

const inputCls = 'w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors';
const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

const incidentTypes = ['Tardiness', 'Misconduct', 'Performance', 'Insubordination', 'Other'];
const severityLevels = ['Verbal Warning', 'Written Warning', 'Final Warning', 'Suspension'];

const emptyForm = {
  employeeName: '',
  employeeRole: '',
  date: '',
  incidentType: 'Tardiness',
  severity: 'Verbal Warning',
  description: '',
  reportingAuthority: '',
  status: 'Open',
};

export default function IncidentRecordForm({ editId, onSuccess, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const isEdit = Boolean(editId);

  useEffect(() => {
    if (!editId) {
      setForm(emptyForm);
      return;
    }
    setFetching(true);
    incidentAPI.getById(editId)
      .then(res => {
        const d = res.data.data;
        setForm({
          employeeName: d.employeeName || '',
          employeeRole: d.employeeRole || '',
          date: d.date || '',
          incidentType: d.incidentType || 'Tardiness',
          severity: d.severity || 'Verbal Warning',
          description: d.description || '',
          reportingAuthority: d.reportingAuthority || '',
          status: d.status || 'Open',
        });
      })
      .catch(() => toast.error('Failed to load incident'))
      .finally(() => setFetching(false));
  }, [editId]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeName || !form.date) {
      toast.error('Employee name and date are required');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await incidentAPI.update(editId, form);
        toast.success('Incident updated successfully');
      } else {
        await incidentAPI.create(form);
        toast.success('Incident recorded successfully');
        setForm(emptyForm);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save incident');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (isEdit && onCancel) {
      onCancel();
    } else {
      setForm(emptyForm);
    }
  };

  const selectCls = `${inputCls} appearance-none pr-8 cursor-pointer`;

  if (fetching) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm h-full flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start gap-2">
          <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center mt-0.5 flex-shrink-0">
            <Shield size={12} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {isEdit ? 'Edit Incident Record' : 'Incident Record Form'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">Fill in all mandatory details below</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-4 flex flex-col gap-4 overflow-y-auto">
        <div>
          <label className={labelCls}>
            Employee Name <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={form.employeeName}
              onChange={e => set('employeeName', e.target.value)}
              placeholder="Search employee..."
              className={`${inputCls} pl-8`}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Employee Role</label>
          <input
            value={form.employeeRole}
            onChange={e => set('employeeRole', e.target.value)}
            placeholder="e.g. Electrician, Plumber..."
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>
            Incident Date <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              className={`${inputCls} pl-8`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Incident Type</label>
            <div className="relative">
              <select
                value={form.incidentType}
                onChange={e => set('incidentType', e.target.value)}
                className={selectCls}
              >
                {incidentTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Severity Level</label>
            <div className="relative">
              <select
                value={form.severity}
                onChange={e => set('severity', e.target.value)}
                className={selectCls}
              >
                {severityLevels.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div>
          <label className={labelCls}>
            Detailed Description <span className="text-red-400">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={4}
            placeholder="Describe the incident in detail, including witnesses and evidence..."
            className={`${inputCls} resize-none`}
          />
        </div>

        <div>
          <label className={labelCls}>Reporting Authority</label>
          <div className="relative">
            <Shield size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={form.reportingAuthority}
              onChange={e => set('reportingAuthority', e.target.value)}
              placeholder="e.g. Atif Saeed (Supervisor)"
              className={`${inputCls} pl-8`}
            />
          </div>
        </div>

        {isEdit && (
          <div>
            <label className={labelCls}>Status</label>
            <div className="relative">
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className={selectCls}
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Escalated">Escalated</option>
              </select>
              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      <div className="px-5 py-4 border-t border-gray-100 flex items-center gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-bold py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Incident Record' : 'Submit Incident Record'}
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-semibold rounded-lg transition-colors"
        >
          {isEdit ? 'Cancel' : 'Clear'}
        </button>
      </div>
    </form>
  );
}
