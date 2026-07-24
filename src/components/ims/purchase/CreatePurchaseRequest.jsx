import React, { useState, useRef, useCallback, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  Info, List, User, ChevronDown, Plus, Trash2, Save, Send, Upload, CheckCircle, Printer, Download, Mail,
} from "lucide-react";
import { purchaseRequestAPI, vendorsAPI } from "../../../services/api";

const categoryColors = {
  Construction: "bg-blue-100 text-blue-700",
  Chemicals: "bg-purple-100 text-purple-700",
  PPE: "bg-green-100 text-green-700",
  Plumbing: "bg-cyan-100 text-cyan-700",
  Electrical: "bg-yellow-100 text-yellow-700",
  Other: "bg-gray-100 text-gray-600",
};

const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors";
const selectCls = `${inputCls} appearance-none pr-8 cursor-pointer`;
const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5";

export default function CreatePurchaseRequest() {
  const navigate = useNavigate();
  const receiptRef = useRef(null);
  const [items, setItems] = useState([{ id: Date.now().toString(), sku: "", name: "New Item", category: "Construction", qty: 1, unitPrice: 0 }]);
  const [priority, setPriority] = useState("Medium");
  const [remarks, setRemarks] = useState("");
  const [reason, setReason] = useState("");
  const [requestingUser, setRequestingUser] = useState("");
  const [requestType, setRequestType] = useState("Manual Request");
  const [requestingUnit, setRequestingUnit] = useState("Warehouse A - North Sector");
  const [savingDraft, setSavingDraft] = useState(false);
  const [savingSubmit, setSavingSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastPR, setLastPR] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [vendors, setVendors] = useState([]);
  const [vendor, setVendor] = useState("");
  const [vendorsLoading, setVendorsLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [vendorEmail, setVendorEmail] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setVendorsLoading(true);
      const res = await vendorsAPI.getVendors(1, 100);
      if (res.data.success) {
        setVendors(res.data.vendors);
      }
    } catch (err) {
      console.error("Error fetching vendors", err);
    } finally {
      setVendorsLoading(false);
    }
  };

  const resetForm = () => {
    setItems([{ id: Date.now().toString(), sku: "", name: "New Item", category: "Construction", qty: 1, unitPrice: 0 }]);
    setPriority("Medium");
    setRemarks("");
    setReason("");
    setRequestingUser("");
    setRequestType("Manual Request");
    setRequestingUnit("Warehouse A - North Sector");
    setSubmitted(false);
    setLastPR(null);
    setUploadedFiles([]);
    setVendor("");
    toast.success("Form cleared for new request");
  };

  const updateItem = (id, field, value) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const removeItem = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const addItem = () =>
    setItems((prev) => [...prev, { id: Date.now().toString(), sku: "", name: "New Item", category: "Construction", qty: 1, unitPrice: 0 }]);

  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const total = subtotal;

  const handleSubmit = async (status = "Pending") => {
    if (!requestingUser.trim()) {
      toast.error("Please enter requesting user name");
      return;
    }
    if (items.length === 0 || items.every(i => i.qty === 0)) {
      toast.error("Please add at least one item with quantity");
      return;
    }
    for (const item of items) {
      if (!item.unitPrice || item.unitPrice <= 0) {
        toast.error(`Invalid price for "${item.name || 'item'}". Price must be greater than 0.`);
        return;
      }
    }
    const setLoading = status === "Draft" ? setSavingDraft : setSavingSubmit;
    setLoading(true);
    try {
      const data = {
        requestType, requestingUnit, requestingUser, priority, reason, remarks, vendor,
        items: items.map(i => ({ sku: i.sku, name: i.name, category: i.category, qty: i.qty, unitPrice: i.unitPrice })),
        status,
      };
      const res = await purchaseRequestAPI.create(data);
      if (res.data.success) {
        setLastPR(res.data.data);
        setSubmitted(true);
        toast.success(status === "Draft" ? "Draft saved!" : "Purchase request submitted!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) selected`);
    e.target.value = '';
  }, []);

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendPOEmail = async () => {
    if (!vendorEmail.trim()) return toast.error("Please enter vendor email");
    setSendingEmail(true);
    try {
      await purchaseRequestAPI.sendPOEmail(lastPR._id, vendorEmail);
      toast.success(`Purchase order sent to ${vendorEmail}`);
      setShowEmailModal(false);
      setVendorEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send email");
    } finally {
      setSendingEmail(false);
    }
  };

  const handlePrint = () => {
    const printWin = window.open('', '_blank');
    printWin.document.write(getReceiptHTML());
    printWin.document.close();
    printWin.print();
  };

  const handleDownload = () => {
    const blob = new Blob([getReceiptText()], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `purchase_request_${lastPR?.requestId || "draft"}.txt`;
    link.click();
    toast.success("Receipt downloaded");
  };

  const getReceiptText = () => {
    const pr = lastPR;
    const lines = [
      "=".repeat(50),
      "PURCHASE REQUEST",
      "=".repeat(50),
      `Request ID: ${pr?.requestId || "N/A"}`,
      `Date: ${pr ? new Date(pr.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}`,
      `Requested By: ${requestingUser}`,
      `Unit: ${requestingUnit}`,
      `Priority: ${priority}`,
      `Status: ${pr?.status || "Draft"}`,
      "",
      "Items:",
      "-".repeat(50),
      "SKU          Name                      Qty   Unit Price   Total",
      "-".repeat(50),
    ];
    items.forEach(i => {
      lines.push(`${(i.sku || "N/A").padEnd(12)} ${i.name.padEnd(24)} ${String(i.qty).padEnd(5)} ${i.unitPrice.toFixed(2).padEnd(10)} ${(i.qty * i.unitPrice).toFixed(2)}`);
    });
    lines.push("-".repeat(50));
    lines.push(`Subtotal: ${subtotal.toFixed(2)} PKR`);
    lines.push(`Total: ${total.toFixed(2)} PKR`);
    lines.push("");
    lines.push(`Reason: ${reason}`);
    lines.push(`Remarks: ${remarks}`);
    lines.push("");
    lines.push("=".repeat(50));
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    return lines.join("\n");
  };

  const getReceiptHTML = () => {
    const pr = lastPR;
    const itemsRows = items.map(i => `
      <tr>
        <td style="padding:6px;border:1px solid #ddd;font-size:12px;">${i.sku || "N/A"}</td>
        <td style="padding:6px;border:1px solid #ddd;font-size:12px;">${i.name}</td>
        <td style="padding:6px;border:1px solid #ddd;font-size:12px;text-align:center;">${i.qty}</td>
        <td style="padding:6px;border:1px solid #ddd;font-size:12px;text-align:right;">${i.unitPrice.toFixed(2)}</td>
        <td style="padding:6px;border:1px solid #ddd;font-size:12px;text-align:right;">${(i.qty * i.unitPrice).toFixed(2)}</td>
      </tr>
    `).join("");
    return `<!DOCTYPE html><html><head><title>Purchase Request</title><style>
      body { font-family: monospace; padding: 20px; }
      h1 { text-align: center; }
      table { width: 100%; border-collapse: collapse; margin: 10px 0; }
      th { background: #1E4D7B; color: white; padding: 8px; font-size: 12px; text-align: left; }
    </style></head><body>
      <h1>PURCHASE REQUEST</h1>
      <p><strong>Request ID:</strong> ${pr?.requestId || "N/A"} | <strong>Date:</strong> ${pr ? new Date(pr.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</p>
      <p><strong>Requested By:</strong> ${requestingUser} | <strong>Unit:</strong> ${requestingUnit} | <strong>Priority:</strong> ${priority} | <strong>Status:</strong> ${pr?.status || "Draft"}</p>
      <table>
        <thead><tr><th>SKU</th><th>Item</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr></thead>
        <tbody>${itemsRows}</tbody>
      </table>
      <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)} PKR | <strong>Total:</strong> ${total.toFixed(2)} PKR</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p><strong>Remarks:</strong> ${remarks}</p>
      <p style="text-align:center;color:#888;margin-top:30px;">Generated: ${new Date().toLocaleString()}</p>
    </body></html>`;
  };

  if (submitted && lastPR) {
    return (
      <div className="min-h-screen bg-[#E8F4ff] font-sans px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-lg w-full text-center" ref={receiptRef}>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Request Submitted!</h2>
          <p className="text-gray-500 mb-1">Request ID: <strong className="text-blue-600">{lastPR.requestId}</strong></p>
          <p className="text-gray-500 mb-6">Status: <span className="text-green-600 font-bold">{lastPR.status}</span></p>
          <div className="flex flex-wrap gap-3 justify-center">
            {lastPR.vendor && (
              <button onClick={() => setShowEmailModal(true)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700">
                <Mail size={16} /> Send PO Email
              </button>
            )}
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-[#1E4D7B] text-white rounded-xl text-sm font-bold hover:bg-blue-700">
              <Printer size={16} /> Print Receipt
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50">
              <Download size={16} /> Download
            </button>
            <button onClick={() => navigate('/procurement-management')} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200">
              Go to Procurement
            </button>
          </div>
        </div>
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowEmailModal(false)}>
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-base font-bold text-gray-900 mb-1">Send Purchase Order</h3>
              <p className="text-xs text-gray-500 mb-4">Email PO to <strong>{lastPR.vendor}</strong></p>
              <input
                type="email"
                value={vendorEmail}
                onChange={e => setVendorEmail(e.target.value)}
                placeholder="vendor@example.com"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-blue-400 mb-4"
              />
              <div className="flex gap-2">
                <button onClick={() => setShowEmailModal(false)} className="flex-1 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">Cancel</button>
                <button onClick={handleSendPOEmail} disabled={sendingEmail} className="flex-1 py-2 text-sm font-bold bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50">
                  {sendingEmail ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>
          </div>
        )}
        <Toaster position="top-right" />
      </div>
    );
  }

  const workflowSteps = ["Drafting", "Review", "Approval", "Processing"];

  return (
    <div className="min-h-screen bg-[#E8F4ff] font-sans px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <Toaster position="top-right" />
      <div className="max-w-[2560px] mx-auto">
        <div className="flex items-center gap-1.5 text-xs mb-3 sm:mb-4">
          <span className="text-gray-400">Procurement</span>
          <span className="text-gray-600">›</span>
          <span className="text-gray-700 font-medium">New Purch Request</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase mb-2">Create Purchase Request</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <button onClick={() => handleSubmit("Draft")} disabled={savingDraft} className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50">
              <Save size={14} /> {savingDraft ? "Saving..." : "Save Draft"}
            </button>
            <button onClick={() => handleSubmit("Pending")} disabled={savingSubmit} className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50">
              <Send size={14} /> {savingSubmit ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
          {/* LEFT COLUMN (2/3) */}
          <div className="xl:col-span-2 flex flex-col gap-4 sm:gap-5">
            {/* Request Information Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Info size={17} className="text-blue-500" />
                <h2 className="text-base font-bold text-gray-900">Request Information</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Request Type</label>
                  <div>
                    <input type="text" value={requestType} placeholder="Manual Request" className={`${inputCls} bg-gray-50 text-gray-500 cursor-not-allowed`} readOnly />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Requesting Unit</label>
                  <div className="relative">
                    <select className={selectCls} value={requestingUnit} onChange={e => setRequestingUnit(e.target.value)}>
                      <option>Warehouse A - North Sector</option>
                      <option>Warehouse B - South Sector</option>
                      <option>Main Office</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Requesting User</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" value={requestingUser} onChange={e => setRequestingUser(e.target.value)} placeholder="Enter name..." className={`${inputCls} pl-8 bg-white`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Priority Level</label>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {["Low", "Medium", "High"].map((p) => (
                      <button key={p} onClick={() => setPriority(p)}
                        className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors ${priority === p ? "border-blue-500 text-blue-600 bg-blue-50" : "border-gray-200 text-gray-500 bg-white hover:border-gray-300"}`}>
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Preferred Vendor / Supplier</label>
                  <div className="relative">
                    <select className={selectCls} value={vendor} onChange={e => setVendor(e.target.value)} disabled={vendorsLoading}>
                      <option value="">{vendorsLoading ? "Loading vendors..." : "Select a vendor (optional)"}</option>
                      {vendors.map(v => (
                        <option key={v._id} value={v.name}>{v.name}{v.vendorId ? ` (${v.vendorId})` : ''}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelCls}>Reason for Purchase</label>
                <textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} placeholder="Describe why these items are needed..." className={`${inputCls} resize-none`} />
              </div>
            </div>

            {/* Purchase Items Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <List size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">Purchase Items</h2>
                    <p className="text-xs text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''} added</p>
                  </div>
                </div>
                <button onClick={addItem} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  <Plus size={14} /> Add Item
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <div className="min-w-[700px]">
                  {/* Header */}
                  <div className="grid grid-cols-[0.5fr_2.5fr_1fr_0.7fr_1fr_1fr_auto] gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
                    {[{ label: "ID", align: "text-left" },{ label: "Name / SKU", align: "text-left" },{ label: "Category", align: "text-center" },{ label: "Qty", align: "text-center" },{ label: "Unit Price", align: "text-right" },{ label: "Total", align: "text-right" },{ label: "", align: "text-center" }].map(h => (
                      <div key={h.label} className={`text-[11px] font-bold text-gray-500 uppercase tracking-wider ${h.align}`}>{h.label}</div>
                    ))}
                  </div>

                  {/* Rows */}
                  {items.map((item, idx) => (
                    <div key={item.id} className={`grid grid-cols-[0.5fr_2.5fr_1fr_0.7fr_1fr_1fr_auto] gap-2 px-4 py-3 ${idx !== items.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                      <div className="flex items-center">
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">#{item.id.slice(-4)}</span>
                      </div>
                      <div>
                        <input type="text" value={item.name} onChange={e => updateItem(item.id, "name", e.target.value)} className="w-full text-sm font-semibold text-gray-900 bg-transparent border-b-2 border-transparent focus:border-blue-500 outline-none pb-0.5 transition-colors" placeholder="Item name" />
                        <input type="text" value={item.sku} onChange={e => updateItem(item.id, "sku", e.target.value)} className="w-full text-xs text-gray-400 bg-transparent border-b-2 border-transparent focus:border-blue-400 outline-none pb-0.5 transition-colors mt-0.5" placeholder="SKU (optional)" />
                      </div>
                      <div className="flex items-center justify-center">
                        <select value={item.category} onChange={e => updateItem(item.id, "category", e.target.value)} className="w-full text-xs font-medium px-2 py-1.5 rounded-lg border border-gray-200 outline-none bg-white focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors">
                          {Object.keys(categoryColors).map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="flex items-center justify-center">
                        <input type="number" value={item.qty} onChange={e => updateItem(item.id, "qty", Number(e.target.value) || 0)} className="w-full px-2 py-1.5 text-sm text-center font-semibold border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-colors" min={1} />
                      </div>
                      <div className="flex items-center justify-end">
                        <div className="relative w-full">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">Rs</span>
                          <input type="number" value={item.unitPrice} onChange={e => updateItem(item.id, "unitPrice", Number(e.target.value) || 0)} className="w-full pl-8 pr-2 py-1.5 text-sm text-right font-semibold border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 transition-colors" min={0} step="0.01" />
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <span className="text-sm font-bold text-gray-900">{(item.qty * item.unitPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-center">
                        <button onClick={() => removeItem(item.id)} className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove item">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {items.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm italic">No items added yet. Click "Add Item" to get started.</p>
                </div>
              )}

              {/* Summary bar */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  <span className="font-medium text-gray-600">{items.length}</span> item{items.length !== 1 ? 's' : ''} · Total: <span className="font-bold text-gray-900">{total.toFixed(2)} PKR</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">Subtotal</span>
                  <span className="text-sm font-black text-gray-900">{subtotal.toFixed(2)} PKR</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (1/3) */}
          <div className="xl:col-span-1 flex flex-col gap-4">
            {/* Order Summary Card */}
            <div className="rounded-2xl p-4 sm:p-5 flex flex-col gap-4" style={{ background: "linear-gradient(160deg, #1E4D7B 0%, #1E4D7B 60%, #1e3a8a 100%)" }}>
              <h2 className="text-base sm:text-lg font-bold text-white">Order Summary</h2>
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm text-blue-100">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-white">{subtotal.toFixed(2)} PKR</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm text-blue-100">
                  <span>Taxes</span>
                  <span className="font-semibold text-white">0.00 PKR</span>
                </div>
              </div>
              <div className="border-t border-white/20" />
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-white">Total</span>
                <span className="text-base sm:text-lg font-black text-blue-300">{total.toFixed(2)} PKR</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-blue-200 text-center leading-relaxed tracking-wide uppercase">Review items before submission. Once submitted enters approval workflow.</p>
              <div className="border-t border-white/20" />
              <div>
                <label className="text-xs sm:text-sm font-bold text-white mb-2 block">Request Remarks</label>
                <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 outline-none focus:border-white/40 resize-none transition-colors" />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-bold text-white mb-2 block">Supporting Documents</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.png,.xls,.xlsx"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/30 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/50 transition-colors"
                >
                  <Upload size={20} className="text-blue-200" />
                  <span className="text-[10px] sm:text-xs text-blue-200 text-center">Click to upload</span>
                </div>
                {uploadedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {uploadedFiles.map((file, i) => (
                      <div key={i} className="flex items-center justify-between bg-white/10 rounded-lg px-2 py-1">
                        <span className="text-[10px] text-blue-200 truncate max-w-[160px]">{file.name}</span>
                        <button onClick={() => removeFile(i)} className="text-blue-200 hover:text-white text-xs leading-none ml-1">&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Approval Workflow */}
            <div className="bg-[#1E4D7B] rounded-2xl border border-[#1e3a6e] p-4 sm:p-5">
              <div className="text-[9px] sm:text-[10px] font-bold text-white/80 tracking-widest uppercase mb-4">Approval Workflow</div>
              <div className="flex flex-col gap-3">
                {workflowSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0 transition-colors ${i === 0 ? "bg-blue-500 text-white/80" : "bg-[#243b5e] text-white/80"}`}>
                      {i === 0 ? <CheckCircle size={12} className="text-white/80" /> : i + 1}
                    </div>
                    <span className={`text-xs sm:text-sm font-semibold text-white/80`}>{step}</span>
                    {i === 0 && <span className="ml-auto text-[9px] sm:text-[10px] text-white/80 font-bold">Active</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
