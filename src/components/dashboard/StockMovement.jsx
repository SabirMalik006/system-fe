import React from 'react';
import StockMovementChart from './StockMovementChart';
import InventoryStatusCard from './InventoryAndCritical';

export default function StockMovementSection() {
  return (
    <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-4 lg:gap-5 mb-4 md:mx-8">
      
      {/* Left: Bar Chart - Full width on mobile, flexible on desktop */}
      <div className="flex-1 w-full lg:min-w-0 ml-6 sm:ml-4 flex flex-col">
        <StockMovementChart />
      </div>

      {/* Right: Inventory Status Card - Centered on mobile, normal on desktop */}
      <div className="flex-shrink-0 mr-4 flex flex-col">
        <InventoryStatusCard />
      </div>
      
    </div>
  );
}