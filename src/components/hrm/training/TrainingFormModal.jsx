import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, Users, Clock, BookOpen, User, Award, BarChart } from 'lucide-react';

export default function TrainingFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    instructor: '',
    startDate: '',
    endDate: '',
    duration: '',
    enrolled: '',
    completed: '',
    avgScore: '',
    status: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category || '',
        type: initialData.type || '',
        instructor: initialData.instructor || '',
        startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
        endDate: initialData.endDate ? initialData.endDate.split('T')[0] : '',
        duration: initialData.duration || '',
        enrolled: initialData.enrolled ?? '',
        completed: initialData.completed ?? '',
        avgScore: initialData.avgScore ?? '',
        status: initialData.status || '',
      });
    } else {
      setFormData({
        title: '', description: '', category: '', type: '', instructor: '',
        startDate: '', endDate: '', duration: '', enrolled: '', completed: '',
        avgScore: '', status: '',
      });
    }
  }, [initialData, isOpen]);

  const modalRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
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
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn"
      >
        <div className="px-5 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-black">
                {initialData ? 'Edit Training Program' : 'Add New Training Program'}
              </h2>
              <p className="text-[11px] text-black mt-0.5">Fill in the details below</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
              <X size={16} className="text-black" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange}
              placeholder="e.g., Electrical Safety Training"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-1">Description</label>
            <input
              type="text" name="description" value={formData.description} onChange={handleChange}
              placeholder="Brief description"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
              >
                <option value="">Select</option>
                <option value="Technical Skills">Technical Skills</option>
                <option value="Safety & Compliance">Safety & Compliance</option>
                <option value="HSE (Health, Safety, Env)">HSE (Health, Safety, Env)</option>
                <option value="Leadership Development">Leadership Development</option>
                <option value="Equipment Operation">Equipment Operation</option>
                <option value="First Aid & Emergency">First Aid & Emergency</option>
                <option value="Soft Skills">Soft Skills</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Type</label>
              <select name="type" value={formData.type} onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
              >
                <option value="">Select</option>
                <option value="Workshop">Workshop</option>
                <option value="On-Site">On-Site</option>
                <option value="Classroom">Classroom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-1">Instructor</label>
            <div className="relative">
              <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="instructor" value={formData.instructor} onChange={handleChange}
                placeholder="e.g., Eng. Kindred Mfr"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Start Date</label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">End Date</label>
              <div className="relative">
                <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-1">Duration</label>
            <div className="relative">
              <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" name="duration" value={formData.duration} onChange={handleChange}
                placeholder="e.g., 3 Days"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Enrolled</label>
              <div className="relative">
                <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" name="enrolled" value={formData.enrolled} onChange={handleChange}
                  placeholder="e.g., 50"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Completed</label>
              <div className="relative">
                <Award size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number" name="completed" value={formData.completed} onChange={handleChange}
                  placeholder="e.g., 45"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Avg Score</label>
              <div className="relative">
                <BarChart size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" name="avgScore" value={formData.avgScore} onChange={handleChange}
                  placeholder="e.g., 85.5"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
              >
                <option value="">Select Status</option>
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Postponed">Postponed</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button type="submit"
              className="flex-1 py-2 bg-gradient-to-r from-[#1E4D7B] to-[#1A6FC4] hover:from-[#163A50] hover:to-[#0D4A6E] text-white text-sm font-medium rounded-lg transition-all shadow-md"
            >
              {initialData ? 'Update Program' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
