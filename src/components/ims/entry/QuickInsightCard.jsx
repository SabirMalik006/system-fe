import React from 'react';

const QuickInsightCard = ({ currentStock = 1250, safetyThreshold = 200 }) => {
    return (
        <div className="bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B] rounded-lg border border-gray-200 p-6 text-white z-1 relative">
            {/* <img src="/Vector.png" alt="" className='absolute top-0 right-0 z-0' /> */}
            <div className='flex items-center gap-2 font-500' >
                <img src="/f.png" alt="" className='pb-2' />
                <h2 className="text-md font-semibold  mb-3">Quick Insight</h2>
            </div>

            <div className="mb-4 z-2">
                <div className="flex items-center justify-between text-sm mb-1">
                    <span className="">Current Stock:</span>
                    <span className="font-medium z-1">{currentStock.toLocaleString()} Units</span>
                    {/* <img src="/3.png" alt="" /> */}
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="">Safety Threshold:</span>
                    <span className="font-medium z-1 ">{safetyThreshold.toLocaleString()} Units</span>
                </div>
            </div>

            <p className="text-xs">
                * Stock availability projections based on current issuance path.
            </p>
        </div>
    );
};

export default QuickInsightCard;