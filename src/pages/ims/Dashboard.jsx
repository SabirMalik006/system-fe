import React from 'react';
// import Topbar from '../components/dashboard/Topbar';
import KPIStats from '../../components/dashboard/KPIStats';
import AlertCenter from '../../components/dashboard/AlertCenter';
import InspectionAlert from '../../components/dashboard/InspectionAlert';
import StockMovement from '../../components/dashboard/StockMovement';
import VendorAndBook from '../../components/dashboard/VendorAndBook';
import ItemCategoryHealth from '../../components/dashboard/ItemCategoryHealth';
import StockReorderAndRisk from '../../components/dashboard/StockReorderAndRisk';
// import InventoryAndCritical from '../components/dashboard/InventoryAndCritical';
import InventoryAndCriticalStock from '../../components/dashboard/Inventoryandcriticalstock';
import Footer from '../../components/common/fotter';

export default function Dashboard() {
  return (
    <>
      {/* <Topbar /> */}
      <div className='w-full bg-[#E8F4FF] p-4'></div>
      {/* <div className="pt-3 px-3 sm:px-4 md:px-5 pb-8"> */}
        
        {/* KPI Stats - Responsive Grid */}
        <div className="mb-4">
          <KPIStats />
        </div>
        
        {/* Alert Center - Full Width */}
        <div className="mb-4 m-4">
          <AlertCenter />
        </div>

        {/* Inspection Alert */}
        <InspectionAlert />

        {/* Stock Movement - Full Width on Mobile, Flexible on Desktop */}
        <div className="mb-4">
          <StockMovement />
        </div>
        
        {/* Vendor and Book - Already has responsive grid inside */}
        <div className="mb-4 m-4">
          <VendorAndBook />
        </div>
        
        {/* Item Category Health - Responsive */}
        <div className="mb-4 m-4">
          <ItemCategoryHealth />
        </div>
        
        {/* Stock Reorder and Risk - Responsive */}
        <div className="mb-4">
          <StockReorderAndRisk />
        </div>

          {/* Inventory and Critical Stock - Responsive */}
        <div>
          <InventoryAndCriticalStock />
        </div>
        
      <div>
        <Footer />
      </div>

        {/* Inventory and Critical - Already has responsive grid inside */}
        {/* <div className="mb-4">
          <InventoryAndCritical />
        </div> */}
      {/* </div> */}
    </>
  );
}