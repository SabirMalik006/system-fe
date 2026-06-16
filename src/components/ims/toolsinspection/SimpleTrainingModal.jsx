import React, { useState, useRef, useEffect } from 'react';
import { X, User, Calendar, Briefcase, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { toolKitAPI } from '../../../services/api';

export default function SimpleTrainingModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    employee: '',
    department: '',
    assignedDate: '',
    lastInspected: '',
    nextDue: '',
    condition: 'Good',
    status: 'Pending',
  });
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.employee) {
      toast.error('Employee name is required');
      return;
    }
    setSubmitting(true);
    try {
      await toolKitAPI.create({
        employeeName: formData.employee,
        department: formData.department,
        assignedDate: formData.assignedDate,
        lastInspected: formData.lastInspected,
        nextDue: formData.nextDue,
        condition: formData.condition,
        status: formData.status,
      });
      toast.success('Tool kit created successfully');
      setFormData({ employee: '', department: '', assignedDate: '', lastInspected: '', nextDue: '', condition: 'Good', status: 'Pending' });
      if (onSubmit) onSubmit();
      onClose();
    } catch (err) {
      toast.error('Failed to create tool kit');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div ref={modalRef} className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-5 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-black">Add New Tool Kit</h2>
              <p className="text-[11px] text-black mt-0.5">Fill in the details below</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X size={16} className="text-black" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-1">
              Employee <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="employee" value={formData.employee} onChange={handleChange}
                placeholder="e.g., Ahmed Hassan" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]" required />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-1">Department</label>
            <div className="relative">
              <Briefcase size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="department" value={formData.department} onChange={handleChange}
                placeholder="e.g., Electrical" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Assigned Date</label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" name="assignedDate" value={formData.assignedDate} onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Next Due</label>
              <div className="relative">
                <AlertCircle size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" name="nextDue" value={formData.nextDue} onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-1">Condition</label>
            <select name="condition" value={formData.condition} onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white">
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Damaged">Damaged</option>
              <option value="Needs Replacement">Needs Replacement</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-1">Status</label>
            <select name="status" value={formData.status} onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white">
              <option value="Pending">Pending</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2 bg-gradient-to-r from-[#1E4D7B] to-[#1A6FC4] hover:from-[#163A50] hover:to-[#0D4A6E] text-white text-sm font-medium rounded-lg transition-all shadow-md disabled:opacity-50">
              {submitting ? 'Creating...' : 'Create Toolkit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
