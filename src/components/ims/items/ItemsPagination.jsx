import React from 'react';

const ItemsPagination = ({ currentPage, totalPages, totalRecords, onPageChange }) => {
    const startRecord = (currentPage - 1) * 8 + 1;
    const endRecord = Math.min(currentPage * 8, totalRecords);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
            <div className="text-sm text-gray-500">
                Showing {startRecord} to {endRecord} of {totalRecords} results
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    ←
                </button>
                
                {getPageNumbers().map((page, idx) => (
                    <button
                        key={idx}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        className={`px-3 py-1 text-sm rounded border cursor-pointer ${
                            currentPage === page
                                ? 'bg-[#1A8FA0] text-white border-[#1A8FA0]'
                                : page === '...'
                                ? 'border-none cursor-default'
                                : 'text-gray-600 hover:bg-gray-100 border-gray-200'
                        }`}
                        disabled={page === '...'}
                    >
                        {page}
                    </button>
                ))}
                
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    →
                </button>
            </div>
        </div>
    );
};

export default ItemsPagination;