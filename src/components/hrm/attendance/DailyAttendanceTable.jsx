import React, { useState, useEffect } from "react";
import { Download, Plus, Search, ChevronRight, X, Edit2, Trash2, Loader2 } from "lucide-react";
import { attendanceAPI } from "../../../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../../common/ConfirmModal";

const statusStyle = {
  Present:   "bg-blue-600 text-white",
  Late:      "bg-yellow-500 text-white",
  "On Leave":"bg-teal-500 text-white",
  Absent:    "bg-red-500 text-white",
  Holiday:   "bg-gray-500 text-white",
};

const typeStyle = {
  "Full-time":"bg-[#1a3a8f] text-white",
  Contract:   "bg-gray-600 text-white",
};

const HEADERS = ["Employee","ID","Designation","Department","Unit","Shift","Clock In","Clock Out","Work Hrs","Status","Type","Joined","Actions"];

export default function DailyAttendanceTable({ onDataChange }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [shiftFilter, setShiftFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formData, setFormData] = useState({
    employeeName: '', employeeId: '', designation: '', department: '', unit: '',
    shift: 'Morning', clockIn: '', clockOut: '', workHours: '',
    date: new Date().toISOString().split('T')[0], status: 'Present', type: 'Full-time',
    email: '', joinedDate: '', initials: '',
  });

  const limit = 10;

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await attendanceAPI.getAll({
        page, limit, search: search || undefined,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        shift: shiftFilter !== 'All' ? shiftFilter : undefined,
        date: dateFilter || undefined,
      });
      setRecords(res.data.data || []);
      setTotalPages(res.data.pagination?.pages || 1);
      setTotal(res.data.pagination?.total || 0);
    } catch (err) {
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, shiftFilter, dateFilter]);
  useEffect(() => { fetchRecords(); }, [page, debouncedSearch, statusFilter, shiftFilter, dateFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await attendanceAPI.update(editing, formData);
        toast.success('Record updated');
      } else {
        await attendanceAPI.create(formData);
        toast.success('Record created');
      }
      setShowForm(false);
      setEditing(null);
      setFormData({ employeeName: '', employeeId: '', designation: '', department: '', unit: '', shift: 'Morning', clockIn: '', clockOut: '', workHours: '', date: new Date().toISOString().split('T')[0], status: 'Present', type: 'Full-time', email: '', joinedDate: '', initials: '' });
      fetchRecords();
      if (onDataChange) onDataChange();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    }
  };

  const handleEdit = (row) => {
    setFormData({
      employeeName: row.employeeName || '',
      employeeId: row.employeeId || '',
      designation: row.designation || '',
      department: row.department || '',
      unit: row.unit || '',
      shift: row.shift || 'Morning',
      clockIn: row.clockIn || '',
      clockOut: row.clockOut || '',
      workHours: row.workHours || '',
      date: row.date || new Date().toISOString().split('T')[0],
      status: row.status || 'Present',
      type: row.type || 'Full-time',
      email: row.email || '',
      joinedDate: row.joinedDate || '',
      initials: row.initials || '',
    });
    setEditing(row._id);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await attendanceAPI.delete(deleteTarget);
      toast.success('Record deleted');
      setDeleteTarget(null);
      fetchRecords();
      if (onDataChange) onDataChange();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleExport = async () => {
    try {
      const res = await attendanceAPI.exportAttendance();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Exported');
    } catch (err) {
      toast.error('Export failed');
    }
  };

  const filters = [
    { label: "All Shifts", key: "shift", value: shiftFilter, set: setShiftFilter, options: ["All", "Morning", "General", "Night"] },
    { label: "All Status", key: "status", value: statusFilter, set: setStatusFilter, options: ["All", "Present", "Late", "Absent", "On Leave", "Holiday" ] },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 px-5 pt-5 pb-4">
        <div>
          <h2 className="text-[15px] font-extrabold text-gray-900">Daily Attendance Records</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">{total} records · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-1.5 border border-gray-200 text-gray-700 text-[11px] font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50">
            <Download size={12} /> Export CSV
          </button>
          <button onClick={() => { setEditing(null); setFormData({ employeeName: '', employeeId: '', designation: '', department: '', unit: '', shift: 'Morning', clockIn: '', clockOut: '', workHours: '', date: new Date().toISOString().split('T')[0], status: 'Present', type: 'Full-time', email: '', joinedDate: '', initials: '' }); setShowForm(true); }} className="flex items-center gap-1.5 bg-blue-600 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-700">
            <Plus size={12} /> Add Record
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 pb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map((f, i) => (
            f.options ? (
              <select key={i} value={f.value} onChange={e => { f.set(e.target.value); setPage(1); }}
                className="bg-[#1a3a8f] text-white text-[11px] font-medium px-3 py-1.5 rounded-lg appearance-none cursor-pointer outline-none">
                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <button key={i} className="flex items-center gap-1 bg-[#1a3a8f] text-white text-[11px] font-medium px-3 py-1.5 rounded-lg">
                {f.label} <ChevronRight size={11} className="rotate-90" />
              </button>
            )
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
            className="text-[11px] border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400" />
          {dateFilter && (
            <button onClick={() => setDateFilter('')} className="text-[10px] text-blue-600 hover:underline whitespace-nowrap">Clear</button>
          )}
          <div className="relative">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name or ID..."
              className="pl-8 pr-3 py-1.5 text-[11px] border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 w-52" />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="bg-[#1a3a8f]">
              {HEADERS.map(h => (
                <th key={h} className="text-left text-[10px] font-bold text-blue-100 uppercase tracking-wide px-4 py-3 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={HEADERS.length} className="text-center py-10">
                  <Loader2 size={20} className="animate-spin mx-auto text-blue-600" />
                </td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={HEADERS.length} className="text-center py-10 text-[11px] text-gray-400">No records found</td>
              </tr>
            ) : records.map((row, i) => (
              <tr key={row._id || i} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-blue-700">{row.initials || row.employeeName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'}</span>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-gray-900 leading-tight">{row.employeeName}</p>
                      <p className="text-[9px] text-gray-400">{row.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[11px] text-blue-600 font-medium whitespace-nowrap">{row.employeeId || row.attendanceId}</td>
                <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap">{row.designation}</td>
                <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap">{row.department}</td>
                <td className="px-4 py-3">
                  <p className="text-[11px] text-gray-700 whitespace-nowrap">{row.unit}</p>
                  <p className="text-[9px] text-gray-400">{row.shift}</p>
                </td>
                <td className="px-4 py-3 text-[11px] text-gray-500 whitespace-nowrap">{row.shift}</td>
                <td className="px-4 py-3 text-[11px] font-semibold text-blue-600 whitespace-nowrap">{row.clockIn || '–'}</td>
                <td className="px-4 py-3 text-[11px] font-semibold text-blue-600 whitespace-nowrap">{row.clockOut || '–'}</td>
                <td className="px-4 py-3 text-[11px] text-gray-700 whitespace-nowrap">{row.workHours || '–'}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap ${statusStyle[row.status] || "bg-gray-100 text-gray-600"}`}>
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap ${typeStyle[row.type] || "bg-gray-100 text-gray-600"}`}>
                    {row.type}
                  </span>
                </td>
                <td className="px-4 py-3 text-[11px] text-gray-500 whitespace-nowrap">{row.joinedDate || '–'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleEdit(row)} className="p-1 hover:bg-blue-50 rounded transition-colors" title="Edit">
                      <Edit2 size={12} className="text-blue-600" />
                    </button>
                    <button onClick={() => setDeleteTarget(row._id)} className="p-1 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 size={12} className="text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 gap-2 bg-[#1a3a8f]">
        <p className="text-[11px] text-blue-200">Showing {records.length} of {total} employees</p>
        <div className="flex items-center gap-1">
          <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3 py-1 text-[11px] text-blue-200 hover:text-white border border-white/20 rounded-lg disabled:opacity-50">Previous</button>
          {[...Array(Math.min(totalPages, 5))].map((_, i) => {
            const n = i + 1;
            return (
              <button key={n} onClick={() => setPage(n)}
                className={`w-7 h-7 text-[11px] font-bold rounded-lg ${n === page ? "bg-white text-blue-800" : "text-blue-200 hover:text-white border border-white/20"}`}>
                {n}
              </button>
            );
          })}
          <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1 text-[11px] text-blue-200 hover:text-white border border-white/20 rounded-lg disabled:opacity-50">Next</button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1a3a8f] px-5 py-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">{editing ? 'Edit' : 'Add'} Attendance Record</h2>
              <button onClick={() => setShowForm(false)} className="text-white/70 hover:text-white"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 max-h-[70vh] overflow-y-auto space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Employee Name</label>
                  <input required value={formData.employeeName} onChange={e => setFormData({...formData, employeeName: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Employee ID</label>
                  <input value={formData.employeeId} onChange={e => setFormData({...formData, employeeId: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Designation</label>
                  <input value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Department</label>
                  <input value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Unit</label>
                  <input value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Shift</label>
                  <select value={formData.shift} onChange={e => setFormData({...formData, shift: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                    <option>Morning</option>
                    <option>General</option>
                    <option>Night</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Clock In</label>
                  <input type="time" value={formData.clockIn} onChange={e => setFormData({...formData, clockIn: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Clock Out</label>
                  <input type="time" value={formData.clockOut} onChange={e => setFormData({...formData, clockOut: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Work Hours</label>
                  <input value={formData.workHours} onChange={e => setFormData({...formData, workHours: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Date</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                    <option>Present</option>
                    <option>Late</option>
                    <option>Absent</option>
                    <option>On Leave</option>
                    <option>Holiday</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400">
                    <option>Full-time</option>
                    <option>Contract</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Record"
        message="Delete this attendance record? This action cannot be undone."
      />
    </div>
  );
}
