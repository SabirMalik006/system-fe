import React from 'react';
import { Lock, Link, AlertTriangle } from 'lucide-react';

const permissions = [
  { label: 'View Personnel Records',  status: 'Granted', granted: true },
  { label: 'Attendance Logging',      status: 'Granted', granted: true },
  { label: 'Edit Employee Records',   status: 'Denied',  granted: false },
  { label: 'System Administration',   status: 'Denied',  granted: false },
];

export default function UserAccountLinkage({ employee = {} }) {
  const name = `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'User';
  const email = employee.email || 'user@org.gov.pk';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="bg-white rounded-2xl border-3 border-[#2478B5] shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Lock size={15} className="text-blue-500" />
          <h2 className="text-sm font-bold text-gray-800">User Account Linkage</h2>
        </div>
        <button className="text-xs font-semibold text-gray-600 hover:text-blue-700 transition-colors">Manage</button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-5 p-3.5 bg-[#F0F7FF] rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">{initials}</div>
            <div>
              <div className="text-sm font-bold text-gray-900">{name}</div>
              <div className="text-xs text-gray-400">{email}</div>
              <div className="text-[10px] text-gray-400">Last Login: Today, 04:15 AM</div>
            </div>
          </div>
          <span className="flex items-center gap-1 text-xs font-bold bg-[#6DB8E8] text-blue-700 px-3.5 py-1.5 rounded-lg">
            <Link size={11} />
            Linked
          </span>
        </div>

        <div className="mb-5">
          <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2.5">Access Permissions</div>
          {permissions.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-600">{p.label}</span>
              <span className={`text-xs font-bold ${p.granted ? 'text-green-600' : 'text-red-500'}`}>
                {p.granted ? '✓' : '✗'} {p.status}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-[#6DB8E8] border border-blue-100 rounded-xl p-3.5 mb-5">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={13} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-bold text-blue-700 mb-1">Auto-Deactivation Policy</div>
              <div className="text-xs text-[#445069] leading-relaxed">
                If this employee's status changes to Terminated or Retired, the linked user account will be automatically deactivated.
              </div>
            </div>
          </div>
        </div>

        <button className="w-full py-2.5 border-2 border-[#640404] text-[#640404] text-xs font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
          <Lock size={13} />
          Deactivate Account
        </button>
      </div>
    </div>
  );
}
