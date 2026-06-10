import axios from 'axios';

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

export default api;