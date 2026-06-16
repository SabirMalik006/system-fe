import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { transferAPI } from '../../../services/api';

const inputCls = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-blue-400 transition-colors font-semibold';
const selectCls = `${inputCls} appearance-none pr-7 cursor-pointer`;
const labelCls = 'block text-[10px] font-bold text-gray-600 tracking-wider uppercase mb-1.5';

const cmesUnits = [
  'CMES ISB/LHR', 'CMES COMPAK', 'CMES ORMARA',
  'CMES COMLOG', 'CMES COMCOAST', 'CMES COMKAR',
];

const geAeOptions = [
  'GE SOUTH', 'GE EAST', 'GE KARSAZ', 'AGE MANORA',
  'GE FLEET', 'AGE MEHRAN', 'GE TURBAT', 'GE LOGISTIC',
  'GE MARIPUR', 'GE GAWADAR', 'GE EASTERN', 'GE ORMARA',
  'GE ISLAMABAD', 'GE LAHORE',
];

const emptyForm = {
  employeeName: '',
  employeeId: '',
  sourceUnit: '',
  destinationUnit: '',
  currentDesignation: '',
  targetDesignation: '',
  effectiveDate: '',
  hardAreaTransfer: false,
};

export default function NewTransferOrderForm({ editId, onSuccess, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [isHardAreaActive, setIsHardAreaActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const isEdit = Boolean(editId);

  useEffect(() => {
    if (!editId) {
      setForm(emptyForm);
      setIsHardAreaActive(false);
      return;
    }
    setFetching(true);
    transferAPI.getById(editId)
      .then(res => {
        const d = res.data.data;
        setForm({
          employeeName: d.employeeName || '',
          employeeId: d.employeeId || '',
          sourceUnit: d.sourceUnit || '',
          destinationUnit: d.destinationUnit || '',
          currentDesignation: d.currentDesignation || '',
          targetDesignation: d.targetDesignation || '',
          effectiveDate: d.effectiveDate || '',
          hardAreaTransfer: d.hardAreaTransfer || false,
        });
        setIsHardAreaActive(d.hardAreaTransfer || false);
      })
      .catch(() => toast.error('Failed to load transfer'))
      .finally(() => setFetching(false));
  }, [editId]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.employeeName) {
      toast.error('Employee name is required');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form, hardAreaTransfer: isHardAreaActive };
      if (isEdit) {
        await transferAPI.update(editId, payload);
        toast.success('Transfer order updated successfully');
      } else {
        await transferAPI.create(payload);
        toast.success('Transfer order submitted successfully');
        setForm(emptyForm);
        setIsHardAreaActive(false);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save transfer');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    if (isEdit && onCancel) {
      onCancel();
    } else {
      setForm(emptyForm);
      setIsHardAreaActive(false);
    }
  };

  if (fetching) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <RefreshCw size={16} className="text-[#274c77]" />
        <h2 className="text-base font-bold text-gray-900">
          {isEdit ? 'Edit Transfer Order' : 'New Transfer Order'}
        </h2>
      </div>

      <div className="flex flex-col gap-4 flex-1 justify-between">
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelCls}>Employee Name <span className="text-red-400">*</span></label>
            <input
              value={form.employeeName}
              onChange={e => set('employeeName', e.target.value)}
              placeholder="Enter employee name..."
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Employee ID</label>
            <input
              value={form.employeeId}
              onChange={e => set('employeeId', e.target.value)}
              placeholder="e.g. EMP-2024-0001"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Source Unit</label>
              <div className="relative">
                <select
                  className={selectCls}
                  value={form.sourceUnit}
                  onChange={e => set('sourceUnit', e.target.value)}
                >
                  <option value="">Select Unit...</option>
                  {cmesUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Destination Unit</label>
              <div className="relative">
                <select
                  className={selectCls}
                  value={form.destinationUnit}
                  onChange={e => set('destinationUnit', e.target.value)}
                >
                  <option value="">Select Unit...</option>
                  {cmesUnits.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Current Designation</label>
              <div className="relative">
                <select
                  className={selectCls}
                  value={form.currentDesignation}
                  onChange={e => set('currentDesignation', e.target.value)}
                >
                  <option value="">Select Designation...</option>
                  {geAeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Target Designation</label>
              <div className="relative">
                <select
                  className={selectCls}
                  value={form.targetDesignation}
                  onChange={e => set('targetDesignation', e.target.value)}
                >
                  <option value="">Select Designation...</option>
                  {geAeOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Effective Date</label>
              <input
                type="date"
                value={form.effectiveDate}
                onChange={e => set('effectiveDate', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Hard Area Transfer</label>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsHardAreaActive(!isHardAreaActive)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                    isHardAreaActive ? 'bg-[#2196F3]' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      isHardAreaActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">
                  {isHardAreaActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 bg-[#274c77] hover:bg-blue-800 disabled:bg-blue-400 text-white text-sm font-bold rounded-lg transition-colors"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Transfer Order' : 'Submit Transfer Order'}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-5 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-semibold rounded-lg transition-colors"
          >
            {isEdit ? 'Cancel' : 'Clear'}
          </button>
        </div>
      </div>
    </form>
  );
}
