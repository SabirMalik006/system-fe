import React from 'react';

const EntrySummary = ({ selectedItem, quantity }) => {
    const unitPrice = selectedItem ? (selectedItem.unitPrice || 0) : 0;
    const totalValue = quantity * unitPrice;
    const itemName = selectedItem ? selectedItem.name : "N/A";
    const sku = selectedItem ? selectedItem.identifiers : "N/A";

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-base font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Entry Summary</h2>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Item:</span>
                    <span className="font-medium text-gray-900 text-right truncate">{itemName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">SKU:</span>
                    <span className="font-medium text-gray-900">{sku}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-medium text-gray-900">{quantity} units</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Unit Price:</span>
                    <span className="font-medium text-gray-900">Rs {unitPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-semibold">Total Value:</span>
                    <span className="font-bold text-[#1E4D7B]">Rs {totalValue.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default EntrySummary;