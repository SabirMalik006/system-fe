import React, { useState } from "react";
import { Upload, Calendar, Plus, X } from "lucide-react";
import { attendanceAPI } from "../../../services/api";
import toast from "react-hot-toast";

const today = new Date();
const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function AttendanceHeader({ kpiData }) {
  const [showMarkModal, setShowMarkModal] = useState(false);
  const [markData, setMarkData] = useState({
    employeeName: '', employeeId: '', shift: 'Morning', clockIn: '', clockOut: '',
    date: new Date().toISOString().split('T')[0], status: 'Present', workHours: '',
  });
  const [marking, setMarking] = useState(false);

  const handleExport = async () => {
    try {
      const res = await attendanceAPI.exportAttendance();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Attendance exported');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setMarking(true);
    try {
      await attendanceAPI.create(markData);
      toast.success('Attendance marked');
      setShowMarkModal(false);
      setMarkData({ employeeName: '', employeeId: '', shift: 'Morning', clockIn: '', clockOut: '', date: new Date().toISOString().split('T')[0], status: 'Present', workHours: '' });
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to mark attendance');
    } finally {
      setMarking(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">Attendance Management</h1>
          <p className="text-[11px] text-blue-500 mt-0.5">
            HRMS / Attendance & Shifts / Daily Attendance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
            <Upload size={13} />
            Export
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
            <Calendar size={13} />
            {dateStr}
          </button>
          <button onClick={() => setShowMarkModal(true)} className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700 transition">
            <Plus size={13} />
            Mark
          </button>
        </div>
      </div>

      {showMarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowMarkModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a3a8f] px-5 py-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Mark Attendance</h2>
              <button onClick={() => setShowMarkModal(false)} className="text-white/70 hover:text-white"><X size={16} /></button>
            </div>
            <form onSubmit={handleMarkAttendance} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Employee Name</label>
                  <input required value={markData.employeeName} onChange={e => setMarkData({...markData, employeeName: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Employee ID</label>
                  <input value={markData.employeeId} onChange={e => setMarkData({...markData, employeeId: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">Status</label>
                <select value={markData.status} onChange={e => setMarkData({...markData, status: e.target.value})}
                  className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                  <option>Present</option>
                  <option>Late</option>
                  <option>Absent</option>
                  <option>On Leave</option>
                  <option>Holiday</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Shift</label>
                  <select value={markData.shift} onChange={e => setMarkData({...markData, shift: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                    <option>Morning</option>
                    <option>General</option>
                    <option>Night</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Date</label>
                  <input type="date" required value={markData.date} onChange={e => setMarkData({...markData, date: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Clock In</label>
                  <input type="time" value={markData.clockIn} onChange={e => setMarkData({...markData, clockIn: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Clock Out</label>
                  <input type="time" value={markData.clockOut} onChange={e => setMarkData({...markData, clockOut: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowMarkModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={marking}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {marking ? 'Marking...' : 'Mark Attendance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
