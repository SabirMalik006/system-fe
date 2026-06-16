import React, { useState, useEffect } from 'react';
import { Lock, Link, AlertTriangle, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';
import { employeeAPI, authAPI } from '../../../services/api';
import ConfirmModal from '../../common/ConfirmModal';

export default function UserAccountLinkage({ employee = {} }) {
  const [linkedUser, setLinkedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deactivating, setDeactivating] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const name = `${employee.firstName || ''} ${employee.lastName || ''}`.trim() || 'User';
  const email = employee.email || '—';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  useEffect(() => {
    if (!employee.employeeId) return;
    let mounted = true;
    setLoading(true);
    authAPI.getUsers()
      .then(res => {
        if (!mounted) return;
        const users = res.data.users || [];
        const found = users.find(u => u.employeeId === employee.employeeId);
        setLinkedUser(found || null);
      })
      .catch(() => { /* not admin, silently ignore */ })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [employee.employeeId]);

  const handleDeactivate = async () => {
    if (!linkedUser) {
      toast.error('No linked user account found to deactivate');
      return;
    }
    setDeactivating(true);
    try {
      await authAPI.updateUser(linkedUser._id, { isActive: false });
      toast.success('User account deactivated');
      setLinkedUser({ ...linkedUser, isActive: false });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate');
    } finally {
      setDeactivating(false);
      setShowConfirm(false);
    }
  };

  const handleLinkAccount = async () => {
    if (!employee.email) {
      toast.error('Employee has no email — cannot link account');
      return;
    }
    toast.success('Account linking dialog would open');
  };

  const permissions = [
    { label: 'View Personnel Records', granted: true },
    { label: 'Attendance Logging', granted: true },
    { label: 'Edit Employee Records', granted: false },
    { label: 'System Administration', granted: false },
  ];

  const isActive = linkedUser?.isActive !== false;

  return (
    <div className="bg-white rounded-2xl border-3 border-[#2478B5] shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Lock size={15} className="text-blue-500" />
          <h2 className="text-sm font-bold text-gray-800">User Account Linkage</h2>
        </div>
        <button
          onClick={handleLinkAccount}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <UserCog size={12} />
          Manage
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5 p-3.5 bg-[#F0F7FF] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">{initials}</div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{linkedUser?.name || name}</div>
                  <div className="text-xs text-gray-400">{linkedUser?.email || email}</div>
                  {linkedUser && (
                    <div className="text-[10px] text-gray-400">
                      {linkedUser.lastLogin
                        ? `Last Login: ${new Date(linkedUser.lastLogin).toLocaleString()}`
                        : linkedUser.isActive === false ? 'Deactivated' : 'No login history'}
                    </div>
                  )}
                </div>
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-3.5 py-1.5 rounded-lg ${
                linkedUser
                  ? isActive ? 'bg-[#6DB8E8] text-blue-700' : 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-500'
              }`}>
                <Link size={11} />
                {linkedUser ? (isActive ? 'Linked' : 'Deactivated') : 'No Account'}
              </span>
            </div>

            <div className="mb-5">
              <div className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2.5">Access Permissions</div>
              {permissions.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">{p.label}</span>
                  <span className={`text-xs font-bold ${p.granted ? 'text-green-600' : 'text-red-500'}`}>
                    {p.granted ? '✓' : '✗'} {p.granted ? 'Granted' : 'Denied'}
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

            <button
              onClick={() => setShowConfirm(true)}
              disabled={deactivating || !linkedUser || !isActive}
              className="w-full py-2.5 border-2 border-[#640404] text-[#640404] text-xs font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Lock size={13} />
              {deactivating ? 'Deactivating...' : isActive ? 'Deactivate Account' : 'Account Already Deactivated'}
            </button>
          </>
        )}
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDeactivate}
        title="Deactivate Account"
        message={`Deactivate user account "${linkedUser?.name}" (${linkedUser?.email})? This will prevent them from logging in.`}
        confirmText={deactivating ? 'Deactivating...' : 'Deactivate'}
        loading={deactivating}
        variant="warning"
      />
    </div>
  );
}
