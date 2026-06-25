import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor with token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const method = (originalRequest?.method || '').toLowerCase();
    const isWriteRequest = ['post', 'put', 'patch', 'delete'].includes(method);
    
    // If 401 error and not already retrying, and NOT a login request
    if (
      error.response?.status === 401 && 
      !originalRequest._retry && 
      !originalRequest.url.includes('/auth/login')
    ) {
      originalRequest._retry = true;
      
      try {
        // Call refresh token endpoint
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        
        if (response.data.success) {
          // Store new access token if returned
          if (response.data.accessToken) {
            localStorage.setItem('accessToken', response.data.accessToken);
          }
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    if (
      error.response?.status === 403 &&
      isWriteRequest &&
      !originalRequest._permissionToastShown
    ) {
      originalRequest._permissionToastShown = true;
      const message = error.response?.data?.message || 'Ye allow nahi hai';
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  getUsers: () => api.get('/auth/users'),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  deleteUser: (id) => api.delete(`/auth/users/${id}`),
  changePassword: (currentPassword, newPassword) => 
    api.put('/auth/change-password', { currentPassword, newPassword }),
};

// ==================== DASHBOARD API ====================
export const dashboardAPI = {
  getAll: () => api.get('/dashboard/all'),
  getStats: () => api.get('/items/stats'),
  getAlerts: () => api.get('/dashboard/alerts'),
  dismissAlert: (id) => api.put(`/dashboard/alerts/${id}/dismiss`),
  clearAlerts: () => api.delete('/dashboard/alerts/clear'),
  getInventoryStatus: () => api.get('/dashboard/inventory-status'),
  getStats: () => api.get('/dashboard/stats'),
  getDepletion: () => api.get('/dashboard/depletion'),
  getHealth: () => api.get('/dashboard/health'),
  getStockMovement: () => api.get('/dashboard/stock-movement'),
  getCategoryHealth: () => api.get('/dashboard/category-health'),
  getStockAvailability: () => api.get('/dashboard/stock-availability'),
  getVendorTrend: () => api.get('/dashboard/vendor-trend'),
};

// ==================== STOCK IN API ====================
export const stockInAPI = {
  getTransactions: (page = 1, limit = 10, status = 'All Status') =>
    api.get(`/stockin/transactions?page=${page}&limit=${limit}&status=${status}`),
  createTransaction: (data) => api.post('/stockin/transactions', data),
  updateTransaction: (id, data) => api.put(`/stockin/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/stockin/transactions/${id}`),
  getTrend: (days = 7) => api.get(`/stockin/analytics/trend?days=${days}`),
  getCategoryDistribution: () => api.get('/stockin/analytics/category-distribution'),
  getVendorPerformance: () => api.get('/stockin/analytics/vendor-performance'),
  getEfficiencyRanking: () => api.get('/stockin/analytics/efficiency-ranking'),
  createNewItem: (data) => api.post('/stockin/create-item', data),
};

// ==================== STOCK OUT API ====================
export const stockOutAPI = {
  getPendingApproved: () => api.get('/stockout/pending-approved'),
  getStockTrend: (days = 10) => api.get(`/stockout/stock-trend?days=${days}`),
  getIssuanceByUnit: (days = 30) => api.get(`/stockout/issuance-by-unit?days=${days}`),
  getWorkflowStatus: () => api.get('/stockout/workflow-status'),
  getLowStockItems: () => api.get('/stockout/low-stock-items'),
  getTransactions: (page = 1, limit = 10, search = '', status = 'all') =>
    api.get(`/stockout/transactions?page=${page}&limit=${limit}&search=${search}&status=${status}`),
  createStockOut: (data) => api.post('/stockout/create', data),
  approveStockOut: (id) => api.put(`/stockout/approve/${id}`),
  rejectStockOut: (id, reason) => api.put(`/stockout/reject/${id}`, { reason }),
  getSummary: () => api.get('/stockout/summary'),
};

// ==================== STOCK RETURN API ====================
export const stockReturnAPI = {
  getKPIs: () => api.get('/returns/kpis'),
  getMonthlyTrend: (year = 2025) => api.get(`/returns/monthly-trend?year=${year}`),
  getReasonCondition: () => api.get('/returns/reason-condition'),
  getVolumeRadar: () => api.get('/returns/volume-radar'),
  getTransactions: (page = 1, limit = 10, search = '', reason = 'All Reasons', status = 'All Status', dateRange = 'Last 30 Days') =>
    api.get(`/returns/transactions?page=${page}&limit=${limit}&search=${search}&reason=${reason}&status=${status}&dateRange=${dateRange}`),
  createReturn: (data) => api.post('/returns/create', data),
  updateReturnStatus: (id, data) => api.put(`/returns/${id}`, data),
  deleteReturn: (id) => api.delete(`/returns/${id}`),
  getReturnById: (id) => api.get(`/returns/${id}`),
  exportReturns: (format = 'csv') => api.get(`/returns/export?format=${format}`, { responseType: 'blob' }),
  getSummary: () => api.get('/returns/summary'),
};

// ==================== ITEMS API ====================
export const itemsAPI = {
  getItems: (page = 1, limit = 8, search = '', status = 'all', category = '') =>
    api.get(`/items?page=${page}&limit=${limit}&search=${search}&status=${status}&category=${category}`),
  getItemById: (id) => api.get(`/items/${id}`),
  getItemByBarcode: (barcode) => api.get(`/items/barcode/${barcode}`),
  createItem: (data) => api.post('/items', data),
  updateItem: (id, data) => api.put(`/items/${id}`, data),
  deleteItem: (id) => api.delete(`/items/${id}`),
  bulkDelete: (itemIds) => api.delete('/items/bulk', { data: { itemIds } }),
  getStats: () => api.get('/items/stats'),
  getCategories: () => api.get('/items/categories'),
  getLowStock: () => api.get('/items/low-stock'),
  getCritical: () => api.get('/items/critical'),
  updateStock: (id, data) => api.put(`/items/${id}/stock`, data),
  exportItems: () => api.get('/items/export', { responseType: 'blob' }),
};

// ==================== VENDORS API ====================
export const vendorsAPI = {
  getVendors: (page = 1, limit = 8, search = '') =>
    api.get(`/vendors?page=${page}&limit=${limit}&search=${search}`),
  getVendorById: (id) => api.get(`/vendors/${id}`),
  getTopVendors: (limit = 5) => api.get(`/vendors/top?limit=${limit}`),
  getPerformanceStats: () => api.get('/vendors/stats/performance'),
  createVendor: (data) => api.post('/vendors', data),
  updateVendor: (id, data) => api.put(`/vendors/${id}`, data),
  deleteVendor: (id) => api.delete(`/vendors/${id}`),
};

// ==================== PURCHASE REQUEST API ====================
export const purchaseRequestAPI = {
  getAll: (page = 1, limit = 10, search = '', status = 'All', sort = '-createdAt') =>
    api.get(`/purchase-requests?page=${page}&limit=${limit}&search=${search}&status=${status}&sort=${sort}`),
  getById: (id) => api.get(`/purchase-requests/${id}`),
  create: (data) => api.post('/purchase-requests', data),
  update: (id, data) => api.put(`/purchase-requests/${id}`, data),
  delete: (id) => api.delete(`/purchase-requests/${id}`),
  getKPIs: () => api.get('/purchase-requests/kpis'),
  getMonthlyTrend: (year = 2025) => api.get(`/purchase-requests/monthly-trend?year=${year}`),
};

// ==================== REPORTS API ====================
export const reportsAPI = {
  getLogs: (page = 1, limit = 10, module = '', action = '', user = '', startDate = '', endDate = '') => {
    let url = `/reports/logs?page=${page}&limit=${limit}`;
    if (module) url += `&module=${module}`;
    if (action) url += `&action=${action}`;
    if (user) url += `&user=${user}`;
    if (startDate) url += `&startDate=${startDate}`;
    if (endDate) url += `&endDate=${endDate}`;
    return api.get(url);
  },
  getStats: () => api.get('/reports/stats'),
};

// ==================== HRMS / EMPLOYEE API ====================
export const employeeAPI = {
  getAll: (params = {}) => {
    const { page = 1, limit = 100, status = '', department = '', type = '', search = '' } = params;
    let url = `/employees?page=${page}&limit=${limit}`;
    if (status) url += `&status=${status}`;
    if (department) url += `&department=${department}`;
    if (type) url += `&type=${type}`;
    if (search) url += `&search=${search}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post('/employees', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
  getKPIStats: () => api.get('/employees/stats/kpis'),
  getEmploymentTypeDist: () => api.get('/employees/stats/employment-type'),
  getJoiningTrend: () => api.get('/employees/stats/joining-trend'),
  getDepartmentDist: () => api.get('/employees/stats/department-dist'),
  getDeptBreakdown: () => api.get('/employees/stats/dept-breakdown'),
  getSkillDist: () => api.get('/employees/stats/skill-dist'),
  deactivateAccount: (id) => api.put(`/employees/${id}/deactivate-account`),
  deleteWithAccount: (id) => api.delete(`/employees/${id}/with-account`),
  exportEmployees: () => api.get('/employees/export', { responseType: 'blob' }),
};

// ==================== INCIDENTS API ====================
export const incidentAPI = {
  getAll: (params = {}) => {
    const { page = 1, limit = 10, search = '', status = '', severity = '', incidentType = '', dateFrom = '', dateTo = '' } = params;
    let url = `/incidents?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (status) url += `&status=${status}`;
    if (severity) url += `&severity=${severity}`;
    if (incidentType) url += `&incidentType=${incidentType}`;
    if (dateFrom) url += `&dateFrom=${dateFrom}`;
    if (dateTo) url += `&dateTo=${dateTo}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/incidents/${id}`),
  create: (data) => api.post('/incidents', data),
  update: (id, data) => api.put(`/incidents/${id}`, data),
  delete: (id) => api.delete(`/incidents/${id}`),
  getKPIStats: () => api.get('/incidents/stats/kpis'),
  getMonthlyTrend: (year) => api.get(`/incidents/stats/monthly-trend?year=${year || new Date().getFullYear()}`),
  getSeverityDist: () => api.get('/incidents/stats/severity-dist'),
  getTypeDist: () => api.get('/incidents/stats/type-dist'),
  exportIncidents: () => api.get('/incidents/export', { responseType: 'blob' }),
};

// ==================== TRANSFERS API ====================
export const transferAPI = {
  getAll: (params = {}) => {
    const { page = 1, limit = 10, search = '', status = '', sourceUnit = '', destinationUnit = '' } = params;
    let url = `/transfers?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (status) url += `&status=${status}`;
    if (sourceUnit) url += `&sourceUnit=${sourceUnit}`;
    if (destinationUnit) url += `&destinationUnit=${destinationUnit}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/transfers/${id}`),
  create: (data) => api.post('/transfers', data),
  update: (id, data) => api.put(`/transfers/${id}`, data),
  delete: (id) => api.delete(`/transfers/${id}`),
  getKPIStats: () => api.get('/transfers/stats/kpis'),
  getTimelineByUnit: () => api.get('/transfers/stats/timeline-by-unit'),
  getInOutSummary: () => api.get('/transfers/stats/in-out-summary'),
  getQuickHistory: (limit = 10) => api.get(`/transfers/stats/quick-history?limit=${limit}`),
  exportTransfers: () => api.get('/transfers/export', { responseType: 'blob' }),
};

// ==================== TRAINING API ====================
export const trainingAPI = {
  getAll: (params = {}) => {
    const { page = 1, limit = 10, search = '', status = '', type = '', category = '' } = params;
    let url = `/training?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (status) url += `&status=${status}`;
    if (type) url += `&type=${type}`;
    if (category) url += `&category=${category}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/training/${id}`),
  create: (data) => api.post('/training', data),
  update: (id, data) => api.put(`/training/${id}`, data),
  delete: (id) => api.delete(`/training/${id}`),
  getKPIStats: () => api.get('/training/stats/kpis'),
  getMonthlyTrend: (year) => api.get(`/training/stats/monthly-trend?year=${year || new Date().getFullYear()}`),
  getCategoryDist: () => api.get('/training/stats/category-dist'),
  getEnrollmentStatus: () => api.get('/training/stats/enrollment-status'),
  getScoreDist: () => api.get('/training/stats/score-dist'),
  getUpcoming: () => api.get('/training/stats/upcoming'),
  getTopInstructors: () => api.get('/training/stats/top-instructors'),
  getParticipants: (params = {}) => {
    const { page = 1, limit = 10, search = '' } = params;
    return api.get(`/training/stats/participants?page=${page}&limit=${limit}&search=${search}`);
  },
  addParticipant: (id, data) => api.post(`/training/${id}/participants`, data),
  updateParticipant: (id, participantId, data) => api.put(`/training/${id}/participants/${participantId}`, data),
  deleteParticipant: (id, participantId) => api.delete(`/training/${id}/participants/${participantId}`),
  exportTrainings: () => api.get('/training/export', { responseType: 'blob' }),
  exportParticipants: () => api.get('/training/stats/participants/export', { responseType: 'blob' }),
};

// ==================== ATTENDANCE API ====================
export const attendanceAPI = {
  getAll: (params = {}) => {
    const { page = 1, limit = 10, search = '', status = '', shift = '', department = '', date = '' } = params;
    let url = `/attendance?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (status) url += `&status=${status}`;
    if (shift) url += `&shift=${shift}`;
    if (department) url += `&department=${department}`;
    if (date) url += `&date=${date}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/attendance/${id}`),
  create: (data) => api.post('/attendance', data),
  update: (id, data) => api.put(`/attendance/${id}`, data),
  delete: (id) => api.delete(`/attendance/${id}`),
  bulkCreate: (records) => api.post('/attendance/bulk', { records }),
  getKPIStats: () => api.get('/attendance/stats/kpis'),
  getMonthlyTrend: (month, year) => {
    let url = '/attendance/stats/monthly-trend';
    const params = [];
    if (month) params.push(`month=${month}`);
    if (year) params.push(`year=${year}`);
    if (params.length) url += '?' + params.join('&');
    return api.get(url);
  },
  getTodayStatus: () => api.get('/attendance/stats/today-status'),
  getShiftOverview: () => api.get('/attendance/stats/shift-overview'),
  getClockInDistribution: () => api.get('/attendance/stats/clock-in-distribution'),
  getHeatmap: (month, year) => {
    let url = '/attendance/stats/heatmap';
    const params = [];
    if (month) params.push(`month=${month}`);
    if (year) params.push(`year=${year}`);
    if (params.length) url += '?' + params.join('&');
    return api.get(url);
  },
  getRecentActivity: () => api.get('/attendance/stats/recent-activity'),
  getDeptAttendanceRate: () => api.get('/attendance/stats/dept-rate'),
  getWorkingHoursAnalysis: () => api.get('/attendance/stats/working-hours'),
  getPendingApprovals: () => api.get('/attendance/stats/pending-approvals'),
  exportAttendance: () => api.get('/attendance/export', { responseType: 'blob' }),
};

// ==================== LEAVE API ====================
export const leaveAPI = {
  getAll: (params = {}) => {
    const { page = 1, limit = 10, search = '', status = '', type = '' } = params;
    let url = `/leaves?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (status) url += `&status=${status}`;
    if (type) url += `&type=${type}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/leaves/${id}`),
  create: (data) => api.post('/leaves', data),
  update: (id, data) => api.put(`/leaves/${id}`, data),
  delete: (id) => api.delete(`/leaves/${id}`),
  getKPIStats: () => api.get('/leaves/stats/kpis'),
  getChartData: () => api.get('/leaves/stats/charts'),
  getLeaveBalances: () => api.get('/leaves/stats/balances'),
  getApprovalQueue: () => api.get('/leaves/stats/approval-queue'),
  approveLeave: (id, data) => api.put(`/leaves/${id}/approve`, data || {}),
  rejectLeave: (id, data) => api.put(`/leaves/${id}/reject`, data || {}),
  exportLeaves: () => api.get('/leaves/export', { responseType: 'blob' }),
};

// ==================== TOOL KIT / INSPECTION API ====================
export const toolKitAPI = {
  getAll: (params = {}) => {
    const { page = 1, limit = 10, search = '', status = '', department = '', condition = '' } = params;
    let url = `/toolkits?page=${page}&limit=${limit}`;
    if (search) url += `&search=${search}`;
    if (status) url += `&status=${status}`;
    if (department) url += `&department=${department}`;
    if (condition) url += `&condition=${condition}`;
    return api.get(url);
  },
  getById: (id) => api.get(`/toolkits/${id}`),
  create: (data) => api.post('/toolkits', data),
  update: (id, data) => api.put(`/toolkits/${id}`, data),
  delete: (id) => api.delete(`/toolkits/${id}`),
  getKPIStats: () => api.get('/toolkits/stats/kpis'),
  getByDepartment: () => api.get('/toolkits/stats/by-department'),
  getConditionSummary: () => api.get('/toolkits/stats/condition-summary'),
  getRecentActivity: () => api.get('/toolkits/stats/recent-activity'),
  exportToolKits: () => api.get('/toolkits/export', { responseType: 'blob' }),
};

// ==================== HRM DASHBOARD API ====================
export const hrmDashboardAPI = {
  getStats: () => api.get('/hrm-dashboard/stats'),
};

export default api;
