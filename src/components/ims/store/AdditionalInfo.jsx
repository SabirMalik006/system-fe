import React, { useState, useEffect } from 'react';
import { vendorsAPI } from '../../../services/api';

const AdditionalInfo = ({ formData, setFormData }) => {
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await vendorsAPI.getVendors(1, 100);
                if (response.data.success) {
                    setVendors(response.data.vendors);
                }
            } catch (error) {
                console.error("Error fetching vendors:", error);
            }
        };
        fetchVendors();
    }, []);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-[#2B8CEE] mb-4 uppercase">Additional Information</h2>

            <div className="space-y-4">
                {/* Vendor */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block uppercase">VENDOR (OPTIONAL)</label>
                    <select 
                        value={formData.issuedTo}
                        onChange={(e) => setFormData({ ...formData, issuedTo: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
                    >
                        <option value="">Select a vendor...</option>
                        {vendors.map(v => (
                            <option key={v._id} value={v.name}>{v.name}</option>
                        ))}
                    </select>
                </div>

                {/* Invoice Number */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block uppercase">INVOICE NUMBER / P.O. # (OPTIONAL)</label>
                    <input
                        type="text"
                        value={formData.referenceId}
                        onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                        placeholder="e.g. INV-2024-001"
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white"
                    />
                </div>

                {/* Notes */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block uppercase">NOTES / COMMENTS (OPTIONAL)</label>
                    <textarea
                        rows="3"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Add any additional notes about this receipt..."
                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A8FA0] bg-white resize-none"
                    />
                </div>
            </div>
        </div>
    );
};

export default AdditionalInfo;