import React, { useState } from 'react';
import LeaveRequestModal from './LeaveRequestModal';

export default function LeaveApprovalQueue({ data = [], onRefresh }) {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewClick = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Leave Approval Queue</h2>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">View All</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100">
                {['EMPLOYEE', 'TYPE', 'DURATION', 'LEVEL', 'STATUS'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold text-gray-400 tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? data.map((row, i) => (
                <tr key={row._id || i} className={`${i < data.length - 1 ? 'border-b border-gray-50' : ''} hover:bg-gray-50 transition-colors`}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: row.avatarBg || '#64748b' }}>
                        {row.initials || row.employeeName?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900 leading-tight">{row.name || row.employeeName}</div>
                        <div className="text-[11px] text-gray-400">{row.empId || row.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{row.type}</td>
                  <td className="px-5 py-4">
                    <div className="text-sm text-gray-800 font-medium leading-tight">{row.durationRange}</div>
                    <div className="text-[11px] text-gray-400">{row.durationDays}</div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{row.level}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${row.statusStyle || (row.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : row.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}`}>
                        {row.status}
                      </span>
                      <button onClick={() => handleViewClick(row)} className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors pl-6">View</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-[11px] text-gray-400">No pending leave requests</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedRequest && (
        <LeaveRequestModal onClose={handleCloseModal} leaveData={selectedRequest} onAction={onRefresh} />
      )}
    </>
  );
}
