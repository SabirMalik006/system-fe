import React from 'react';

const InventoryUpdate = ({ selectedItem, quantity }) => {
    const previousStock = selectedItem ? selectedItem.stock : 0;
    const received = parseInt(quantity) || 0;
    const afterReceipt = previousStock + received;

    return (
        <div className="bg-gradient-to-b from-[#1E4D7B] to-[#1E4D7B] rounded-xl border border-gray-200 p-5 text-white">
            <h2 className="text-xs font-semibold mb-4 uppercase">Inventory Update</h2>

            <div className="space-y-3 ">
                <div className="flex items-start flex-col gap-1 border-b-2 border-white pb-5 z-10">
                    <span className="text-white/80 text-4xl font-semibold">{afterReceipt.toLocaleString()} </span>
                    <span className='text-sm' >  Units (After Receipt)</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-white">Previous Stock :</span>
                    <span className="font-semibold">{previousStock.toLocaleString()} Units</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-white">Received :</span>
                    <span className="text-white font-semibold">+{received.toLocaleString()} Units</span>
                </div>
            </div>
        </div>
    );
};

export default InventoryUpdate;