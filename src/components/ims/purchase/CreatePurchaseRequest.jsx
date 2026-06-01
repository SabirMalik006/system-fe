import React, { useState } from "react";
import {
  Info,
  List,
  User,
  ChevronDown,
  Plus,
  Trash2,
  Save,
  Send,
  Upload,
  CheckCircle,
} from "lucide-react";

const initialItems = [
  {
    id: "ITM-001",
    sku: "SKU-49201",
    name: 'Steel Reinforced Pipes 12"',
    category: "Construction",
    qty: 50,
    unitPrice: 120.0,
  },
  {
    id: "ITM-002",
    sku: "SKU-22093",
    name: "Industrial Adhesive Grade A",
    category: "Chemicals",
    qty: 10,
    unitPrice: 45.5,
  },
  {
    id: "ITM-003",
    sku: "SKU-88120",
    name: "Safety Helmets - Blue",
    category: "PPE",
    qty: 100,
    unitPrice: 25.0,
  },
];

const categoryColors = {
  Construction: "bg-blue-100 text-blue-700",
  Chemicals: "bg-purple-100 text-purple-700",
  PPE: "bg-green-100 text-green-700",
};

const inputCls =
  "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 placeholder-gray-400 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-colors";
const selectCls = `${inputCls} appearance-none pr-8 cursor-pointer`;
const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5";

export default function CreatePurchaseRequest() {
  const [items, setItems] = useState(initialItems);
  const [priority, setPriority] = useState("Medium");
  const [remarks, setRemarks] = useState("");
  const [reason, setReason] = useState("");
  const [requestingUser, setRequestingUser] = useState("");

  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Number(qty) || 0 } : i)),
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      {
        id: `ITM-${Math.floor(Math.random() * 1000)}`,
        sku: "",
        name: "New Item",
        category: "Construction",
        qty: 1,
        unitPrice: 0,
      },
    ]);

  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const shipping = 125;
  const taxes = 0;
  const total = subtotal + shipping + taxes;

  const workflowSteps = ["Drafting", "Review", "Approval", "Processing"];

  return (
    <div className="min-h-screen bg-[#E8F4ff] font-sans px-3 sm:px-4 md:px-6 py-4 sm:py-6">
      <div className="max-w-[2560px] mx-auto">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-1.5 text-xs mb-3 sm:mb-4">
          <span className="text-gray-400">Procurement</span>
          <span className="text-gray-600">›</span>
          <span className="text-gray-700 font-medium">New Purch Request</span>
        </div>

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-black tracking-tight uppercase mb-2">
              Create Purchase Request
            </h1>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B] text-white text-xs font-bold px-3 py-1 rounded">
                REQ-2024-0812
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block" />
                Draft saved 2 minutes ago
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-300 bg-white text-gray-700 text-xs sm:text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              <Save size={14} />
              Save Draft
            </button>
            <button className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B] hover:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm">
              <Send size={14} />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
          {/* ════ LEFT COLUMN (2/3) ════ */}
          <div className="xl:col-span-2 flex flex-col gap-4 sm:gap-5">
            {/* Request Information Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4 sm:mb-5">
                <Info size={17} className="text-blue-500" />
                <h2 className="text-base font-bold text-gray-900">
                  Request Information
                </h2>
              </div>

              {/* Row 1: Request Type + Requesting Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Request Type</label>
                  <div className="relative">
                    <select className={selectCls} defaultValue="Manual Request">
                      <option>Manual Request</option>
                      <option>Auto Reorder</option>
                      <option>Emergency Request</option>
                    </select>
                    <ChevronDown
                      size={13}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Requesting Unit</label>
                  <div className="relative">
                    <select
                      className={selectCls}
                      defaultValue="Warehouse A - North Sector"
                    >
                      <option>Warehouse A - North Sector</option>
                      <option>Warehouse B - South Sector</option>
                      <option>Main Office</option>
                    </select>
                    <ChevronDown
                      size={13}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Requesting User + Priority Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCls}>Requesting User</label>
                  <div className="relative">
                    <User
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={requestingUser}
                      onChange={(e) => setRequestingUser(e.target.value)}
                      placeholder="Enter name..."
                      className={`${inputCls} pl-8 bg-white`}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Priority Level</label>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {["Low", "Medium", "High"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPriority(p)}
                        className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-colors ${
                          priority === p
                            ? "border-blue-500 text-blue-600 bg-blue-50"
                            : "border-gray-200 text-gray-500 bg-white hover:border-gray-300"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Reason for Purchase */}
              <div>
                <label className={labelCls}>Reason for Purchase</label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Describe why these items are needed..."
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            {/* Purchase Items Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <div className="flex items-center gap-2">
                  <List size={17} className="text-blue-500" />
                  <h2 className="text-base font-bold text-gray-900">
                    Purchase Items
                  </h2>
                </div>
                <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                  {items.length} Items Selected
                </span>
              </div>

              {/* Table - Responsive overflow */}
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Table header */}
                  <div className="grid grid-cols-[0.7fr_2fr_1.2fr_0.8fr_1fr_1fr_auto] gap-3 px-2 pb-2 border-b border-gray-100 mb-1">
                    {[
                      { label: "ID", align: "text-left" },
                      { label: "Item Reference", align: "text-left" },
                      { label: "Category", align: "text-center" },
                      { label: "Qty", align: "text-center" },
                      { label: "Est. Unit Price", align: "text-right" },
                      { label: "Total", align: "text-right" },
                      { label: "Action", align: "text-center" },
                    ].map((h) => (
                      <div
                        key={h.label}
                        className={`text-[10px] font-bold text-gray-400 tracking-wider uppercase ${h.align}`}
                      >
                        {h.label}
                      </div>
                    ))}
                  </div>

                  {/* Table rows */}
                  <div className="divide-y divide-gray-50">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-[0.7fr_2fr_1.2fr_0.8fr_1fr_1fr_auto] gap-3 items-center py-4 px-2"
                      >
                        {/* ID */}
                        <div className="text-xs font-medium text-gray-500 text-left">
                          #{item.id}
                        </div>

                        {/* Item Reference */}
                        <div className="text-left">
                          <div className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                            {item.sku}
                          </div>
                          <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5">
                            {item.name}
                          </div>
                        </div>

                        {/* Category badge */}
                        <div className="text-center">
                          <span
                            className={`text-[10px] sm:text-xs font-semibold px-2 py-1 rounded-md ${categoryColors[item.category] || "bg-gray-100 text-gray-600"}`}
                          >
                            {item.category}
                          </span>
                        </div>

                        {/* Qty input */}
                        <div className="text-center">
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => updateQty(item.id, e.target.value)}
                            className="w-full px-2 py-1.5 text-xs sm:text-sm text-center border border-gray-200 rounded-lg outline-none focus:border-blue-400 font-semibold"
                            min={1}
                          />
                        </div>

                        {/* Unit Price */}
                        <div className="text-xs sm:text-sm text-gray-700 text-right">
                          {item.unitPrice.toFixed(2)} PKR
                        </div>

                        {/* Total */}
                        <div className="text-xs sm:text-sm font-bold text-gray-900 text-right">
                          {(item.qty * item.unitPrice).toLocaleString("en-PK", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}{" "}
                          PKR
                        </div>

                        {/* Delete */}
                        <div className="text-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors mx-auto block"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add Line Item */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={addItem}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-gray-200 rounded-xl text-xs sm:text-sm font-semibold text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <Plus size={15} />
                  Add Line Item
                </button>
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN (1/3) ════ */}
          <div className="xl:col-span-1 flex flex-col gap-4">
            {/* Order Summary Card */}
            <div
              className="rounded-2xl p-4 sm:p-5 flex flex-col gap-4"
              style={{
                background:
                  "linear-gradient(160deg, #1E4D7B 0%, #1E4D7B 60%, #1e3a8a 100%)",
              }}
            >
              <h2 className="text-base sm:text-lg font-bold text-white">
                Order Summary
              </h2>

              {/* Line items */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between text-xs sm:text-sm text-blue-100">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-white">
                    {subtotal.toLocaleString("en-PK", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    PKR
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm text-blue-100">
                  <span>Estimated Shipping</span>
                  <span className="font-semibold text-white">
                    {shipping.toFixed(2)} PKR
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm text-blue-100">
                  <span>Taxes (calculated at checkout)</span>
                  <span className="font-semibold text-white">
                    {taxes.toFixed(2)} PKR
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/20" />

              {/* Total */}
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-white">
                  Total Estimated Amount
                </span>
                <span className="text-base sm:text-lg font-black text-blue-300">
                  {total.toLocaleString("en-PK", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  PKR
                </span>
              </div>

              {/* Submit button */}
              <button className="w-full py-2.5 sm:py-3 bg-blue-800 hover:bg-blue-400 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors">
                Submit for Approval
              </button>

              {/* Note */}
              <p className="text-[9px] sm:text-[10px] text-blue-200 text-center leading-relaxed tracking-wide uppercase">
                Review your items before submission. Once submitted, the request
                enters the approval workflow.
              </p>

              {/* Divider */}
              <div className="border-t border-white/20" />

              {/* Request Remarks */}
              <div>
                <label className="text-xs sm:text-sm font-bold text-white mb-2 block">
                  Request Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 outline-none focus:border-white/40 resize-none transition-colors"
                />
              </div>

              {/* Supporting Documents */}
              <div>
                <label className="text-xs sm:text-sm font-bold text-white mb-2 block">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-white/30 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-white/50 transition-colors">
                  <Upload size={20} className="text-blue-200" />
                  <span className="text-[10px] sm:text-xs text-blue-200 text-center">
                    Click or drag files to upload
                  </span>
                </div>
              </div>
            </div>

            {/* Approval Workflow Card */}
            <div className="bg-[#1E4D7B] rounded-2xl border border-[#1e3a6e] p-4 sm:p-5">
              <div className="text-[9px] sm:text-[10px] font-bold text-white/80 tracking-widest uppercase mb-4">
                Approval Workflow
              </div>
              <div className="flex flex-col gap-3">
                {workflowSteps.map((step, i) => (
                  <div key={step} className="flex items-center gap-3">
                    {/* Step circle */}
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold flex-shrink-0 transition-colors ${
                        i === 0
                          ? "bg-blue-500 text-white/80"
                          : "bg-[#243b5e] text-white/80"
                      }`}
                    >
                      {i === 0 ? (
                        <CheckCircle size={12} className="text-white/80" />
                      ) : (
                        i + 1
                      )}
                    </div>
                    {/* Step label */}
                    <span
                      className={`text-xs sm:text-sm font-semibold ${i === 0 ? "text-white/80" : "text-white/80"}`}
                    >
                      {step}
                    </span>
                    {/* Active indicator */}
                    {i === 0 && (
                      <span className="ml-auto text-[9px] sm:text-[10px] text-white/80 font-bold">
                        Active
                      </span>
                    )}
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
