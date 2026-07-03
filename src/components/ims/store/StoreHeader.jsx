import React from 'react';

const StoreHeader = ({ onClearForm, onSaveDraft, onReviewSubmit }) => {
    return (
        <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left side - Title and Description */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1 ">Create New Item</h1>
                    <p className="text-sm text-gray-500">Register a new asset or consumable in the global inventory system.</p>
                </div>

                {/* Right side - Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={onClearForm} className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs text-[#0F172A] border border-[#334155] rounded-sm hover:bg-gray-50 transition-colors font-medium whitespace-nowrap cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                        CLEAR FORM
                    </button>

                    <button onClick={onSaveDraft} className="flex items-center gap-2 px-3 sm:px-4 py-2 text-xs text-[#0F172A] border border-[#334155] rounded-sm hover:bg-gray-50 transition-colors font-medium whitespace-nowrap cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                        </svg>
                        SAVE DRAFT
                    </button>

                    <button onClick={onReviewSubmit} className="flex items-center gap-2 font-medium px-4 sm:px-6 py-2 text-sm text-white bg-gradient-to-b from-[#1E4D7B] to-[#1E4D7B] rounded-lg hover:from-[#1D4ED8] hover:to-[#1976D2] transition-all shadow-sm whitespace-nowrap cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.029 4.285A2 2 0 0 0 7 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"/>
                            <path d="M3 4v16"/>
                        </svg>
                        REVIEW & SUBMIT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoreHeader;