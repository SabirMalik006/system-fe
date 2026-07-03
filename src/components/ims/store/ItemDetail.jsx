import React from 'react';

const ItemDetail = ({ selectedItem }) => {
    const getLocation = () => {
        if (!selectedItem) return "N/A";
        const parts = [
            selectedItem.warehouse,
            selectedItem.rackNumber,
            selectedItem.shelfNumber,
            selectedItem.binNumber,
        ].filter(Boolean);
        return parts.length > 0 ? parts.join(", ") : "N/A";
    };

    const details = [
        { label: "Item Code:", value: selectedItem?.sku || "N/A" },
        { label: "Category:", value: selectedItem?.category || "N/A" },
        { label: "Reorder Level:", value: `${selectedItem?.minStock || 0} Units` },
        { label: "Location:", value: getLocation() },
        { label: "Unit Value:", value: `Rs ${selectedItem?.unitPrice?.toLocaleString() || '0.00'}` }
    ];

    return (
        <div className="bg-gradient-to-b from-[#1E4D7B] to-[#1E4D7B] rounded-xl border border-gray-200 p-5">
            <div className='flex gap-2 mb-2'>
                <img src="Icon (6).svg" alt="" />
                <h2 className="text-base font-semibold text-white">ITEM DETAIL</h2>
            </div>
            
            <div className="space-y-3">
                {details.map((item, index) => (
                    <div key={index} className="flex justify-between">
                        <span className="text-sm text-white/70">{item.label}</span>
                        <span className="text-sm font-medium text-white">{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ItemDetail;