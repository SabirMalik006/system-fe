import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, AlertTriangle, Trash2, Printer } from 'lucide-react';
import ConfirmModal from '../../common/ConfirmModal';

const tabs = ['All', 'Pending', 'Passed', 'Failed', 'Overdue'];

export default function AssignedKitsTable({
  kits, pagination, loading, search, onSearchChange,
  activeTab, onTabChange, onPageChange, onDelete,
}) {
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, kitId: null });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold text-gray-900">Assigned Tool Kits</h2>
          <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            {pagination.total} Records
          </span>
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            placeholder="Search kit or employee..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:border-[#1a3a8f]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 flex-wrap">
        {tabs.map(tab => (
          <button key={tab} onClick={() => onTabChange(tab)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === tab
                ? 'bg-[#1a3a8f] text-white'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[780px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {['Kit ID', 'Employee', 'Department', 'Assigned Date', 'Last Inspected', 'Next Due', 'Condition', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-10 text-gray-400 text-xs">Loading...</td></tr>
            ) : kits.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-10 text-gray-400 text-xs">No tool kits found</td></tr>
            ) : (
              kits.map((kit) => {
                const today = new Date().toISOString().split('T')[0];
                const isOverdue = kit.nextDue && kit.nextDue < today && kit.status !== 'Passed';
                return (
                  <tr key={kit._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-blue-600">{kit.kitId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-gray-900">{kit.employeeName}</div>
                      <div className="text-[10px] text-gray-400">{kit.employeeId}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{kit.department}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{kit.assignedDate || '-'}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{kit.lastInspected || '-'}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isOverdue ? (
                        <span className="flex items-center gap-1 text-red-600 font-bold text-[10px]">
                          <AlertTriangle size={10} />
                          {kit.nextDue}
                        </span>
                      ) : (
                        <span className={`font-semibold text-[10px] ${kit.nextDue && kit.nextDue <= today ? 'text-orange-600' : 'text-green-700'}`}>
                          {kit.nextDue || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        kit.condition === 'Good' ? 'bg-green-100 text-green-700' :
                        kit.condition === 'Fair' ? 'bg-yellow-100 text-yellow-700' :
                        kit.condition === 'Damaged' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {kit.condition}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          kit.status === 'Passed' ? 'bg-green-500' :
                          kit.status === 'Failed' ? 'bg-red-500' : 'bg-yellow-400'
                        }`} />
                        <span className={`font-semibold text-[11px] ${
                          kit.status === 'Passed' ? 'text-green-700' :
                          kit.status === 'Failed' ? 'text-red-600' : 'text-yellow-700'
                        }`}>
                          {kit.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            const w = window.open('', '_blank');
                            if (w) {
                              w.document.write(`<pre>Kit ID: ${kit.kitId}\nEmployee: ${kit.employeeName}\nDepartment: ${kit.department}\nCondition: ${kit.condition}\nStatus: ${kit.status}\nInspector: ${kit.inspector || 'N/A'}\nRemarks: ${kit.remarks || 'N/A'}</pre>`);
                              w.print();
                            }
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-blue-600"
                          title="Print"
                        >
                          <Printer size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm({ isOpen: true, kitId: kit._id })}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-gray-100">
        <span className="text-[10px] text-gray-400">
          Page {pagination.page} of {pagination.pages} ({pagination.total} records)
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
            className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={13} className="text-gray-400" />
          </button>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(n => (
            <button key={n}
              onClick={() => onPageChange(n)}
              className={`w-7 h-7 rounded-lg text-[10px] font-semibold ${
                n === pagination.page ? 'bg-[#1a3a8f] text-white' : 'border border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {n}
            </button>
          ))}
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => onPageChange(pagination.page + 1)}
            className="w-7 h-7 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={13} className="text-gray-400" />
          </button>
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, kitId: null })}
        onConfirm={() => {
          onDelete(deleteConfirm.kitId);
          setDeleteConfirm({ isOpen: false, kitId: null });
        }}
        title="Delete Tool Kit"
        message="Are you sure you want to delete this tool kit? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
