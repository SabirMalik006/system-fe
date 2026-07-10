import React, { useState, useRef } from 'react';
import { itemsAPI } from '../../../services/api';
import toast from 'react-hot-toast';

const LineItems = () => {
    const [items, setItems] = useState([]);
    const [showBarcode, setShowBarcode] = useState(false);
    const [barcode, setBarcode] = useState('');
    const [scanning, setScanning] = useState(false);
    const fileInputRef = useRef(null);

    const handleScanBarcode = async () => {
        if (!barcode.trim()) return;
        setScanning(true);
        try {
            const res = await itemsAPI.getItems(1, 100);
            if (res.data.success) {
                const found = res.data.items.find(
                    item => item.barcode && item.barcode.toLowerCase() === barcode.trim().toLowerCase()
                );
                if (found) {
                    if (!items.find(i => i.id === found.id)) {
                        setItems(prev => [...prev, { ...found, qty: 1, id: found.id || found._id }]);
                        toast.success(`Added: ${found.name}`);
                    } else {
                        toast.error('Item already in list');
                    }
                    setBarcode('');
                    setShowBarcode(false);
                } else {
                    toast.error('No item found with this barcode');
                }
            }
        } catch (err) {
            toast.error('Failed to scan barcode');
        } finally {
            setScanning(false);
        }
    };

    const handleImportCSV = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const text = evt.target?.result;
                if (typeof text !== 'string') return;
                const lines = text.split('\n').filter(Boolean);
                const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
                const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('item'));
                const qtyIdx = headers.findIndex(h => h.includes('qty') || h.includes('quantity'));
                const skuIdx = headers.findIndex(h => h.includes('sku') || h.includes('code'));

                const imported = [];
                for (let i = 1; i < lines.length; i++) {
                    const cols = lines[i].split(',').map(c => c.trim());
                    if (cols.length >= 2) {
                        imported.push({
                            name: nameIdx >= 0 ? cols[nameIdx] : `Item ${i}`,
                            qty: qtyIdx >= 0 ? parseInt(cols[qtyIdx]) || 1 : 1,
                            sku: skuIdx >= 0 ? cols[skuIdx] : '',
                            id: Date.now() + i,
                        });
                    }
                }
                if (imported.length > 0) {
                    setItems(prev => [...prev, ...imported]);
                    toast.success(`Imported ${imported.length} items`);
                } else {
                    toast.error('No valid items found in CSV');
                }
            } catch {
                toast.error('Failed to parse CSV file');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const removeItem = (id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#2B8CEE]">Line Items</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowBarcode(!showBarcode)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#475569] border border-[#E2E8F0] rounded-sm hover:bg-gray-50 transition-colors font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Scan Barcode
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#475569] border border-[#E2E8F0] rounded-sm hover:bg-gray-50 transition-colors font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Import CSV
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleImportCSV}
                        className="hidden"
                    />
                </div>
            </div>

            {showBarcode && (
                <div className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={barcode}
                        onChange={(e) => setBarcode(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleScanBarcode()}
                        placeholder="Scan or enter barcode..."
                        className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0]"
                        autoFocus
                    />
                    <button
                        onClick={handleScanBarcode}
                        disabled={scanning}
                        className="px-4 py-2 text-sm text-white bg-[#1E4D7B] rounded-lg hover:bg-[#0B4E89] disabled:opacity-50"
                    >
                        {scanning ? 'Searching...' : 'Find'}
                    </button>
                </div>
            )}

            {items.length > 0 ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 text-left">
                                <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">Item</th>
                                <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase">SKU</th>
                                <th className="px-3 py-2 text-xs font-medium text-gray-500 uppercase w-20">Qty</th>
                                <th className="px-3 py-2 w-10" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-3 py-2 text-gray-900 font-medium">{item.name}</td>
                                    <td className="px-3 py-2 text-gray-500">{item.sku || '-'}</td>
                                    <td className="px-3 py-2">{item.qty}</td>
                                    <td className="px-3 py-2">
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-sm text-gray-500">Add items by scanning barcode or manual selection</p>
                </div>
            )}
        </div>
    );
};

export default LineItems;
