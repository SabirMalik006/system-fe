import React from "react";
import { X, Star, Building2 } from "lucide-react";

export default function VendorProfilePanel({ vendor, onClose }) {
  if (!vendor) return null;

  const items = vendor.suppliedItems?.length
    ? vendor.suppliedItems
    : vendor.shippingItems
      ? [{ name: vendor.shippingItems, category: '', units: '' }]
      : [];

  return (
    <div className="w-[280px] bg-white rounded-xl shadow-lg p-3 flex flex-col gap-2">

      <div className="flex items-start justify-between">
        <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
          <Building2 size={14} className="text-teal-500" />
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          <X size={14} />
        </button>
      </div>

      <div>
        <div className="flex items-center gap-1.5 mb-0.5">
          <h2 className="text-xs font-bold text-gray-900">{vendor.name}</h2>
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
            vendor.status === 'Active' ? 'text-teal-600 bg-teal-100' :
            vendor.status === 'Inactive' ? 'text-gray-600 bg-gray-100' :
            'text-red-600 bg-red-100'
          }`}>
            {vendor.status || 'Active'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-gray-400">ID: {vendor.vendorId}</p>
          <div className="flex items-center gap-0.5">
            <Star size={9} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[9px] font-semibold text-gray-700">{vendor.rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {(vendor.contactPerson || vendor.phone || vendor.email || vendor.address) && (
        <div>
          <p className="text-[8px] font-bold tracking-widest text-teal-600 uppercase mb-1.5">
            Vendor Contact Information
          </p>
          <div className="grid grid-cols-2 gap-2 mb-1.5">
            {vendor.contactPerson && (
              <div>
                <p className="text-[7px] font-semibold tracking-widest text-gray-400 uppercase mb-0.5">
                  Contact Person
                </p>
                <p className="text-[10px] font-semibold text-gray-800">{vendor.contactPerson}</p>
              </div>
            )}
            {vendor.phone && (
              <div>
                <p className="text-[7px] font-semibold tracking-widest text-gray-400 uppercase mb-0.5">
                  Phone
                </p>
                <p className="text-[10px] font-semibold text-gray-800">{vendor.phone}</p>
              </div>
            )}
          </div>
          {vendor.email && (
            <div className="mb-1.5">
              <p className="text-[7px] font-semibold tracking-widest text-gray-400 uppercase mb-0.5">Email</p>
              <p className="text-[10px] font-semibold text-gray-800 truncate">{vendor.email}</p>
            </div>
          )}
          {vendor.address && (
            <div>
              <p className="text-[7px] font-semibold tracking-widest text-gray-400 uppercase mb-0.5">Address</p>
              <p className="text-[10px] font-semibold text-gray-800 truncate">{vendor.address}</p>
            </div>
          )}
        </div>
      )}

      {items.length > 0 && (
        <div>
          <p className="text-[8px] font-bold tracking-widest text-teal-600 uppercase mb-1.5">
            Supplied Items
          </p>
          <div className="space-y-1">
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-blue-50 rounded-md px-2 py-1.5">
                <div>
                  <p className="text-[10px] font-semibold text-gray-800">{item.name}</p>
                  {item.category && <p className="text-[8px] text-gray-400">{item.category}</p>}
                </div>
                {item.units && <span className="text-[9px] font-bold text-blue-600">{item.units}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {vendor.contractNumber && (
        <div>
          <p className="text-[8px] font-bold tracking-widest text-teal-600 uppercase mb-1.5">
            Contract Details
          </p>
          <div>
            <p className="text-[7px] font-semibold tracking-widest text-gray-400 uppercase mb-0.5">
              Contract Number
            </p>
            <p className="text-[10px] font-semibold text-gray-800">{vendor.contractNumber}</p>
          </div>
        </div>
      )}

      <hr className="border-gray-100" />

      <div className="flex flex-col gap-1.5">
        <button className="w-full py-1.5 rounded-lg text-white font-semibold text-[11px] transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#0d9488,#0f766e)" }}>
          Edit Vendor Info
        </button>
        <div className="grid grid-cols-2 gap-1.5">
          <button className="py-1.5 rounded-lg border border-gray-200 text-gray-700 font-semibold text-[10px] hover:bg-gray-50 transition-colors">
            Mark Inactive
          </button>
          <button className="py-1.5 rounded-lg border border-red-200 text-red-500 font-semibold text-[10px] hover:bg-red-50 transition-colors">
            Blacklist
          </button>
        </div>
      </div>

    </div>
  );
}
