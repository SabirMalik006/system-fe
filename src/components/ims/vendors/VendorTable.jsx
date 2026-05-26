import React, { useState, useEffect, useRef } from 'react';

const VendorTable = ({ vendors, onVendorClick, onEdit, onDelete }) => {
    const headers = ["NAME", "VENDOR ID", "SHIPPING ITEMS", "TOTAL ORDERS", "ON-TIME %", "RATING", "STATUS", "ACTIONS"];
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const dropdownRef = useRef(null);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getStatusBadge = (status) => {
        if (status === 'Blacklisted') {
            return (
                <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                    Blacklisted
                </span>
            );
        }
        if (status === 'Inactive') {
            return (
                <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                    Inactive
                </span>
            );
        }
        return (
            <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B] text-white">
                Active
            </span>
        );
    };

    const handleVendorNameClick = (vendor) => {
        if (onVendorClick) {
            onVendorClick(vendor);
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating || 0);
        const hasHalfStar = (rating || 0) - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center gap-1 text-yellow-500 text-sm">
                {'★'.repeat(fullStars)}
                {hasHalfStar ? '★' : ''}
                <span className="text-gray-300">{'★'.repeat(emptyStars)}</span>
                <span className="text-gray-600 text-xs ml-1">{rating?.toFixed(1) || '0.0'}</span>
            </div>
        );
    };

    return (
        <div className="overflow-x-auto min-h-[300px] pb-32">
            <table className="w-full">
                <thead>
                    <tr className="bg-gradient-to-r from-[#1E4D7B] to-[#2166A0]">
                        {headers.map((header, idx) => (
                            <th key={idx} className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody ref={dropdownRef}>
                    {vendors.map((vendor, idx) => {
                        const vendorId = vendor._id || vendor.id || idx;
                        const isDropdownOpen = openDropdownId === vendorId;

                        return (
                            <tr key={vendorId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td 
                                    className="px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-800 cursor-pointer hover:underline"
                                    onClick={() => handleVendorNameClick(vendor)}
                                >
                                    {vendor.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">{vendor.vendorId || vendor.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{vendor.shippingItems}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{vendor.totalOrders}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{vendor.onTimePercentage || vendor.onTime || 0}%</td>
                                <td className="px-4 py-3">
                                    {renderStars(vendor.rating)}
                                </td>
                                <td className="px-4 py-3">
                                    {getStatusBadge(vendor.status)}
                                </td>
                                <td className="px-4 py-3 relative">
                                    <button 
                                        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenDropdownId(isDropdownOpen ? null : vendorId);
                                        }}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                        </svg>
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                            <div className="py-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(null);
                                                        if (onEdit) onEdit(vendor);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(null);
                                                        if (onDelete) onDelete(vendor);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default VendorTable;