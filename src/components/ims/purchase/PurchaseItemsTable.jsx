import React, { useState } from "react";

const PurchaseItemsTable = ({ items, onUpdateItem, onRemoveItem }) => {
  const headers = [
        { label: "ITEM ID", align: "text-left" },
        { label: "ITEM REFERENCE", align: "text-left" },
        { label: "CATEGORY", align: "text-left" },
        { label: "QTY", align: "text-center" },
        { label: "EST. UNIT PRICE", align: "text-right" },
        { label: "TOTAL", align: "text-right" },
        { label: "ACTION", align: "text-center" }
    ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-[#1E4D7B] to-[#2166A0]">
            {headers.map((header, idx) => (
              <th
                key={idx}
                className={`px-4 py-3 ${header.align} text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap`}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 text-sm text-gray-900 font-medium text-left">
                #{item.id}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 text-left">
                {item.reference}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 text-left">
                {item.category}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 text-center">
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) =>
                    onUpdateItem(idx, "qty", parseInt(e.target.value))
                  }
                  className="w-20 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] text-center"
                />
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 text-right">
                <input
                  type="text"
                  value={`$${item.unitPrice}`}
                  onChange={(e) =>
                    onUpdateItem(
                      idx,
                      "unitPrice",
                      parseFloat(e.target.value.replace("$", "")),
                    )
                  }
                  className="w-24 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] text-right"
                />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                ${(item.qty * item.unitPrice).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onRemoveItem(idx)}
                  className="text-gray-400 hover:text-red-600 transition-colors mx-auto block"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseItemsTable;
