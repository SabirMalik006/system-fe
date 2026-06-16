import React from 'react';
import { Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { stockInAPI } from '../../../services/api';
import toast from 'react-hot-toast';

export default function GoodsReceiptHeader() {
    const navigate = useNavigate();

    const handleCreateNewItem = () => {
        navigate('/store');
    };

    const handleExport = async () => {
        try {
            const res = await stockInAPI.getTransactions(1, 1000, '');
            if (res.data.success) {
                const { exportToCSV } = await import('../../../utils/exportUtils');
                exportToCSV(res.data.data, [
                    { label: 'Receipt ID', key: 'receiptId' },
                    { label: 'Item', key: 'itemName' },
                    { label: 'Quantity', key: 'quantity' },
                    { label: 'Vendor', key: 'vendorName' },
                    { label: 'Status', key: 'status' },
                    { label: 'Date', key: 'createdAt' },
                ], 'goods_receipt');
                toast.success('Data exported successfully');
            }
        } catch (err) {
            toast.error('Failed to export');
        }
    };

    return (
        <>
            <div className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-[#0F172A] text-base sm:text-xl font-semibold leading-tight text-center sm:text-left">
                        Stock In: Goods Receipt
                    </h1>
                    <p className="text-[#64748B] text-[11px] sm:text-xs mt-0.5 text-center sm:text-left">
                        Record all inventory received into unit store.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExport}
                        className="flex items-center justify-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-1.5 sm:py-2 rounded-sm transition-all cursor-pointer"
                    >
                        <Download size={13} />
                        Export
                    </button>
                    <button 
                        onClick={handleCreateNewItem}
                        className="flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#3B82F6] to-[#1E4D7B] hover:from-[#2563EB] hover:to-[#1A3A6B] text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm transition-all duration-300 shadow-sm hover:shadow-md w-full sm:w-auto cursor-pointer"
                    >
                        <Plus size={14} className='font-bold sm:w-4 sm:h-4' />
                        Create New Item
                    </button>
                </div>
            </div>
        </>
    );
}