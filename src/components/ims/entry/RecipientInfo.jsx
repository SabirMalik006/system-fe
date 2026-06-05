import React, { useState } from 'react';

const RecipientInfo = ({ issuedTo, setIssuedTo }) => {
    const [isInternal, setIsInternal] = useState(false);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
               <div className='flex gap-2 items-center' >
                <h2 className="text-xl font-semibold text-[#2B8CEE]">Recipient Information</h2>
               </div>
                
                {/* On/Off Toggle Button */}
                <button
                    onClick={() => setIsInternal(!isInternal)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                        isInternal ? 'bg-[#2196F3]' : 'bg-gray-400'
                    }`}
                >
                    <span
                        className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                            isInternal ? 'translate-x-6' : 'translate-x-0'
                        }`}
                    />
                </button>
            </div>
            
            <div>
                <label className="text-xs font-medium text-[#64748B] mb-1.5 block">PERSONNEL (RECIPIENT) *</label>
                <input
                    type="text"
                    value={issuedTo}
                    onChange={(e) => setIssuedTo(e.target.value)}
                    placeholder="Type staff name or ID..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
                />
            </div>
            
            
        </div>
    );
};

export default RecipientInfo;