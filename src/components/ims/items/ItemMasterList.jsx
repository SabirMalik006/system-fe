import React, { useState, useRef, useEffect } from 'react';
import SearchBar from '../../common/SearchBar';
import Button from '../../common/Button';
import ItemsTable from './ItemsTable';
import ItemsPagination from './ItemsPagination';
import StatsCircles from './StatsCircles';
import Footer from '../../common/fotter';
import { itemsAPI } from '../../../services/api';
import { exportToCSV } from '../../../utils/exportUtils';
import { Download } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ItemMasterList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showBarcodeModal, setShowBarcodeModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedBarcodeItem, setSelectedBarcodeItem] = useState(null);
    
    // Form states
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: 'Plumbing',
        unit: 'Piece',
        minimumStock: '',
        currentStock: '',
        threshold: '',
        unitPrice: '',
        description: '',
        barcode: '',
        isActive: true
    });
    
    const modalRef = useRef(null);

    // Fetch items on page load, filter, page change, or refresh trigger
    useEffect(() => {
        fetchItems();
    }, [currentPage, activeFilter, refreshTrigger]);

    const fetchItems = async () => {
        setLoading(true);
        try {
            let statusFilter = 'all';
            if (activeFilter === 'instock') statusFilter = 'instock';
            if (activeFilter === 'discontinued') statusFilter = 'discontinued';
            
            const response = await itemsAPI.getItems(currentPage, 8, searchTerm, statusFilter);
            setItems(response.data.items || []);
            setTotalPages(response.data.pagination?.pages || 1);
            setTotalRecords(response.data.pagination?.total || 0);
        } catch (error) {
            console.error('Failed to fetch items:', error);
        } finally {
            setLoading(false);
        }
    };

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowCreateModal(false);
                setShowEditModal(false);
                setShowDeleteModal(false);
                setShowBarcodeModal(false);
            }
        };

        if (showCreateModal || showEditModal || showDeleteModal || showBarcodeModal) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [showCreateModal, showEditModal, showDeleteModal, showBarcodeModal]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Create new item
    const handleCreateItem = async () => {
        if (!formData.name?.trim()) {
            toast.error("Item name is required");
            return;
        }
        const minStock = parseInt(formData.minimumStock);
        const stock = parseInt(formData.currentStock);
        const thresh = parseInt(formData.threshold);
        const price = parseFloat(formData.unitPrice);
        if (minStock <= 0) {
            toast.error("Minimum Stock Level must be greater than 0");
            return;
        }
        if (thresh <= 0) {
            toast.error("Threshold must be greater than 0");
            return;
        }
        if (stock <= 0) {
            toast.error("Current Stock must be greater than 0");
            return;
        }
        if (price <= 0) {
            toast.error("Price must be greater than 0");
            return;
        }
        try {
            const newItem = {
                name: formData.name,
                sku: formData.sku,
                category: formData.category,
                unit: formData.unit,
                minimumStock: minStock,
                currentStock: stock,
                threshold: thresh,
                unitPrice: price,
                description: formData.description,
                barcode: formData.barcode,
                isActive: formData.isActive
            };
            
            await itemsAPI.createItem(newItem);
            setShowCreateModal(false);
            resetForm();
            setCurrentPage(1);
            setSearchTerm('');
            setActiveFilter('all');
            setRefreshTrigger(prev => prev + 1);
            toast.success('Item created successfully');
        } catch (error) {
            console.error('Failed to create item:', error);
            toast.error(error.response?.data?.message || 'Failed to create item');
        }
    };

    // Update item
    const handleUpdateItem = async () => {
        const minStock = parseInt(formData.minimumStock);
        const stock = parseInt(formData.currentStock);
        const thresh = parseInt(formData.threshold);
        const price = parseFloat(formData.unitPrice);
        if (minStock <= 0) {
            toast.error("Minimum Stock Level must be greater than 0");
            return;
        }
        if (thresh <= 0) {
            toast.error("Threshold must be greater than 0");
            return;
        }
        if (stock <= 0) {
            toast.error("Current Stock must be greater than 0");
            return;
        }
        if (price <= 0) {
            toast.error("Price must be greater than 0");
            return;
        }
        try {
            const updatedItem = {
                name: formData.name,
                category: formData.category,
                unit: formData.unit,
                minimumStock: minStock,
                currentStock: stock,
                threshold: thresh,
                unitPrice: price,
                description: formData.description,
                barcode: formData.barcode,
                isActive: formData.isActive
            };
            
            await itemsAPI.updateItem(selectedItem.id || selectedItem._id, updatedItem);
            setShowEditModal(false);
            resetForm();
            setRefreshTrigger(prev => prev + 1);
            toast.success('Item updated successfully');
        } catch (error) {
            console.error('Failed to update item:', error);
            toast.error(error.response?.data?.message || 'Failed to update item');
        }
    };

    // Delete item
    const handleDeleteItem = async () => {
        try {
            await itemsAPI.deleteItem(selectedItem.id || selectedItem._id);
            setShowDeleteModal(false);
            setSelectedItem(null);
            setRefreshTrigger(prev => prev + 1);
            toast.success('Item deleted successfully');
        } catch (error) {
            console.error('Failed to delete item:', error);
            toast.error(error.response?.data?.message || 'Failed to delete item');
        }
    };

    // Open edit modal with item data
    const openEditModal = (item) => {
        setSelectedItem(item);
        setFormData({
            name: item.name || '',
            sku: item.sku || '',
            category: item.category || 'Plumbing',
            unit: item.unit || 'Piece',
            minimumStock: item.minStock || item.minimumStock || '',
            currentStock: item.currentStock?.replace(/,/g, '') || item.currentStock || '',
            threshold: item.threshold || '',
            unitPrice: item.price?.replace('Rs ', '') || item.unitPrice || '',
            description: item.description || '',
            barcode: item.barcode || '',
            isActive: item.isActive !== undefined ? item.isActive : true
        });
        setShowEditModal(true);
    };

    // Open delete modal
    const openDeleteModal = (item) => {
        setSelectedItem(item);
        setShowDeleteModal(true);
    };

    // Open barcode view modal
    const handleViewBarcode = (item) => {
        setSelectedBarcodeItem(item);
        setShowBarcodeModal(true);
    };

    const handleExport = async () => {
        try {
            const res = await itemsAPI.exportItems();
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `items_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success('Items exported successfully');
        } catch (err) {
            toast.error('Failed to export items');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            name: '',
            sku: '',
            category: 'Plumbing',
            unit: 'Piece',
            minimumStock: '',
            currentStock: '',
            threshold: '',
            unitPrice: '',
            description: '',
            barcode: '',
            isActive: true
        });
        setSelectedItem(null);
    };

    // Generate item ID for display
    const generateItemId = (item) => {
        if (item.itemId) return item.itemId;
        return `TM-${item.sku || item._id?.slice(-6)}`;
    };

    return (
        <div className="bg-[#E8F4FF] min-h-screen flex flex-col justify-between">
            <Toaster position="top-right" />
            <div className="max-w-[2560px] w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex-1">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Item Master List</h1>
                    <Button
                        variant="primary"
                        icon="+"
                        onClick={() => setShowCreateModal(true)}
                        className="w-full sm:w-auto cursor-pointer"
                    >
                        New Items
                    </Button>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    {/* Search and Filter Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-100">
                        <div className="flex flex-1 max-w-2xl gap-3">
                            <SearchBar 
                                placeholder="Search or scan barcode..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onSearchClick={() => {
                                    setCurrentPage(1);
                                    fetchItems();
                                }}
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => { setActiveFilter('all'); setCurrentPage(1); }}
                                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${activeFilter === 'all'
                                        ? 'bg-[#1A8FA0] text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    All Items
                                </button>
                                <button
                                    onClick={() => { setActiveFilter('instock'); setCurrentPage(1); }}
                                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-l border-gray-200 transition-colors cursor-pointer ${activeFilter === 'instock'
                                        ? 'bg-[#1A8FA0] text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    In Stock
                                </button>
                                <button
                                    onClick={() => { setActiveFilter('discontinued'); setCurrentPage(1); }}
                                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-l border-gray-200 transition-colors cursor-pointer ${activeFilter === 'discontinued'
                                        ? 'bg-[#1A8FA0] text-white'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    Discontinued
                                </button>
                            </div>
                            <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 bg-[#1A8FA0] text-white text-xs font-semibold rounded-lg hover:bg-[#157a8a] transition-colors cursor-pointer">
                                <Download size={13} />
                                Export
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <ItemsTable 
                            items={items} 
                            loading={loading}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                            onViewBarcode={handleViewBarcode}
                        />
                    </div>
                    <ItemsPagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalRecords={totalRecords}
                        onPageChange={setCurrentPage}
                    />
                </div>

                <StatsCircles />
            </div>

            <Footer />

            {/* ==================== CREATE MODAL ==================== */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
                    <div ref={modalRef} className="bg-white rounded-sm w-full max-w-md shadow-xl overflow-hidden">
                        <div className="bg-white flex items-center justify-between px-4 py-2.5 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Create New Item</h2>
                            <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">×</button>
                        </div>

                        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
                            {/* Item Name */}
                            <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Item Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="e.g. Polyvinyl Distemper"
                                    className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#1A8FA0] text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* SKU */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">SKU</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        placeholder="e.g. WHT-001"
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#1A8FA0] text-xs"
                                    />
                                </div>

                                {/* Barcode */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Barcode</label>
                                    <div className="flex gap-1.5">
                                        <div className="relative border border-gray-300 rounded-sm focus-within:border-[#1A8FA0] flex-1">
                                            <input
                                                type="text"
                                                name="barcode"
                                                value={formData.barcode}
                                                onChange={handleInputChange}
                                                placeholder="Scan or enter"
                                                className="w-full px-2.5 py-1.5 pr-8 focus:outline-none text-xs rounded-sm"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                                                <img src="/Container (3).png" alt="barcode" className="h-3.5 w-3.5 object-contain opacity-70" />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const timestampPart = Date.now().toString().slice(-8);
                                                const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
                                                setFormData(prev => ({ ...prev, barcode: timestampPart + randomPart }));
                                            }}
                                            className="bg-[#1A8FA0] text-white px-2.5 py-1.5 rounded-sm text-[10px] font-medium hover:bg-[#137280] transition-colors cursor-pointer whitespace-nowrap shadow-sm"
                                            title="Generate Barcode"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Category */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#1A8FA0] text-xs"
                                    >
                                        <option>Plumbing</option>
                                        <option>Bathroom</option>
                                        <option>Lighting</option>
                                        <option>Electrical</option>
                                        <option>Hardware</option>
                                        <option>Tools</option>
                                    </select>
                                </div>

                                {/* Unit */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Unit of Measure</label>
                                    <select
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#1A8FA0] text-xs"
                                    >
                                        <option>Piece</option>
                                        <option>Set</option>
                                        <option>Box</option>
                                        <option>kg</option>
                                        <option>Meter</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Minimum Stock */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Minimum Stock Level</label>
                                    <input
                                        type="number"
                                        name="minimumStock"
                                        value={formData.minimumStock}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 50"
                                        min="1"
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none text-xs"
                                    />
                                </div>

                                {/* Threshold */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Threshold</label>
                                    <input
                                        type="number"
                                        name="threshold"
                                        value={formData.threshold}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 200"
                                        min="1"
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none text-xs"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Current Stock */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Current Stock</label>
                                    <input
                                        type="number"
                                        name="currentStock"
                                        value={formData.currentStock}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 1240"
                                        min="1"
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none text-xs"
                                    />
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Price (Rs)</label>
                                    <input
                                        type="number"
                                        name="unitPrice"
                                        value={formData.unitPrice}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 450"
                                        min="1"
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none text-xs"
                                    />
                                </div>
                            </div>

                            {/* Description and Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="2"
                                        placeholder="Optional description"
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none text-xs"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-2">Status</label>
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className={`relative w-8 h-4 rounded-full cursor-pointer transition-colors ${formData.isActive ? 'bg-[#2196F3]' : 'bg-gray-300'}`}
                                            onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                        >
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${formData.isActive ? 'right-0.5' : 'left-0.5'}`}></div>
                                        </div>
                                        <span className="text-[11px] font-medium text-gray-700">{formData.isActive ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 flex gap-2 px-4 py-2.5 border-t">
                            <button onClick={() => setShowCreateModal(false)} className="flex-1 py-1.5 border border-gray-300 rounded-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors text-xs cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleCreateItem} className="flex-1 py-1.5 bg-[#2196F3] text-white rounded-sm font-medium hover:bg-[#167a89] transition-colors text-xs cursor-pointer">
                                Create Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== EDIT MODAL ==================== */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
                    <div ref={modalRef} className="bg-white rounded-sm w-full max-w-md shadow-xl overflow-hidden">
                        <div className="bg-white flex items-center justify-between px-4 py-2.5 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Edit Item</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">×</button>
                        </div>

                        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
                            {/* Item ID (readonly) */}
                            <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Item ID</label>
                                <input
                                    type="text"
                                    value={selectedItem?.itemId || generateItemId(selectedItem)}
                                    readOnly
                                    className="w-full bg-[#F1F5F9] border border-gray-300 rounded-sm px-2.5 py-1.5 text-gray-700 text-xs"
                                />
                            </div>

                            {/* Item Name */}
                            <div>
                                <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Item Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#1A8FA0] text-xs"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* SKU */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">SKU</label>
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        placeholder="e.g. WHT-001"
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#1A8FA0] text-xs"
                                    />
                                </div>

                                {/* Barcode */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Barcode</label>
                                    <div className="relative border border-gray-300 rounded-sm focus-within:border-[#1A8FA0]">
                                        <input
                                            type="text"
                                            name="barcode"
                                            value={formData.barcode}
                                            onChange={handleInputChange}
                                            placeholder="Scan or enter barcode"
                                            className="w-full px-2.5 py-1.5 pr-16 focus:outline-none text-xs rounded-sm"
                                        />
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                            <img src="/Container (3).png" alt="barcode" className="h-3.5 w-3.5 object-contain cursor-pointer opacity-70 hover:opacity-100" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* Category */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Category</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#1A8FA0] text-xs"
                                    >
                                        <option>Plumbing</option>
                                        <option>Bathroom</option>
                                        <option>Lighting</option>
                                        <option>Electrical</option>
                                        <option>Hardware</option>
                                    </select>
                                </div>

                                {/* Unit */}
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Unit</label>
                                    <select
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-[#1A8FA0] text-xs"
                                    >
                                        <option>Piece</option>
                                        <option>Set</option>
                                        <option>Box</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Min Stock</label>
                                    <input type="number" name="minimumStock" value={formData.minimumStock} onChange={handleInputChange} className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-xs" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Threshold</label>
                                    <input type="number" name="threshold" value={formData.threshold} onChange={handleInputChange} className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-xs" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Current Stock</label>
                                    <input type="number" name="currentStock" value={formData.currentStock} onChange={handleInputChange} className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-xs" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Price (Rs)</label>
                                    <input type="number" name="unitPrice" value={formData.unitPrice} onChange={handleInputChange} className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 text-xs" />
                                </div>
                            </div>

                            {/* Description and Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-0.5">Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="2"
                                        placeholder="Optional description"
                                        className="w-full border border-gray-300 rounded-sm px-2.5 py-1.5 focus:outline-none text-xs"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-medium text-gray-700 mb-2">Status</label>
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className={`relative w-8 h-4 rounded-full cursor-pointer transition-colors ${formData.isActive ? 'bg-[#2196F3]' : 'bg-gray-300'}`}
                                            onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                        >
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${formData.isActive ? 'right-0.5' : 'left-0.5'}`}></div>
                                        </div>
                                        <span className="text-[11px] font-medium text-gray-700">{formData.isActive ? 'Active' : 'Inactive'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 flex gap-2 px-4 py-2.5 border-t">
                            <button onClick={() => setShowEditModal(false)} className="flex-1 py-1.5 border border-gray-300 rounded-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors text-xs cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleUpdateItem} className="flex-1 py-1.5 bg-[#2196F3] text-white rounded-sm font-medium hover:bg-[#167a89] transition-colors text-xs cursor-pointer">
                                Update Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== DELETE CONFIRMATION MODAL ==================== */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
                    <div ref={modalRef} className="bg-white rounded-sm w-full max-w-sm shadow-xl overflow-hidden">
                        <div className="bg-white flex items-center justify-between px-4 py-2.5 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
                            <button onClick={() => setShowDeleteModal(false)} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">×</button>
                        </div>

                        <div className="p-6 text-center">
                            <div className="text-red-500 mb-3">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <p className="text-gray-700 mb-2">Are you sure you want to delete this item?</p>
                            <p className="text-sm text-gray-500 font-medium">{selectedItem?.name}</p>
                            <p className="text-xs text-gray-400 mt-2">This action cannot be undone.</p>
                        </div>

                        <div className="bg-gray-50 flex gap-2 px-4 py-2.5 border-t">
                            <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-1.5 border border-gray-300 rounded-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors text-xs cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleDeleteItem} className="flex-1 py-1.5 bg-red-600 text-white rounded-sm font-medium hover:bg-red-700 transition-colors text-xs cursor-pointer">
                                Delete Item
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==================== BARCODE VIEW MODAL ==================== */}
            {showBarcodeModal && selectedBarcodeItem && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
                    <div ref={modalRef} className="bg-white rounded-xl w-full max-w-sm shadow-2xl overflow-hidden transform transition-all">
                        <div className="bg-gradient-to-r from-[#1E4D7B] to-[#2166A0] px-5 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Item Barcode</h2>
                            <button onClick={() => setShowBarcodeModal(false)} className="text-white/80 hover:text-white transition-colors cursor-pointer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div id="barcode-print-area" className="p-6 text-center bg-white flex flex-col items-center">
                            <div className="mb-4">
                                <h3 className="text-md font-semibold text-gray-800">{selectedBarcodeItem.name}</h3>
                                <p className="text-xs text-gray-500">SKU: {selectedBarcodeItem.sku}</p>
                            </div>
                            
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 w-full flex justify-center shadow-inner">
                                <img 
                                    src={`https://bwipjs-api.metafloor.com/?bcid=code128&text=${selectedBarcodeItem.barcode}&scale=3&includetext`} 
                                    alt={`Barcode for ${selectedBarcodeItem.barcode}`}
                                    className="max-w-full h-auto mix-blend-multiply"
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex gap-2 justify-end">
                            <button
                                onClick={() => {
                                    const printWin = window.open('', '_blank');
                                    printWin.document.write(`
                                        <html>
                                            <head>
                                                <title>Print Barcode</title>
                                                <style>
                                                    @media print {
                                                        @page { margin: 0; }
                                                        body { margin: 0; padding: 0; }
                                                    }
                                                    body { display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: white; font-family: sans-serif; }
                                                    .barcode-wrap { text-align: center; padding: 20px; }
                                                    .barcode-wrap img { max-width: 100%; height: auto; display: block; margin: 0 auto; }
                                                </style>
                                            </head>
                                            <body>
                                                <div class="barcode-wrap">
                                                    <img src="https://bwipjs-api.metafloor.com/?bcid=code128&text=${selectedBarcodeItem.barcode}&scale=5&includetext" />
                                                </div>
                                            </body>
                                        </html>
                                    `);
                                    printWin.document.close();
                                    printWin.focus();
                                    setTimeout(() => { printWin.print(); printWin.close(); }, 300);
                                }}
                                className="px-4 py-2 bg-[#1E4D7B] text-white rounded-lg text-sm font-medium hover:bg-[#163a5e] transition-colors shadow-sm cursor-pointer flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                </svg>
                                Print
                            </button>
                            <button 
                                onClick={() => setShowBarcodeModal(false)} 
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemMasterList;