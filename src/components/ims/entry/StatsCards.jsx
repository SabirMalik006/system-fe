import React from 'react';

const StatsCards = ({ 
    showLowStockAlert = true,
    totalIssuances = 0,
    pendingApprovals = 0,
    approvedIssuances = 0,
    lowStockAlerts = 0
}) => {
    const stats = [
        { 
            label: "TOTAL ISSUANCES", 
            value: String(totalIssuances).padStart(2, '0'),
            icon: "/Overlay.png",
            bgGradient: "bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B]",
            alwaysShow: true
        },
        { 
            label: "PENDING APPROVALS", 
            value: String(pendingApprovals).padStart(2, '0'),
            icon: "/Overlay (1).png",
            bgGradient: "bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B]",
            alwaysShow: true
        },
        { 
            label: "COMPLETED ISSUANCES", 
            value: String(approvedIssuances).padStart(2, '0'),
            icon: "/Overlay (2).png",
            bgGradient: "bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B]",
            alwaysShow: true
        },
        { 
            label: "Low Stock Alerts", 
            value: `${lowStockAlerts} Alerts`, 
            icon: "/Background (1).png",
            bgGradient: "from-[#640404] to-[#640404]",
            alwaysShow: false
        }
    ];

    // Filter stats based on showLowStockAlert prop
    const visibleStats = stats.filter(stat => stat.alwaysShow || showLowStockAlert);

    return (
        <div className="grid grid-cols-1 gap-4">
            {visibleStats.map((stat, index) => (
                <div 
                    key={index} 
                    className={`bg-gradient-to-b ${stat.bgGradient} rounded-lg border border-gray-200 p-2 py-3 px-4 text-white`}
                >
                    <div className="flex items-center gap-2">
                        <img src={stat.icon} alt="" className='h-11 w-11 mr-2' />
                        <div>
                            <div className="text-sm">{stat.label}</div>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;