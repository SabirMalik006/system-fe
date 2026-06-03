import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../common/fotter";
import { itemsAPI, stockOutAPI } from "../../../services/api";

const StockOutEntry = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  const [formData, setFormData] = useState({
    itemId: "",
    quantity: 0,
    purpose: "",
    department: "Main Warehouse",
    issuedTo: "",
    approver: "",
    confirmPolicy: false
  });

  const [stats, setStats] = useState({
    totalIssuances: 0,
    pendingApprovals: 0,
    amountToTake: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await stockOutAPI.getPendingApproved();
        if (response.data.success) {
          setStats({
            totalIssuances: response.data.data.total || 0,
            pendingApprovals: response.data.data.pending?.count || 0,
            amountToTake: 0 // Placeholder
          });
        }
      } catch (error) { // Error fetching stock out stats
        console.error("Error fetching stock out stats:", error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.length >= 2) {
        handleSearch();
      } else {
        setItems([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearch = async () => {
    setSearchLoading(true);
    try {
      const response = await itemsAPI.getItems(1, 10, searchTerm);
      if (response.data.success) {
        setItems(response.data.items);
        setShowResults(true);
      }
    } catch (error) {
      console.error("Error searching items:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const selectItem = (item) => {
    setSelectedItem(item);
    setFormData({ ...formData, itemId: item._id });
    setSearchTerm(item.name);
    setShowResults(false);
  };

  const handleQuantityChange = (val) => {
    const qty = parseInt(val) || 0;
    setFormData({ ...formData, quantity: qty });
  };

  const handleSubmit = async () => {
    if (!formData.itemId || formData.quantity <= 0 || !formData.issuedTo || !formData.confirmPolicy) {
      alert("Please fill all required fields and confirm policy.");
      return;
    }

    if (formData.quantity > (selectedItem?.stock || 0)) {
      alert("Insufficient stock available.");
      return;
    }

    setLoading(true);
    try {
      const response = await stockOutAPI.createTransaction({
        itemId: formData.itemId,
        quantity: formData.quantity,
        department: formData.department,
        issuedTo: formData.issuedTo,
        notes: formData.purpose,
        reference: 'stock_out',
        status: 'POSTED'
      });

      if (response.data.success) {
        alert("Stock out recorded successfully!");
        navigate("/stock-issuance");
      }
    } catch (error) {
      console.error("Error creating stock out:", error);
      alert(error.response?.data?.message || "Failed to record stock out.");
    } finally {
      setLoading(false);
    }
  };

  const stockAfter = selectedItem ? selectedItem.stock - formData.quantity : 0;

  return (
    <div className=" max-w-[2560px] mx-auto bg-[#E8F4FF]">
      {/* Header */}
      <div className="pt-6 px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Stock Out Entry{" "}
          <span className="text-lg font-normal text-[#94A3B8]">
            (Item Issuance)
          </span>
        </h1>
        <p className="text-md text-[#64748B]">
          Create a new issuance record for items leaving the warehouse.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 p-6">
        {/* Main Form - Left Side (2 columns) */}
        <div className="col-span-2 space-y-6">
          {/* Required Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4 uppercase">
              Required Information
            </h2>

            {/* Item Issued */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 mb-1 block uppercase">
                ITEM ISSUED
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
                  placeholder="Search item name or SKU"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]"
                />
                <span className="absolute right-3 top-2 text-gray-400">
                  {searchLoading ? "⏳" : "🔍"}
                </span>
                
                {showResults && items.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => selectItem(item)}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-0"
                      >
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-gray-500">SKU: {item.sku} | Stock: {item.stock}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quantity with Stock Warning */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700 uppercase">
                  QUANTITY*
                </label>
                {selectedItem && (
                  <span className="text-xs text-gray-500 uppercase">
                    Stock after issue:{" "}
                    <span className={`${stockAfter < 0 ? 'text-red-500' : 'text-green-500'} font-medium`}>
                      {stockAfter}
                    </span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleQuantityChange(formData.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="w-24 px-3 py-1.5 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]"
                />
                <button 
                  onClick={() => handleQuantityChange(formData.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              {selectedItem && formData.quantity > selectedItem.stock && (
                <div className="mt-2 text-xs text-red-500">
                  Requested quantity exceeds available stock. Available stock: {selectedItem.stock}
                </div>
              )}
            </div>

            {/* Purpose and Unit */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block uppercase">
                  PURPOSE OF ISSUANCE
                </label>
                <input 
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]" 
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block uppercase">
                  ISSUING UNIT/DEPARTMENT
                </label>
                <select 
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]"
                >
                  <option>Main Warehouse</option>
                  <option>Secondary Warehouse</option>
                  <option>Regional Hub A</option>
                </select>
              </div>
            </div>

            {/* Issuing User and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block uppercase">
                  ISSUING USER
                </label>
                <input
                  type="text"
                  value="Current User"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block uppercase">
                  DATE & TIME
                </label>
                <input
                  type="text"
                  value={new Date().toLocaleString()}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Recipient Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4 uppercase">
              Recipient Information
            </h2>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block uppercase">
                PERSONNEL (RECIPIENT)
              </label>
              <input
                type="text"
                value={formData.issuedTo}
                onChange={(e) => setFormData({ ...formData, issuedTo: e.target.value })}
                placeholder="Type staff name or ID..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]"
              />
            </div>
          </div>

          {/* Approval & Verification Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4 uppercase">
              Approval & Verification
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block uppercase">
                  APPROVING AUTHORITY
                </label>
                <select 
                  value={formData.approver}
                  onChange={(e) => setFormData({ ...formData, approver: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-[#1A8FA0]"
                >
                  <option value="">Select Supervisor...</option>
                  <option>John Doe (Director)</option>
                  <option>Jane Smith (Manager)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block uppercase">
                  CURRENT STATUS
                </label>
                <input
                  type="text"
                  value="Draft"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                  readOnly
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="policyCheck"
                checked={formData.confirmPolicy}
                onChange={(e) => setFormData({ ...formData, confirmPolicy: e.target.checked })}
                className="rounded border-gray-300 text-[#1A8FA0] focus:ring-[#1A8FA0]"
              />
              <label htmlFor="policyCheck" className="text-sm text-gray-600">
                I confirm that this issuance complies with company policy.
              </label>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button 
                onClick={() => navigate(-1)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-sm text-white bg-[#1A8FA0] rounded-md hover:bg-[#167a89] disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm Issuance"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quick Insight (1 column) */}
        <div className="col-span-1 space-y-6 ">
          {/* Quick Insight Card */}
          <div className="bg-gradient-to-t from-[#1E4D7B] to-[#1A6FC4] rounded-lg border border-gray-200 p-6 text-white z-1 relative">
            <img
              src="/Vector.png"
              alt=""
              className="absolute top-0 right-0 z-0"
            />
            <div className="flex items-center gap-2 font-500">
              <img src="/f.png" alt="" className="pb-2" />
              <h2 className="text-md font-semibold  mb-3">Quick Insight</h2>
            </div>

            <div className="mb-4 z-2">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="">Current Stock:</span>
                <span className="font-medium z-1">{selectedItem ? selectedItem.stock : 0} Units</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="">Safety Threshold:</span>
                <span className="font-medium z-1 ">{selectedItem ? selectedItem.minStock : 0} Units</span>
              </div>
            </div>

            <p className="text-xs">
              * Stock availability projections based on current issuance path.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* TOTAL ISSUANCES */}
            <div className="bg-gradient-to-b from-[#3AA5B9] to-[#1E4F7A] rounded-lg border border-gray-200 p-2 py-3 px-4 text-white">
              <div className="flex items-center gap-2">
                <img src="/Overlay.png" alt="" className="h-11 w-11 mr-2" />
                <div>
                  <div className="text-xs uppercase">Total Issuances</div>
                  <div className="text-2xl font-light">{stats.totalIssuances}</div>
                </div>
              </div>
            </div>

            {/* PENDING APPROVALS */}
            <div className="bg-gradient-to-b from-[#3AA5B9] to-[#1E4F7A] rounded-lg border border-gray-200 p-2 py-3 px-4 text-white">
              <div className="flex items-center gap-2">
                <img
                  src="/Overlay (1).png "
                  alt=""
                  className="h-11 w-11 mr-2"
                />
                <div>
                  <div className="text-xs uppercase">Pending Approvals</div>
                  <div className="text-2xl font-light">{stats.pendingApprovals}</div>
                </div>
              </div>
            </div>

            {/* AMOUNT TO TAKE */}
            <div className="bg-gradient-to-b from-[#3AA5B9] to-[#1E4F7A] rounded-lg border border-gray-200 p-2 py-3 px-4 text-white">
              <div className="flex items-center gap-2">
                <img src="/Overlay (2).png" alt="" className="h-11 w-11 mr-2" />
                <div>
                  <div className="text-xs uppercase">Amount to Take</div>
                  <div className="text-2xl font-light">{stats.amountToTake}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StockOutEntry;
