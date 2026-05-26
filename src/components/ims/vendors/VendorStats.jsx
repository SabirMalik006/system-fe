import React from 'react';

const VendorStats = ({ vendors = [] }) => {
    // Calculate stats
    const totalOrders = vendors.reduce((sum, v) => sum + (v.totalOrders || 0), 0);
    const activeVendors = vendors.filter(v => v.status === 'Active').length;
    const blacklistedVendors = vendors.filter(v => v.status === 'Blacklisted').length;
    
    // The dummy data had "4.82" for "Avg Order" which indicates it was actually Average Rating.
    const validRatings = vendors.filter(v => typeof v.rating === 'number' && v.rating > 0);
    const avgRating = validRatings.length > 0 
        ? (validRatings.reduce((sum, v) => sum + v.rating, 0) / validRatings.length).toFixed(2) 
        : "0.00";

    const stats = [
        { label: "Total Orders", value: totalOrders.toLocaleString() || "0", subtext: "TOTAL ORDERS" },
        { label: "Active Vendors", value: activeVendors < 10 ? `0${activeVendors}` : activeVendors, subtext: "ACTIVE VENDORS" },
        { label: "Blacklisted", value: blacklistedVendors < 10 ? `0${blacklistedVendors}` : blacklistedVendors, subtext: "BLACKLISTED" },
        { label: "Avg Order", value: avgRating, subtext: "AVG ORDER" }
    ];

    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{stat.subtext}</div>
                </div>
            ))}
        </div>
    );
};

export default VendorStats;