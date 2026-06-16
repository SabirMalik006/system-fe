import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { transferAPI } from '../../services/api';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function TransferDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transfer, setTransfer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    transferAPI.getById(id)
      .then(res => { if (mounted) setTransfer(res.data.data); })
      .catch(() => { toast.error('Failed to load transfer'); navigate('/inter-unit-transfer'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await transferAPI.delete(id);
      toast.success('Transfer deleted');
      navigate('/inter-unit-transfer');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete');
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!transfer) return null;

  const labelCls = 'text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1';
  const valueCls = 'text-sm font-semibold text-gray-900';

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans">
      <div className="max-w-[1280px] mx-auto px-4 py-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/inter-unit-transfer')}
              className="p-2 hover:bg-white/80 rounded-lg transition-colors"
            >
              <ArrowLeft size={18} className="text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
                Transfer {transfer.transferId}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {transfer.employeeName} &middot; {transfer.status}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/inter-unit-transfer/${id}/edit`)}
              className="flex items-center gap-1.5 bg-[#274c77] hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              <Edit2 size={14} /> Edit
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              disabled={deleting}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} /> {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <RefreshCw size={16} className="text-[#274c77]" />
            <h2 className="text-base font-bold text-gray-900">Transfer Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <div className={labelCls}>Transfer ID</div>
              <div className={valueCls}>{transfer.transferId || '—'}</div>
            </div>
            <div>
              <div className={labelCls}>Employee Name</div>
              <div className={valueCls}>{transfer.employeeName || '—'}</div>
            </div>
            <div>
              <div className={labelCls}>Employee ID</div>
              <div className={valueCls}>{transfer.employeeId || '—'}</div>
            </div>
            <div>
              <div className={labelCls}>Source Unit</div>
              <div className={valueCls}>{transfer.sourceUnit || '—'}</div>
            </div>
            <div>
              <div className={labelCls}>Destination Unit</div>
              <div className={valueCls}>{transfer.destinationUnit || '—'}</div>
            </div>
            <div>
              <div className={labelCls}>Current Designation</div>
              <div className={valueCls}>{transfer.currentDesignation || '—'}</div>
            </div>
            <div>
              <div className={labelCls}>Target Designation</div>
              <div className={valueCls}>{transfer.targetDesignation || '—'}</div>
            </div>
            <div>
              <div className={labelCls}>Effective Date</div>
              <div className={valueCls}>{transfer.effectiveDate || '—'}</div>
            </div>
            <div>
              <div className={labelCls}>Hard Area Transfer</div>
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${
                transfer.hardAreaTransfer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {transfer.hardAreaTransfer ? 'On' : 'Off'}
              </span>
            </div>
            <div>
              <div className={labelCls}>Status</div>
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full ${
                transfer.status === 'Executed' || transfer.status === 'Success' ? 'bg-[#e2f5e9] text-[#1f874c]' :
                transfer.status === 'In Approval' ? 'bg-[#f0f4f8] text-[#47607a]' :
                transfer.status === 'Pending' ? 'bg-[#fff3cd] text-[#c46c24]' : 'bg-gray-100 text-gray-600'
              }`}>
                {transfer.status}
              </span>
            </div>
            <div>
              <div className={labelCls}>Created</div>
              <div className={valueCls}>{new Date(transfer.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className={labelCls}>Last Updated</div>
              <div className={valueCls}>{new Date(transfer.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Transfer"
        message="Delete this transfer order permanently? This action cannot be undone."
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        loading={deleting}
      />
    </div>
  );
}
