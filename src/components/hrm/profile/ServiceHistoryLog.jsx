import React, { useState } from 'react';
import { History, Download, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { employeeAPI } from '../../../services/api';

export default function ServiceHistoryLog({ employee = {} }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ company: '', designation: '', fromDate: '', toDate: '' });
  const [saving, setSaving] = useState(false);

  const history = (employee.serviceHistory || []).length > 0
    ? employee.serviceHistory.map((entry, i) => ({
        designation: entry.designation || 'N/A',
        dept: entry.company || 'N/A',
        unit: 'N/A',
        start: entry.fromDate || 'N/A',
        end: entry.toDate || 'Present',
        remark: 'Recorded',
        remarkStyle: 'bg-[#2563EB] text-white',
      }))
    : [
        { designation: 'Current Position', dept: 'Current Department', unit: employee.unit || 'N/A', start: employee.joiningDate || 'N/A', end: 'Present', remark: 'Current', remarkStyle: 'bg-[#2563EB] text-white' },
      ];

  const handleAddEntry = async () => {
    if (!formData.designation.trim() || !formData.company.trim()) {
      toast.error('Please fill in designation and company');
      return;
    }
    setSaving(true);
    try {
      const updatedHistory = [...(employee.serviceHistory || []), formData];
      const res = await employeeAPI.update(employee._id, { serviceHistory: updatedHistory });
      if (res.data.success) {
        toast.success('Entry added successfully');
        setShowForm(false);
        setFormData({ company: '', designation: '', fromDate: '', toDate: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add entry');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <History size={14} className="text-blue-500" />
          <h2 className="text-sm font-bold text-gray-800">Service History Log</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#1565C0] font-semibold bg-[#E3F2FD] px-4 py-2 rounded-xl">{history.length} Records</span>
          <button
            onClick={async () => {
              try {
                const res = await employeeAPI.exportEmployees();
                const url = URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.download = `employee-${employee.employeeId || employee._id || 'report'}-service-history.csv`;
                link.click();
                URL.revokeObjectURL(url);
                toast.success('Export complete');
              } catch (err) {
                toast.error('Export failed');
              }
            }}
            className="flex items-center gap-1 text-xs font-semibold border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download size={12} />
            Export CSV
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1 text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={12} />
            Add Entry
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[540px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['DESIGNATION', 'UNIT', 'START DATE', 'END DATE', 'REMARKS'].map(h => (
                <th key={h}
                  className="text-left px-4 py-2.5 text-[9px] font-bold text-[#FFFFFFA6] tracking-wider"
                  style={{ background: 'linear-gradient(135deg, #1A6FC4, #0C355E)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-xs font-bold text-gray-900">{row.designation}</div>
                  <div className="text-[10px] text-gray-400">{row.dept}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600">
                    <span className="w-4 h-4 rounded bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">C</span>
                    {row.unit}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{row.start}</td>
                <td className="px-4 py-3">
                  {row.end === 'Present'
                    ? <span className="text-[10px] font-bold bg-[#00C8E0] text-white px-3 py-0.5 rounded-full">{row.end}</span>
                    : <span className="text-xs text-gray-600 whitespace-nowrap">{row.end}</span>
                  }
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${row.remarkStyle}`}>{row.remark}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 border-t border-gray-100">
        <p className="text-[13px] text-[#7A8BA5]">Records are immutable. Corrections must be added as new entries with remarks.</p>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">Add Service Entry</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Designation</label>
                <input type="text" value={formData.designation} onChange={e => setFormData(f => ({ ...f, designation: e.target.value }))}
                  placeholder="e.g. Senior Electrician"
                  className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Company / Unit</label>
                <input type="text" value={formData.company} onChange={e => setFormData(f => ({ ...f, company: e.target.value }))}
                  placeholder="e.g. CMES COMCOAST"
                  className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">From Date</label>
                  <input type="date" value={formData.fromDate} onChange={e => setFormData(f => ({ ...f, fromDate: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">To Date</label>
                  <input type="date" value={formData.toDate} onChange={e => setFormData(f => ({ ...f, toDate: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button onClick={handleAddEntry} disabled={saving}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {saving ? 'Adding...' : 'Add Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
