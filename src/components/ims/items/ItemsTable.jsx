import React from 'react';

const ItemsTable = ({ items, loading, onEdit, onDelete, onViewBarcode }) => {
    const headers = [
        "ITEM ID",
        "IDENTIFIERS",
        "BARCODE",
        "ITEM NAME AND CATEGORY",
        "DESCRIPTION",
        "UNIT",
        "MIN STOCK",
        "CURRENT STOCK",
        "THRESHOLD",
        "PRICE",
        "STATUS",
        "ACTION"
    ];

    if (loading) {
        return (
            <div className="text-center py-8 text-gray-500">
                <div className="animate-pulse">Loading items...</div>
            </div>
        );
    }

    if (!items || items.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No items found. Click "New Items" to create one.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        {headers.map((header, idx) => (
                            <th
                                key={idx}
                                className="px-5 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap bg-gradient-to-r from-[#1E4D7B] to-[#2166A0]"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id || item._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-[#2563EB]">{item.itemId || `TM-${item.sku?.slice(-6) || item._id?.slice(-6)}`}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.identifiers || item.sku}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-mono text-gray-500">{item.barcode || 'N/A'}</span>
                                    {item.barcode && (
                                        <button 
                                            onClick={() => onViewBarcode && onViewBarcode(item)}
                                            className="p-1 text-gray-400 hover:text-[#1A8FA0] transition-colors cursor-pointer"
                                            title="View Barcode Image"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                <div className="text-xs text-gray-400">{item.category}</div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600 max-w-[200px] truncate" title={item.description}>{item.description || '-'}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.unit}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.minStock || item.minimumStock}</td>
                            <td className="px-4 py-3">
                                <span className={`text-sm font-medium ${parseInt(String(item.currentStock).replace(/,/g, '')) < parseInt(item.threshold)
                                        ? 'text-red-600'
                                        : 'text-gray-900'
                                    }`}>
                                    {typeof item.currentStock === 'number' ? item.currentStock.toLocaleString() : item.currentStock}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{item.threshold}</td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                {typeof item.unitPrice === 'number' ? `Rs ${item.unitPrice.toFixed(2)}` : item.price}
                            </td>
                            <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    item.isActive !== false && item.status !== 'Inactive' && item.status !== 'discontinued'
                                    ? 'bg-green-100 text-green-700' 
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                    {item.isActive !== false && item.status !== 'Inactive' && item.status !== 'discontinued' ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => onEdit(item)}
                                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                                        title="Edit Item"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={() => onDelete(item)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                                        title="Delete Item"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ItemsTable;