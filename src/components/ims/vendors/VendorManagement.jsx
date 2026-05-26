import React, { useState, useRef, useEffect } from 'react';
import SearchBar from '../../common/SearchBar';
import Button from '../../common/Button';
import VendorStats from './VendorStats';
import VendorTable from './VendorTable';
import VendorPerformance from './VendorPerformance';
import Footer from '../../common/fotter';
import VendorProfilePanel from "./VendorProfilePanel";
import { vendorsAPI } from '../../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const VendorManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddVendor, setShowAddVendor] = useState(false);
    const [showEditVendor, setShowEditVendor] = useState(false);
    const [showDeleteVendor, setShowDeleteVendor] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [vendorToEdit, setVendorToEdit] = useState(null);
    const [showProfilePanel, setShowProfilePanel] = useState(false);
    
    // API states
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 8, total: 0, pages: 1 });
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        vendorId: 'VND-',
        shippingItems: '',
        totalOrders: '',
        onTimePercentage: '',
        rating: '',
        status: 'Active'
    });

    const modalRef = useRef(null);
    const panelRef = useRef(null);

    const fetchVendors = async (page = pagination.page) => {
        try {
            setLoading(true);
            const res = await vendorsAPI.getVendors(page, pagination.limit, searchTerm);
            if (res.data.success) {
                setVendors(res.data.vendors);
                setPagination(res.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast.error('Failed to load vendors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.page, searchTerm]);

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowAddVendor(false);
                setShowEditVendor(false);
                setShowDeleteVendor(false);
            }
        };

        if (showAddVendor || showEditVendor || showDeleteVendor) {
            document.addEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.body.style.overflow = 'unset';
        };
    }, [showAddVendor, showEditVendor, showDeleteVendor]);

    // Close profile panel when clicking outside
    useEffect(() => {
        const handleClickOutsidePanel = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setShowProfilePanel(false);
                setSelectedVendor(null);
            }
        };

        if (showProfilePanel) {
            document.addEventListener('mousedown', handleClickOutsidePanel);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutsidePanel);
        };
    }, [showProfilePanel]);

    const handleVendorClick = (vendor) => {
        setSelectedVendor(vendor);
        setShowProfilePanel(true);
    };

    const handleClosePanel = () => {
        setShowProfilePanel(false);
        setSelectedVendor(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            vendorId: 'VND-',
            shippingItems: '',
            totalOrders: '',
            onTimePercentage: '',
            rating: '',
            status: 'Active'
        });
    };

    const handleOpenEdit = (vendor) => {
        setVendorToEdit(vendor);
        setFormData({
            name: vendor.name || '',
            vendorId: vendor.vendorId || vendor.id || 'VND-',
            shippingItems: vendor.shippingItems || '',
            totalOrders: vendor.totalOrders || '',
            onTimePercentage: vendor.onTimePercentage || vendor.onTime || '',
            rating: vendor.rating || '',
            status: vendor.status || 'Active'
        });
        setShowEditVendor(true);
    };

    const handleOpenDelete = (vendor) => {
        setVendorToEdit(vendor);
        setShowDeleteVendor(true);
    };

    const handleSaveVendor = async () => {
        try {
            if (!formData.name || !formData.vendorId) {
                toast.error('Name and Vendor ID are required');
                return;
            }

            const payload = {
                ...formData,
                totalOrders: Number(formData.totalOrders) || 0,
                onTimePercentage: Number(formData.onTimePercentage) || 0,
                rating: Number(formData.rating) || 0,
            };

            const res = await vendorsAPI.createVendor(payload);
            
            if (res.data.success) {
                toast.success('Vendor added successfully');
                setShowAddVendor(false);
                resetForm();
                fetchVendors(1);
            }
        } catch (error) {
            console.error('Error creating vendor:', error);
            toast.error(error.response?.data?.message || 'Failed to add vendor');
        }
    };

    const handleUpdateVendor = async () => {
        try {
            if (!formData.name || !formData.vendorId) {
                toast.error('Name and Vendor ID are required');
                return;
            }

            const payload = {
                ...formData,
                totalOrders: Number(formData.totalOrders) || 0,
                onTimePercentage: Number(formData.onTimePercentage) || 0,
                rating: Number(formData.rating) || 0,
            };

            const res = await vendorsAPI.updateVendor(vendorToEdit._id || vendorToEdit.id, payload);
            
            if (res.data.success) {
                toast.success('Vendor updated successfully');
                setShowEditVendor(false);
                setVendorToEdit(null);
                resetForm();
                fetchVendors(pagination.page);
            }
        } catch (error) {
            console.error('Error updating vendor:', error);
            toast.error(error.response?.data?.message || 'Failed to update vendor');
        }
    };

    const handleDeleteVendor = async () => {
        try {
            const res = await vendorsAPI.deleteVendor(vendorToEdit._id || vendorToEdit.id);
            if (res.data.success) {
                toast.success('Vendor deleted successfully');
                setShowDeleteVendor(false);
                setVendorToEdit(null);
                fetchVendors(pagination.page);
            }
        } catch (error) {
            console.error('Error deleting vendor:', error);
            toast.error(error.response?.data?.message || 'Failed to delete vendor');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    return (
        <div className="max-w-[2560px] mx-auto bg-[#F9FAFB] ">
            <Toaster position="top-right" />
            <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Vendor Management</h1>
                    <Button
                        variant="primary"
                        icon="+"
                        onClick={() => setShowAddVendor(true)}
                        className="w-full sm:w-auto bg-gradient-to-t from-[#1E4D7B] to-[#1E4D7B]"
                    >
                        Add Vendor
                    </Button>
                </div>

                {/* Main Content */}
                <div className="space-y-6">
                    <VendorStats vendors={vendors} />
                    <div className="flex items-center justify-between">
                        <SearchBar 
                            placeholder="Search vendors..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto min-h-[300px]">
                            {loading ? (
                                <div className="flex items-center justify-center h-48">
                                    <div className="animate-pulse text-gray-500">Loading vendors...</div>
                                </div>
                            ) : vendors.length === 0 ? (
                                <div className="flex items-center justify-center h-48 text-gray-500">
                                    No vendors found. Add a new vendor to get started.
                                </div>
                            ) : (
                                <VendorTable
                                    vendors={vendors}
                                    onVendorClick={handleVendorClick}
                                    onEdit={handleOpenEdit}
                                    onDelete={handleOpenDelete}
                                />
                            )}
                        </div>
                        <div className="px-4 py-3 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-gray-200">
                            <span className="text-sm text-gray-600 text-center sm:text-left">
                                Showing {vendors.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} vendors
                            </span>
                            <div className="flex items-center justify-center gap-2">
                                <button 
                                    onClick={() => handlePageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-200 disabled:opacity-50"
                                >
                                    ←
                                </button>
                                {[...Array(pagination.pages)].map((_, i) => (
                                    <button 
                                        key={i + 1}
                                        onClick={() => handlePageChange(i + 1)}
                                        className={`px-3 py-1 text-sm rounded ${pagination.page === i + 1 ? 'text-white bg-[#1A8FA0]' : 'text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => handlePageChange(pagination.page + 1)}
                                    disabled={pagination.page === pagination.pages}
                                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded border border-gray-200 disabled:opacity-50"
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    </div>
                    <VendorPerformance />
                </div>
            </div>

            <Footer />

            {/* Vendor Profile Panel */}
            {showProfilePanel && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div ref={panelRef}>
                        <VendorProfilePanel onClose={handleClosePanel} vendor={selectedVendor} />
                    </div>
                </div>
            )}

            {/* ADD NEW VENDOR MODAL */}
            {showAddVendor && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        ref={modalRef}
                        className="bg-[#1E4D7B] text-white rounded-sm w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl custom-scroll"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-[#1E4D7B] border-b border-white/20 p-4 sm:p-5 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold">Add New Vendor</h2>
                                <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5">Register a new supplier in the system</p>
                            </div>
                            <button
                                onClick={() => setShowAddVendor(false)}
                                className="text-xl leading-none text-blue-200 hover:text-white transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-4 sm:p-5 space-y-6">
                            {/* NAME */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">NAME</h3>
                                <div>
                                    <label className="text-[11px] sm:text-xs text-blue-200 mb-1 block">Vendor Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Gridel Logistics Co."
                                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-sm px-3 py-2 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* VENDOR ID */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">VENDOR ID</h3>
                                <div>
                                    <div className="flex border border-gray-300 rounded-sm overflow-hidden bg-white">
                                        <input
                                            type="text"
                                            name="vendorId"
                                            value={formData.vendorId}
                                            onChange={handleInputChange}
                                            className="flex-1 bg-white text-gray-800 px-3 py-2 text-xs sm:text-sm focus:outline-none"
                                        />
                                        <button className="bg-gray-100 px-3 text-gray-600 text-xs border-l border-gray-300 hover:bg-gray-200" title="Generate ID" onClick={() => setFormData(prev => ({...prev, vendorId: 'VND-' + Math.floor(1000 + Math.random() * 9000)}))}>
                                            🔗
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* SHIPPING ITEMS */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">SHIPPING ITEMS</h3>
                                <select 
                                    name="shippingItems"
                                    value={formData.shippingItems}
                                    onChange={handleInputChange}
                                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-sm px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Select Shipping Items</option>
                                    <option value="SUPPORTING">SUPPORTING</option>
                                    <option value="SUPPLIES">SUPPLIES</option>
                                    <option value="CONTRACTS">CONTRACTS</option>
                                    <option value="SOFTWARE">SOFTWARE</option>
                                    <option value="INVENTORY">INVENTORY</option>
                                    <option value="MANUFACTURING">MANUFACTURING</option>
                                </select>
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* TOTAL ORDERS */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">TOTAL ORDERS</h3>
                                <input
                                    type="number"
                                    name="totalOrders"
                                    value={formData.totalOrders}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 482"
                                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-sm px-3 py-2 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* ON-TIME % */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">ON-TIME %</h3>
                                <input
                                    type="number"
                                    name="onTimePercentage"
                                    value={formData.onTimePercentage}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 100"
                                    max="100"
                                    min="0"
                                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-sm px-3 py-2 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* RATING */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">RATING</h3>
                                <div className="space-y-2">
                                    <div className="text-[11px] sm:text-xs text-blue-200 mb-1.5">Select Rating (0 - 5)</div>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                                className={`text-2xl hover:scale-110 transition-transform ${Number(formData.rating) >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        placeholder="Custom rating (e.g., 4.8)"
                                        step="0.1"
                                        max="5"
                                        min="0"
                                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-sm px-3 py-2 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 mt-2"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* STATUS */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">STATUS</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/15">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Active"
                                            checked={formData.status === 'Active'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-emerald-500"
                                        />
                                        <span className="text-xs sm:text-sm text-white">Active</span>
                                        <span className="ml-auto bg-emerald-500 text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full">Recommended</span>
                                    </label>

                                    <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/10">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Inactive"
                                            checked={formData.status === 'Inactive'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-gray-500"
                                        />
                                        <span className="text-xs sm:text-sm text-gray-300">Inactive</span>
                                    </label>

                                    <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/10">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Blacklisted"
                                            checked={formData.status === 'Blacklisted'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-red-500"
                                        />
                                        <span className="text-xs sm:text-sm text-gray-300">Blacklisted</span>
                                        <span className="ml-auto bg-red-500 text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full">Restricted</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="sticky bottom-0 bg-[#1E4D7B] border-t border-white/20 p-4 sm:p-5 flex gap-3 z-10">
                            <button
                                onClick={() => { setShowAddVendor(false); resetForm(); }}
                                className="flex-1 py-2.5 border border-white/30 text-white rounded-sm hover:bg-white/10 transition-colors text-xs sm:text-sm font-medium cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveVendor}
                                className="flex-1 py-2.5 bg-[#0D9488] hover:bg-teal-700 text-white rounded-sm font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                            >
                                Save Vendor
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT VENDOR MODAL */}
            {showEditVendor && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div
                        ref={modalRef}
                        className="bg-[#1E4D7B] text-white rounded-sm w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl custom-scroll"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-[#1E4D7B] border-b border-white/20 p-4 sm:p-5 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold">Edit Vendor</h2>
                                <p className="text-[10px] sm:text-xs text-blue-200 mt-0.5">Update supplier information</p>
                            </div>
                            <button
                                onClick={() => { setShowEditVendor(false); resetForm(); }}
                                className="text-xl leading-none text-blue-200 hover:text-white transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-4 sm:p-5 space-y-6">
                            {/* NAME */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">NAME</h3>
                                <div>
                                    <label className="text-[11px] sm:text-xs text-blue-200 mb-1 block">Vendor Name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Gridel Logistics Co."
                                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-sm px-3 py-2 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* VENDOR ID */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">VENDOR ID</h3>
                                <div>
                                    <div className="flex border border-gray-300 rounded-sm overflow-hidden bg-white">
                                        <input
                                            type="text"
                                            name="vendorId"
                                            value={formData.vendorId}
                                            onChange={handleInputChange}
                                            className="flex-1 bg-white text-gray-800 px-3 py-2 text-xs sm:text-sm focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* SHIPPING ITEMS */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">SHIPPING ITEMS</h3>
                                <select 
                                    name="shippingItems"
                                    value={formData.shippingItems}
                                    onChange={handleInputChange}
                                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-sm px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Select Shipping Items</option>
                                    <option value="SUPPORTING">SUPPORTING</option>
                                    <option value="SUPPLIES">SUPPLIES</option>
                                    <option value="CONTRACTS">CONTRACTS</option>
                                    <option value="SOFTWARE">SOFTWARE</option>
                                    <option value="INVENTORY">INVENTORY</option>
                                    <option value="MANUFACTURING">MANUFACTURING</option>
                                </select>
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* TOTAL ORDERS */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">TOTAL ORDERS</h3>
                                <input
                                    type="number"
                                    name="totalOrders"
                                    value={formData.totalOrders}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 482"
                                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-sm px-3 py-2 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* ON-TIME % */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">ON-TIME %</h3>
                                <input
                                    type="number"
                                    name="onTimePercentage"
                                    value={formData.onTimePercentage}
                                    onChange={handleInputChange}
                                    placeholder="e.g., 100"
                                    max="100"
                                    min="0"
                                    className="w-full bg-white text-gray-800 border border-gray-300 rounded-sm px-3 py-2 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* RATING */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">RATING</h3>
                                <div className="space-y-2">
                                    <div className="text-[11px] sm:text-xs text-blue-200 mb-1.5">Select Rating (0 - 5)</div>
                                    <div className="flex flex-wrap gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                                className={`text-2xl hover:scale-110 transition-transform ${Number(formData.rating) >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    <input
                                        type="number"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleInputChange}
                                        placeholder="Custom rating (e.g., 4.8)"
                                        step="0.1"
                                        max="5"
                                        min="0"
                                        className="w-full bg-white text-gray-800 border border-gray-300 rounded-sm px-3 py-2 text-xs sm:text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500 mt-2"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-white/20"></div>

                            {/* STATUS */}
                            <div>
                                <h3 className="uppercase text-[9px] sm:text-[10px] font-semibold tracking-wider text-blue-200 mb-3">STATUS</h3>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/15">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Active"
                                            checked={formData.status === 'Active'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-emerald-500"
                                        />
                                        <span className="text-xs sm:text-sm text-white">Active</span>
                                        <span className="ml-auto bg-emerald-500 text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full">Recommended</span>
                                    </label>

                                    <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/10">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Inactive"
                                            checked={formData.status === 'Inactive'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-gray-500"
                                        />
                                        <span className="text-xs sm:text-sm text-gray-300">Inactive</span>
                                    </label>

                                    <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-white/10">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Blacklisted"
                                            checked={formData.status === 'Blacklisted'}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 accent-red-500"
                                        />
                                        <span className="text-xs sm:text-sm text-gray-300">Blacklisted</span>
                                        <span className="ml-auto bg-red-500 text-white text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full">Restricted</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="sticky bottom-0 bg-[#1E4D7B] border-t border-white/20 p-4 sm:p-5 flex gap-3 z-10">
                            <button
                                onClick={() => { setShowEditVendor(false); resetForm(); }}
                                className="flex-1 py-2.5 border border-white/30 text-white rounded-sm hover:bg-white/10 transition-colors text-xs sm:text-sm font-medium cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleUpdateVendor}
                                className="flex-1 py-2.5 bg-[#0D9488] hover:bg-teal-700 text-white rounded-sm font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                            >
                                Update Vendor
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteVendor && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div ref={modalRef} className="bg-white rounded-sm w-full max-w-sm shadow-xl overflow-hidden">
                        <div className="bg-white flex items-center justify-between px-4 py-2.5 border-b">
                            <h2 className="text-lg font-semibold text-gray-800">Confirm Delete</h2>
                            <button onClick={() => setShowDeleteVendor(false)} className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer">×</button>
                        </div>

                        <div className="p-6 text-center">
                            <div className="text-red-500 mb-3">
                                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <p className="text-gray-700 mb-2">Are you sure you want to delete this vendor?</p>
                            <p className="text-sm text-gray-500 font-medium">{vendorToEdit?.name}</p>
                            <p className="text-xs text-gray-400 mt-2">This action cannot be undone.</p>
                        </div>

                        <div className="bg-gray-50 flex gap-2 px-4 py-2.5 border-t">
                            <button onClick={() => setShowDeleteVendor(false)} className="flex-1 py-1.5 border border-gray-300 rounded-sm text-gray-700 font-medium hover:bg-gray-100 transition-colors text-xs cursor-pointer">
                                Cancel
                            </button>
                            <button onClick={handleDeleteVendor} className="flex-1 py-1.5 bg-red-600 text-white rounded-sm font-medium hover:bg-red-700 transition-colors text-xs cursor-pointer">
                                Delete Vendor
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorManagement;