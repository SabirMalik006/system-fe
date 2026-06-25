import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/layout/Navbar';
import HrmNavbar from './components/layout/HrmNavbar';
import Login from './pages/Login';
import HomePage from './pages/HomePage';

// IMS Pages
import Dashboard from './pages/ims/Dashboard';
import Reports from './pages/ims/Reports';
import StockOut from './pages/ims/StockOut';
import Items from './pages/ims/Items';
import Vendors from './pages/ims/Vendors';
import PurchaseRequest from './pages/ims/PurchaseRequest';
import Entry from './pages/ims/Entry';
import Return from './pages/ims/Return';
import Store from './pages/ims/Store';
import StockInGoodsReceipt from './pages/ims/StockInGoodsReceipt';
import StockReturns from './pages/ims/StockReturns';
import ProcurementManagement from './pages/ims/ProcurementManagement';
import StockIssuance from './pages/ims/StockIssuance';
import ToolsInspection from './pages/ims/ToolsInspection';

// HRM Pages
import PersonnelProfile from './pages/hrm/PersonnelProfile';
import Compliance from './pages/hrm/Compliance';
import CreateIncidentPage from './pages/hrm/CreateIncidentPage';
import LeaveManagement from './pages/hrm/LeaveManagement';
import InterUnitTransfer from './pages/hrm/InterUnitTransfer';
import CreateTransferPage from './pages/hrm/CreateTransferPage';
import TransferDetailPage from './pages/hrm/TransferDetailPage';
import EditTransferPage from './pages/hrm/EditTransferPage';
import TrainingManagement from './pages/hrm/TrainingManagement';
import PerformanceEvaluation from './pages/hrm/PerformanceEvaluation';
import AttendancePage from './pages/hrm/AttendancePage';
import HrmDashboard from './pages/hrm/HrmDashboard';
import Department from './pages/hrm/Department';
import EmployeeProfile from './pages/hrm/EmployeeProfile';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Role check if required
  if (requiredRoles.length > 0 && !requiredRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Layout wrapper for IMS pages (with Navbar)
const IMSLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

// Layout wrapper for HRM pages (with HrmNavbar)
const HRMLayout = ({ children }) => (
  <>
    <HrmNavbar />
    {children}
  </>
);

// Layout wrapper for pages without navbar
const BlankLayout = ({ children }) => <>{children}</>;

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      {/* Home Page (no navbar) */}
      <Route path="/" element={
        <ProtectedRoute>
          <BlankLayout><HomePage /></BlankLayout>
        </ProtectedRoute>
      } />

      {/* IMS Routes (with Navbar) */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <IMSLayout><Dashboard /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/reports" element={
        <ProtectedRoute>
          <IMSLayout><Reports /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/stock-out" element={
        <ProtectedRoute>
          <IMSLayout><StockOut /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/items" element={
        <ProtectedRoute>
          <IMSLayout><Items /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/vendors" element={
        <ProtectedRoute>
          <IMSLayout><Vendors /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/purchase-request" element={
        <ProtectedRoute>
          <IMSLayout><PurchaseRequest /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/entry" element={
        <ProtectedRoute>
          <IMSLayout><Entry /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/return" element={
        <ProtectedRoute>
          <IMSLayout><Return /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/store" element={
        <ProtectedRoute>
          <IMSLayout><Store /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/stock-in" element={
        <ProtectedRoute>
          <IMSLayout><StockInGoodsReceipt /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/stock-returns" element={
        <ProtectedRoute>
          <IMSLayout><StockReturns /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/procurement-management" element={
        <ProtectedRoute>
          <IMSLayout><ProcurementManagement /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/stock-issuance" element={
        <ProtectedRoute>
          <IMSLayout><StockIssuance /></IMSLayout>
        </ProtectedRoute>
      } />
      <Route path="/tools-inspection" element={
        <ProtectedRoute>
          <IMSLayout><ToolsInspection /></IMSLayout>
        </ProtectedRoute>
      } />
      
      {/* HRM Routes (with HrmNavbar) */}
      <Route path="/personnel-profile" element={
        <ProtectedRoute>
          <HRMLayout><PersonnelProfile /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/compliance" element={
        <ProtectedRoute>
          <HRMLayout><Compliance /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/compliance/new" element={
        <ProtectedRoute>
          <HRMLayout><CreateIncidentPage /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/leave-management" element={
        <ProtectedRoute>
          <HRMLayout><LeaveManagement /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/inter-unit-transfer" element={
        <ProtectedRoute>
          <HRMLayout><InterUnitTransfer /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/inter-unit-transfer/new" element={
        <ProtectedRoute>
          <HRMLayout><CreateTransferPage /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/inter-unit-transfer/:id" element={
        <ProtectedRoute>
          <HRMLayout><TransferDetailPage /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/inter-unit-transfer/:id/edit" element={
        <ProtectedRoute>
          <HRMLayout><EditTransferPage /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/training-management" element={
        <ProtectedRoute>
          <HRMLayout><TrainingManagement /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/performance-evaluation" element={
        <ProtectedRoute>
          <HRMLayout><PerformanceEvaluation /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/attendance" element={
        <ProtectedRoute>
          <HRMLayout><AttendancePage /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/hrm-dashboard" element={
        <ProtectedRoute>
          <HRMLayout><HrmDashboard /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/department" element={
        <ProtectedRoute>
          <HRMLayout><Department /></HRMLayout>
        </ProtectedRoute>
      } />
      <Route path="/employee-profile" element={
        <ProtectedRoute>
          <HRMLayout><EmployeeProfile /></HRMLayout>
        </ProtectedRoute>
      } />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <div className="min-h-screen bg-[#F9FAFB]">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
