import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight, CheckCircle, Printer, Download, Mail, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { purchaseRequestAPI } from '../../../services/api';
import ConfirmModal from '../../common/ConfirmModal';

const tabs = ['All', 'Pending', 'Approved', 'Rejected'];

const statusStyles = {
  Approved: 'bg-green-100 text-green-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Rejected: 'bg-red-100 text-red-700',
  Draft: 'bg-gray-100 text-gray-600',
  Processing: 'bg-blue-100 text-blue-700',
};

const deptColors = {
  Plumbing: 'text-[#0891B2]',
  Electrical: 'text-[#1E60AF]',
  Painting: 'text-[#072E54]',
  Carpentry: 'text-[#196EE6]',
  Construction: 'text-[#0891B2]',
  Chemicals: 'text-[#7C3AED]',
  PPE: 'text-[#059669]',
};

export default function ProcurementRequestsTable() {
  const [activeTab, setActiveTab] = useState('All');
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [vendorEmail, setVendorEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const limit = 8;

  useEffect(() => {
    fetchRequests();
  }, [page, activeTab, search]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await purchaseRequestAPI.getAll(page, limit, search, activeTab);
      if (res.data.success) {
        setData(res.data.requests);
        setTotalPages(res.data.pagination.pages);
        setTotalRecords(res.data.pagination.total);
      }
    } catch (err) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await purchaseRequestAPI.delete(deleteTarget);
      toast.success('Request deleted');
      setDeleteTarget(null);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleApproveReject = async (id, status, reason) => {
    try {
      await purchaseRequestAPI.update(id, { status, rejectedReason: reason || '' });
      toast.success(`Request ${status}`);
      setSelected(null);
      fetchRequests();
    } catch (err) {
      toast.error(`Failed to ${status}`);
    }
  };

  const handleView = async (id) => {
    try {
      const res = await purchaseRequestAPI.getById(id);
      setSelected(res.data.data);
    } catch (err) {
      toast.error('Failed to load details');
    }
  };

  const handlePrintReceipt = (pr) => {
    const itemsRows = pr.items.map(i => `
      <tr>
        <td style="padding:6px;border:1px solid #ddd;font-size:12px;">${i.sku || "N/A"}</td>
        <td style="padding:6px;border:1px solid #ddd;font-size:12px;">${i.name}</td>
        <td style="padding:6px;border:1px solid #ddd;font-size:12px;text-align:center;">${i.qty}</td>
        <td style="padding:6px;border:1px solid #ddd;font-size:12px;text-align:right;">${i.unitPrice.toFixed(2)}</td>
        <td style="padding:6px;border:1px solid #ddd;font-size:12px;text-align:right;">${(i.qty * i.unitPrice).toFixed(2)}</td>
      </tr>
    `).join("");
    const html = `<!DOCTYPE html><html><head><title>Purchase Request</title><style>
      body { font-family: monospace; padding: 20px; }
      h1 { text-align: center; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0; }
      th { background: #1E4D7B; color: white; padding: 8px; font-size: 12px; text-align: left; }
    </style></head><body>
      <h1>PURCHASE REQUEST</h1>
      <p><strong>ID:</strong> ${pr.requestId} | <strong>Date:</strong> ${new Date(pr.createdAt).toLocaleDateString()} | <strong>Status:</strong> ${pr.status}</p>
      <p><strong>By:</strong> ${pr.requestingUser} | <strong>Unit:</strong> ${pr.requestingUnit} | <strong>Priority:</strong> ${pr.priority}</p>
      <table><thead><tr><th>SKU</th><th>Item</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead><tbody>${itemsRows}</tbody></table>
      <p><strong>Total:</strong> ${pr.total.toFixed(2)} PKR</p>
      <p><strong>Reason:</strong> ${pr.reason || 'N/A'}</p>
      <p style="text-align:center;color:#888;margin-top:30px;">Generated: ${new Date().toLocaleString()}</p>
    </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.print();
  };

  const handleSendPOEmail = async () => {
    if (!vendorEmail.trim()) {
      toast.error('Please enter vendor email address');
      return;
    }
    setSendingEmail(true);
    // Email sending will be implemented after SMTP setup
    setTimeout(() => {
      setSendingEmail(false);
      setShowEmailModal(false);
      setVendorEmail('');
      toast.success('Purchase order email will be sent after email system setup');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      <Toaster position="top-right" />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Table */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-[#1A3A5C]">Procurement Requests</h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-[#2478B5] text-white px-2.5 py-0.5 rounded-full">{totalRecords} Total</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => { setActiveTab(tab); setPage(1); }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700'}`}>
                {tab}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5">
              <Search size={12} className="text-gray-400" />
              <input placeholder="Search ID, unit, user..." className="text-xs outline-none text-gray-600 placeholder-gray-400 w-36" value={search} onChange={handleSearch} />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[800px] lg:min-w-0">
              <thead>
                <tr className="border-b border-gray-100 bg-[#1F68B2]">
                  <th className="text-left py-2 px-2 text-[10px] font-semibold text-white tracking-wider whitespace-nowrap">Request ID</th>
                  <th className="text-left py-2 px-2 text-[10px] font-semibold text-white tracking-wider whitespace-nowrap">User</th>
                  <th className="text-left py-2 px-2 text-[10px] font-semibold text-white tracking-wider whitespace-nowrap">Unit</th>
                  <th className="text-left py-2 px-2 text-[10px] font-semibold text-white tracking-wider whitespace-nowrap">Items</th>
                  <th className="text-left py-2 px-2 text-[10px] font-semibold text-white tracking-wider whitespace-nowrap">Status</th>
                  <th className="text-left py-2 px-2 text-[10px] font-semibold text-white tracking-wider whitespace-nowrap">Priority</th>
                  <th className="text-left py-2 px-2 text-[10px] font-semibold text-white tracking-wider whitespace-nowrap">Amount</th>
                  <th className="text-left py-2 px-2 text-[10px] font-semibold text-white tracking-wider whitespace-nowrap">Date</th>
                  <th className="text-left py-2 px-2 text-[10px] font-semibold text-white tracking-wider whitespace-nowrap">Reason</th>
                  <th className="text-left py-2 px-2 text-[10px] font-semibold text-white tracking-wider whitespace-nowrap">Remarks</th>
                  <th className="text-left py-2 px-2 text-[10px] font-semibold text-white tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={11} className="text-center py-10 text-gray-400">Loading...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={11} className="text-center py-10 text-gray-400">No requests found</td></tr>
                ) : data.map((row) => (
                  <tr key={row._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-2 text-blue-500 font-semibold whitespace-nowrap">{row.requestId}</td>
                    <td className="py-3 px-2 text-gray-700 whitespace-nowrap">{row.requestingUser || 'N/A'}</td>
                    <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{row.requestingUnit}</td>
                    <td className="py-3 px-2 text-gray-700 font-bold whitespace-nowrap">{row.items?.length || 0}</td>
                    <td className="py-3 px-2 whitespace-nowrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusStyles[row.status] || 'bg-gray-100 text-gray-600'}`}>{row.status}</span>
                    </td>
                    <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{row.priority}</td>
                    <td className="py-3 px-2 text-[#196EE6] font-semibold whitespace-nowrap">Rs {row.total?.toFixed(0)}</td>
                    <td className="py-3 px-2 text-gray-400 whitespace-nowrap">{new Date(row.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-2 text-gray-600 max-w-[160px] truncate" title={row.reason}>{row.reason || '—'}</td>
                    <td className="py-3 px-2 text-gray-600 max-w-[160px] truncate" title={row.remarks}>{row.remarks || '—'}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleView(row._id)} className="p-1 hover:bg-gray-100 rounded"><Eye size={12} className="text-black" /></button>
                        <button onClick={() => setDeleteTarget(row._id)} className="p-1 hover:bg-red-100 rounded"><Trash2 size={12} className="text-red-500" /></button>
                        <button onClick={() => handlePrintReceipt(row)} className="p-1 hover:bg-blue-100 rounded"><Printer size={12} className="text-blue-600" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-1.5 mt-3 pt-3 border-t border-gray-100">
            <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50">
              <ChevronLeft size={13} className="text-gray-400" />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)}
                className={`w-7 h-7 rounded text-xs font-semibold ${page === i + 1 ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                {i + 1}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50">
              <ChevronRight size={13} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm h-full">
          {selected ? (
            <>
              <div className="mb-3 bg-[#1E4D7B] rounded-md px-3 py-2">
                <div className="text-white font-black text-base">{selected.requestId}</div>
                <div className="text-xs text-gray-300 mt-0.5">{selected.requestingUnit} · {selected.status}</div>
              </div>
              <div className="flex flex-col gap-2 mb-4 px-4">
                {[
                  ['Requested By', selected.requestingUser, 'text-black'],
                  ['Unit', selected.requestingUnit, 'text-black'],
                  ['Priority', selected.priority, 'text-black'],
                  ['Date', new Date(selected.createdAt).toLocaleDateString(), 'text-black'],
                  ['Total Amount', `Rs ${selected.total?.toFixed(2)}`, 'text-green-700 font-black'],
                ].map(([label, val, valClass], i) => (
                  <div key={i} className="flex items-center justify-between pb-1.5">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className={`text-xs font-semibold ${valClass}`}>{val}</span>
                  </div>
                ))}
                {selected.reason && (
                  <div className="pt-1.5 border-t border-gray-100">
                    <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">Reason</div>
                    <p className="text-xs text-gray-700">{selected.reason}</p>
                  </div>
                )}
                {selected.remarks && (
                  <div className="pt-1.5 border-t border-gray-100">
                    <div className="text-[10px] font-bold text-gray-500 tracking-wider uppercase mb-1">Remarks</div>
                    <p className="text-xs text-gray-700">{selected.remarks}</p>
                  </div>
                )}
              </div>
              <div className="mb-4 px-4">
                <div className="text-[10px] font-bold text-gray-800 tracking-widest uppercase mb-2">Line Items</div>
                <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1.5"><span>Item</span><span>Qty</span></div>
                {selected.items?.map((li, i) => (
                  <div key={i} className="flex items-center justify-between py-1">
                    <span className="text-xs text-gray-700">{li.name}</span>
                    <span className="text-xs font-bold text-blue-700">{li.qty}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2 mt-3 px-4 pb-2">
                {selected.status === 'Pending' && (
                  <>
                    <button onClick={() => handleApproveReject(selected._id, 'Approved')} className="w-full bg-[#1E4D7B] hover:bg-blue-600 text-white text-xs font-medium py-2.5 rounded-xl">Approve</button>
                    <button onClick={() => { const r = prompt('Rejection reason:'); if (r !== null) handleApproveReject(selected._id, 'Rejected', r); }} className="w-full bg-white hover:bg-red-50 text-[#EF4444] text-xs font-bold py-2.5 rounded-xl border border-red-200">Reject</button>
                  </>
                )}
                {selected.status === 'Approved' && (
                  <>
                    <button onClick={() => handlePrintReceipt(selected)} className="flex items-center justify-center gap-2 w-full bg-[#1E4D7B] hover:bg-blue-600 text-white text-xs font-medium py-2.5 rounded-xl">
                      <Printer size={14} /> Print
                    </button>
                    {selected.vendor && (
                      <button onClick={() => { setVendorEmail(''); setShowEmailModal(true); }} className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2.5 rounded-xl">
                        <Mail size={14} /> Send PO Email
                      </button>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400 text-xs">Select a request to view details</div>
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Request"
        message="Delete this request?"
      />

      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowEmailModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-gray-900">Send Purchase Order</h3>
              <button onClick={() => setShowEmailModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Email PO to <strong>{selected?.vendor || 'Vendor'}</strong>
            </p>
            <input
              type="email"
              value={vendorEmail}
              onChange={e => setVendorEmail(e.target.value)}
              placeholder="vendor@example.com"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 mb-4"
            />
            <p className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-4">
              Email sending will be available after SMTP setup.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setShowEmailModal(false)} className="flex-1 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleSendPOEmail} disabled={sendingEmail} className="flex-1 py-2 text-sm font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50">
                {sendingEmail ? 'Processing...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
