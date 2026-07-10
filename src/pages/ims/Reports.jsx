import React, { useState, useEffect } from "react";
import Footer from "../../components/common/fotter";
import { reportsAPI } from "../../services/api";
import toast from "react-hot-toast";
import { exportToCSV } from "../../utils/exportUtils";
import { Download, Printer, ShoppingCart, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react";

const Reports = () => {
  const [selectedLog, setSelectedLog] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalLogs: 0,
    actionsToday: 0,
    criticalActions: 0,
    mostActiveModule: "N/A",
    mostActiveUser: "N/A",
  });
  const [procurement, setProcurement] = useState(null);
  const [procurementLoading, setProcurementLoading] = useState(true);

  // Pagination and filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLogs, setTotalLogsCount] = useState(0);
  const limit = 10;

  const [filters, setFilters] = useState({
    module: "",
    action: "",
    user: "",
    startDate: "",
    endDate: "",
    resource: "",
  });

  useEffect(() => {
    fetchStats();
    fetchLogs();
    fetchProcurement();
  }, [page, filters]);

  const fetchStats = async () => {
    try {
      const res = await reportsAPI.getStats();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  const fetchProcurement = async () => {
    try {
      setProcurementLoading(true);
      const res = await reportsAPI.getProcurementSummary();
      if (res.data.success) {
        setProcurement(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching procurement summary", error);
    } finally {
      setProcurementLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await reportsAPI.getLogs(
        page,
        limit,
        filters.module,
        filters.action,
        filters.user,
        filters.startDate,
        filters.endDate,
        filters.resource,
      );
      if (res.data.success) {
        setLogs(res.data.data);
        setTotalPages(res.data.pages);
        setTotalLogsCount(res.data.total);
      }
    } catch (error) {
      console.error("Error fetching logs", error);
    }
  };

  const statsData = [
    {
      label: "TOTAL LOG ENTRIES",
      value: stats.totalLogs.toLocaleString(),
      trend: "▲ Tracking active",
    },
    {
      label: "ACTIONS TODAY",
      value: stats.actionsToday.toLocaleString(),
      trend: "● Active now",
    },
    {
      label: "CRITICAL ACTIONS",
      value: stats.criticalActions.toLocaleString(),
      trend: "⚠ Needs review",
    },
    {
      label: "MOST ACTIVE MODULE",
      value: stats.mostActiveModule,
      trend: "SYSTEM METRIC",
    },
    {
      label: "MOST ACTIVE USER",
      value: stats.mostActiveUser,
      trend: "SYSTEM USER",
    },
  ];

  const getActionBadgeColor = (action) => {
    const colors = {
      CREATE: "bg-green-100 text-green-700 rounded-xl",
      UPDATE: "bg-blue-100 text-blue-700 rounded-xl",
      DELETE: "bg-red-100 text-red-700 rounded-xl",
      REJECT: "bg-orange-100 text-orange-700 rounded-xl",
      READ: "bg-purple-100 text-purple-700 rounded-xl",
    };
    return colors[action] || "bg-gray-100 text-gray-700";
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({ module: "", action: "", user: "", startDate: "", endDate: "", resource: "" });
    setPage(1);
  };

  const handleExport = () => {
    if (logs.length === 0) {
      toast.error("No logs to export");
      return;
    }

    const exportHeaders = [
      { label: "Timestamp", key: "createdAt" },
      { label: "User", key: "userName" },
      { label: "Action", key: "action" },
      { label: "Module", key: "module" },
      { label: "Resource", key: "resource" },
      { label: "Status", key: "status" },
      { label: "Details", key: "details" },
    ];

    exportToCSV(logs, exportHeaders, "audit_logs");
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
  };

  return (
    <div className="max-w-[2560px] mx-auto bg-[#C1DDF8] min-h-screen">
      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6 p-4 md:p-6">
        {statsData.map((stat, index) => {
          const leftColor =
            index === 2
              ? "#DC2626"
              : index === 4
                ? "#000000"
                : index === 3
                  ? "#94A3B8"
                  : "#2166A0";
          const trendColor =
            index >= 3
              ? "text-[#94A3B8]"
              : index === 2
                ? "text-[#DC2626]"
                : "text-[#10B981]";
          return (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm border-l-4"
              style={{ borderLeftColor: leftColor }}
            >
              <div className="text-xs font-medium text-gray-500 mb-1">
                {stat.label}
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className={`text-xs font-medium ${trendColor} mt-1`}>
                {stat.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* Procurement Overview */}
      {procurement && (
        <div className="mx-4 md:mx-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ShoppingCart size={16} className="text-[#1A8FA0]" />
            <h2 className="text-sm font-bold text-[#1A3A5C] uppercase tracking-wider">Procurement Overview</h2>
          </div>

          {/* Procurement stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 border-l-4" style={{ borderLeftColor: '#3B82F6' }}>
              <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Total Requests</div>
              <div className="text-xl font-bold text-gray-900 mt-0.5">{procurement.kpiStats.totalRequests}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 border-l-4" style={{ borderLeftColor: '#F59E0B' }}>
              <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Pending Approval</div>
              <div className="text-xl font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                {procurement.kpiStats.pendingApproval}
                <Clock size={14} className="text-amber-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 border-l-4" style={{ borderLeftColor: '#10B981' }}>
              <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Approved</div>
              <div className="text-xl font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                {procurement.kpiStats.approved}
                <CheckCircle size={14} className="text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 border-l-4" style={{ borderLeftColor: '#EF4444' }}>
              <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Rejected</div>
              <div className="text-xl font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                {procurement.kpiStats.rejected}
                <XCircle size={14} className="text-red-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-3.5 border-l-4" style={{ borderLeftColor: '#8B5CF6' }}>
              <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">Total PO Value</div>
              <div className="text-xl font-bold text-gray-900 mt-0.5 flex items-center gap-1.5">
                <DollarSign size={14} className="text-purple-500" />
                {(procurement.kpiStats.totalPOValue || 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Recent procurement requests table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Procurement Requests</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Request ID</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Unit</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {procurement.recentRequests && procurement.recentRequests.length > 0 ? (
                    procurement.recentRequests.map((req) => {
                      const statusColors = {
                        Draft: 'bg-gray-100 text-gray-600',
                        Pending: 'bg-amber-100 text-amber-700',
                        Approved: 'bg-green-100 text-green-700',
                        Rejected: 'bg-red-100 text-red-700',
                        Processing: 'bg-blue-100 text-blue-700',
                      };
                      const priorityColors = {
                        Low: 'text-gray-500',
                        Medium: 'text-amber-600',
                        High: 'text-red-600',
                      };
                      return (
                        <tr key={req._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="px-4 py-3 text-xs font-semibold text-gray-800">{req.requestId}</td>
                          <td className="px-4 py-3 text-xs text-gray-600">{req.requestingUnit}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold ${priorityColors[req.priority] || 'text-gray-500'}`}>
                              {req.priority}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded ${statusColors[req.status] || 'bg-gray-100 text-gray-600'}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs font-medium text-gray-700">Rs {req.total?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-6 text-center text-xs text-gray-400">No procurement requests found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Filters - Responsive */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 bg-white p-4 md:p-5 rounded-2xl border border-gray-200 shadow-sm mx-4 md:mx-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range */}
          <div className="flex items-center gap-2 bg-[#EAF1F3] rounded-md pl-3 py-2.5">
            <img src="/Icon.png" alt="date icon" className="w-4 h-4" />
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="text-sm text-[#334155] font-medium bg-transparent border-none focus:outline-none w-28"
              title="Start date"
            />
            <span className="text-[#334155]">-</span>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="text-sm text-[#334155] font-medium bg-transparent border-none focus:outline-none w-28"
              title="End date"
            />
          </div>

          {/* User */}
          <div className="flex items-center gap-2 bg-[#EAF1F3] rounded-md px-3 py-2.5">
            <img src="/Container.png" alt="user icon" className="w-4 h-4" />
            <input
              type="text"
              name="user"
              value={filters.user}
              onChange={handleFilterChange}
              placeholder="User ID or Name"
              className="text-sm text-[#334155] font-medium bg-transparent border-none focus:outline-none w-24"
            />
          </div>

          {/* Action Type */}
          <div className="flex items-center gap-2 bg-[#EAF1F3] rounded-md px-3 py-2.5">
            <img
              src="/Icon (1).png"
              alt="action type icon"
              className="w-4 h-4"
            />
            <select
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              className="text-sm text-[#334155] font-medium bg-transparent border-none focus:outline-none"
            >
              <option value="">All Actions</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="READ">READ</option>
              <option value="APPROVE">APPROVE</option>
              <option value="REJECT">REJECT</option>
              <option value="LOGIN">LOGIN</option>
            </select>
          </div>

          {/* Module */}
          <div className="flex items-center gap-2 bg-[#EAF1F3] rounded-md px-3 py-2.5">
            <img
              src="/Container (1).png"
              alt="module icon"
              className="w-4 h-4"
            />
            <select
              name="module"
              value={filters.module}
              onChange={handleFilterChange}
              className="text-sm text-[#334155] font-medium bg-transparent border-none focus:outline-none"
            >
              <option value="">All Modules</option>
              <option value="Inventory">Inventory</option>
              <option value="Sales">Sales</option>
              <option value="Vendors">Vendors</option>
              <option value="System">System</option>
              <option value="Approvals">Approvals</option>
              <option value="Purchases">Purchases</option>
              <option value="Returns">Returns</option>
            </select>
          </div>

          {/* Resource ID */}
          <div className="flex items-center gap-2 bg-[#EAF1F3] rounded-md px-3 py-2.5">
            <img src="/Icon (2).png" alt="resource icon" className="w-4 h-4" />
            <input
              type="text"
              name="resource"
              value={filters.resource}
              onChange={handleFilterChange}
              placeholder="Resource ID"
              className="text-sm text-[#334155] font-medium bg-transparent border-none focus:outline-none w-28"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Download size={16} />
            Export Logs
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Printer size={16} />
            Print
          </button>
          <button
            onClick={clearFilters}
            className="text-sm text-[#1A8FA0] hover:text-blue-800 font-medium cursor-pointer whitespace-nowrap"
          >
            Clear all filters
          </button>
        </div>
      </div>

      {/* Table and Details Panel */}
      <div className="flex flex-col xl:flex-row gap-4 p-4 md:p-6">
        {/* Actions Table - Desktop design exactly same rakha hai */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TIMESTAMP
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USER
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTION
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MODULE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RESOURCE
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DETAILS
                  </th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const { date, time } = formatDate(log.createdAt);
                  return (
                    <tr
                      key={log._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 py-7 text-sm text-gray-900 leading-tight">
                        <div>{date}</div>
                        <div className="text-sm text-gray-900 mt-1">{time}</div>
                      </td>

                      <td className="px-1 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src="/piccc.png"
                            alt="user avatar"
                            className="w-5 h-5 rounded-full"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-900 font-bold">
                              {log.userName
                                ? log.userName.split(" ")[0]
                                : "System"}
                            </span>
                            <span className="text-sm font-bold text-gray-800">
                              {log.userName
                                ? log.userName.split(" ").slice(1).join(" ")
                                : "User"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded ${getActionBadgeColor(log.action)}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {log.module}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {(() => {
                          const parts = (log.resource || "").split(" ");
                          const first = parts.shift();
                          const rest = parts.join(" ");
                          return (
                            <span>
                              <span className="font-bold">{first}</span>
                              {rest ? " " + rest : ""}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${log.status === "SUCCESS" ? "bg-[#1A8FA0] text-white" : "bg-red-100 text-red-700"}`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewDetails(log)}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          <img
                            src="/Button.png"
                            alt=""
                            className="pl-4 h-4 w-9 cursor-pointer"
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 bg-white flex items-center justify-between border-t border-gray-200">
            <span className="text-sm text-gray-600">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, totalLogs)} of {totalLogs} logs
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className={`text-sm text-gray-600 hover:bg-gray-100 rounded ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img
                  src="/l.png"
                  alt="Previous"
                  className="h-7 w-7 rounded-lg cursor-pointer"
                />
              </button>

              <button className="px-3 py-1 text-sm text-white bg-[#1A8FA0] rounded-lg font-semibold">
                {page}
              </button>
              {page < totalPages && (
                <button
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-semibold"
                >
                  {page + 1}
                </button>
              )}
              {page + 1 < totalPages && (
                <span className="px-2 py-1 text-sm text-gray-600">...</span>
              )}
              {page + 1 < totalPages && (
                <button
                  onClick={() => setPage(totalPages)}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-semibold"
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className={`text-sm text-gray-600 hover:bg-gray-100 rounded ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img
                  src="/r.png"
                  alt="Next"
                  className="h-7 w-7 rounded-lg cursor-pointer"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Log Details Panel - Responsive */}
        {selectedLog ? (
          <div className="w-full xl:w-96 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-700">
                Log Details
              </h3>
              <div className="text-xs text-[#64748B] font-medium mb-4">
                ID: LOG-{selectedLog._id.toString().slice(-6).toUpperCase()}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {/* BASIC INFO */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <img src="/s.png" alt="" className="h-3 w-3 mb-2" />
                  <h4 className="text-md font-bold text-[#1A8FA0] mb-2">
                    BASIC INFO
                  </h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400">
                      ACTION PERFORMED
                    </div>
                    <div className="text-md font-semibold text-gray-900 mt-0.5">
                      {selectedLog.action} - {selectedLog.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">DATE & TIME</div>
                    <div className="text-md font-semibold text-gray-900 mt-0.5">
                      {formatDate(selectedLog.createdAt).date},{" "}
                      {formatDate(selectedLog.createdAt).time}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">IP ADDRESS</div>
                    <div className="text-sm text-gray-900 mt-0.5">
                      {selectedLog.ipAddress || "127.0.0.1"}
                    </div>
                  </div>
                </div>
              </div>

              {/* RESOURCE INFO */}
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <img src="/a.png" alt="" className="h-3 w-3 mb-2" />
                  <h4 className="text-md font-bold text-[#1A8FA0] mb-2">
                    RESOURCE INFO
                  </h4>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-gray-400">RESOURCE NAME</div>
                    <div className="text-sm text-[#1A8FA0] font-semibold mt-0.5">
                      {selectedLog.resource}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">MODULE</div>
                    <div className="text-sm text-gray-900 mt-0.5 break-all">
                      {selectedLog.module}
                    </div>
                  </div>
                </div>
              </div>

              {/* DATA SNAPSHOT */}
              <div>
                <div className="flex items-center gap-2">
                  <img src="/b.png" alt="" className="h-3 w-3 mb-2" />
                  <select className="text-sm font-bold text-black mb-2">
                    <option value="">DATA SNAPSHOT</option>
                  </select>
                </div>
                <div className="text-xs bg-gray-50 border-2 border-dashed rounded-xl border-gray-200 p-4 text-[#94A3B8] w-full break-all overflow-hidden">
                  {selectedLog.details
                    ? JSON.stringify(selectedLog.details, null, 2)
                    : "No details available."}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedLog(null)}
                className="w-full text-center text-md text-white bg-[#1A8FA0] cursor-pointer rounded-2xl border border-gray-200 py-4"
              >
                Close Panel
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full xl:w-96 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center p-6">
            <p className="text-gray-500">
              Select a log from the table to view details
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Reports;
