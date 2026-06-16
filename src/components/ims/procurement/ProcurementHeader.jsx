import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Download, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { purchaseRequestAPI } from '../../../services/api';
import toast from 'react-hot-toast';
import RequestPage from '../../../pages/ims/PurchaseRequest';

export default function ProcurementHeader() {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const navigate = useNavigate();
    const modalRef = useRef(null);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowReviewModal(false);
            }
        };

        if (showReviewModal) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [showReviewModal]);

    const handleCreatePurchaseRequest = () => {
        navigate('/purchase-request');
    };

    const handleExport = async () => {
        try {
            const res = await purchaseRequestAPI.getAll(1, 1000, '', '', '');
            if (res.data.success) {
                const { exportToCSV } = await import('../../../utils/exportUtils');
                exportToCSV(res.data.data, [
                    { label: 'ID', key: 'requestId' },
                    { label: 'Title', key: 'title' },
                    { label: 'Department', key: 'department' },
                    { label: 'Total', key: 'totalAmount' },
                    { label: 'Status', key: 'status' },
                    { label: 'Date', key: 'createdAt' },
                ], 'purchase_requests');
                toast.success('Data exported successfully');
            }
        } catch (err) {
            toast.error('Failed to export');
        }
    };

    return (
        <>
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 bg-[#E8F4FF]">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-[#0F172A] tracking-tight leading-tight text-center sm:text-left">
                        Procurement Management
                    </h1>
                    <p className="text-xs sm:text-sm md:text-base text-[#64748B] mt-0.5 sm:mt-1 text-center sm:text-left">
                        Manage and monitor organization-wide purchase requests.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center justify-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 sm:py-2 md:py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                        <Download size={14} />
                        Export
                    </button>
                    <button 
                        onClick={handleCreatePurchaseRequest}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#3B82F6] to-[#1E4D7B] hover:from-[#2563EB] hover:to-[#1A3A6B] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-3 sm:py-2 md:py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md text-center leading-tight whitespace-nowrap cursor-pointer"
                    >
                        <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                        <span>Create Purchase Request</span>
                    </button>
                </div>
            </div>

            {/* ====================== REVIEW & APPROVE REQUEST MODAL (Small) ====================== */}
            {showReviewModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div 
                        ref={modalRef}
                        className="bg-[#F8FAFC] rounded-xl w-full max-w-sm shadow-2xl overflow-hidden"
                        style={{ maxHeight: '85vh', overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-[#F8FAFC] flex items-center justify-between px-4 py-3 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900">Review & Approve Request</h2>
                                <p className="text-[12px] text-gray-500 mt-0.5">Request ID: PR-7721 • IT Infrastructure</p>
                            </div>
                            <button 
                                onClick={() => setShowReviewModal(false)}
                                className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                                <X size={14} className="text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-4 space-y-4 ">
                            {/* Total Items and Requested Total */}
                            <div className="grid grid-cols-2 gap-3 bg-[#1152D41A] rounded-lg px-3 py-2">
                                <div className="rounded-lg p-2.5 text-center">
                                    <div className="text-[11px] text-[#64748B] font-medium mt-0.5">TOTAL ITEMS</div>
                                    <div className="text-xl font-bold text-gray-900">5 Products</div>
                                </div>
                                <div className="rounded-lg p-2.5 text-center">
                                    <div className="text-[11px] text-[#64748B] font-medium mt-0.5">REQUESTED TOTAL</div>
                                    <div className="text-xl font-bold text-[#1152D4]">$1,200.00</div>
                                </div>
                            </div>

                            {/* Select Vendor */}
                            <div>
                                <label className="block text-[13px] font-semibold text-[#334155] mb-1">Select Vendor</label>
                                <select className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 text-xs focus:outline-none focus:border-blue-500">
                                    <option value="">Select a preferred vendor...</option>
                                    <option value="vendor1">Global Logistics Corp</option>
                                    <option value="vendor2">Apex Solutions</option>
                                    <option value="vendor3">Private Supplies Ltd.</option>
                                    <option value="vendor4">TwiCarevent Intl.</option>
                                </select>
                            </div>

                            {/* Assign Purchase Order Number */}
                            <div>
                                <label className="block text-[13px] font-semibold text-[#334155] mb-1">Assign Purchase Order Number</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. PO-2023-0042" 
                                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Confirm Total Amount */}
                            <div>
                                <label className="block text-[13px] font-semibold text-[#334155] mb-1">Confirm Total Amount (USD)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500 text-xs">$</span>
                                    <input 
                                        type="text" 
                                        value="1200.00" 
                                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-md pl-7 pr-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Approval Notes */}
                            <div>
                                <label className="block text-[13px] font-semibold text-[#334155] mb-1">Approval Notes <span className="text-[#334155]">(Optional)</span></label>
                                <textarea 
                                    rows="2" 
                                    placeholder="Add any specific instructions for procurement..."
                                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                                ></textarea>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="sticky bottom-0 bg-gray-50 flex gap-2 px-4 py-3 border-t border-gray-100">
                            <button 
                                onClick={() => setShowReviewModal(false)}
                                className="flex-1 py-2 px-3 text-[#475569] rounded-md font-bold transition-colors text-xs"
                            >
                                Reject Request
                            </button>
                            <button className="flex-1 py-2 bg-[#1152D4] hover:bg-[#167a89] text-white rounded-md font-medium transition-colors text-xs">
                                Approve & Generate PO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}