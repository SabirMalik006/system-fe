import React from "react";

const ItemStockInfo = ({ item }) => {
  return (
    <div className="bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B] rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2">
        <img src="Icon (4).svg" alt="" className="pb-4" />
        <h2 className="text-lg font-bold text-white/90 mb-4">
          Item Stock Info
        </h2>
      </div>

      <div className="text-center py-4">
        {item ? (
          <div className="space-y-3 text-left">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60 text-xs">MIN STOCK LEVEL</span>
              <span className="text-white font-bold">
                {item.minStockLevel || 0}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60 text-xs">UNIT PRICE</span>
              <span className="text-white font-bold">
                ${item.unitPrice || 0}
              </span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-white/60 text-xs">STATUS</span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[10px] ${item.status === "critical" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
              >
                {item.status?.toUpperCase() || "NORMAL"}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-[#FFFFFF]">
            SELECT AN ITEM TO VIEW CURRENT <br /> STOCK DETAILS
          </p>
        )}
      </div>
    </div>
  );
};

export default ItemStockInfo;
