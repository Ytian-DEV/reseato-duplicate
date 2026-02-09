import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole } from '../../shared/types';
import authService from './services/authService';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { VendorLayout } from './layouts/VendorLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Pages
import { HomePage } from './pages/customer/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const user = authService.getStoredUser();

  if (!authService.isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route
            path="restaurant/:id"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Restaurant Detail Page</h1>
                <p className="text-neutral-600 mt-2">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="my-reservations"
            element={
              <ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}>
                <div className="p-8 text-center">
                  <h1 className="text-2xl font-bold">My Reservations</h1>
                  <p className="text-neutral-600 mt-2">Coming soon...</p>
                </div>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Vendor Routes */}
        <Route
          path="/vendor"
          element={
            <ProtectedRoute allowedRoles={[UserRole.VENDOR]}>
              <VendorLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
                <p className="text-neutral-600 mt-2">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="reservations"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Manage Reservations</h1>
                <p className="text-neutral-600 mt-2">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="settings"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Restaurant Settings</h1>
                <p className="text-neutral-600 mt-2">Coming soon...</p>
              </div>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-neutral-600 mt-2">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="restaurants"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Manage Restaurants</h1>
                <p className="text-neutral-600 mt-2">Coming soon...</p>
              </div>
            }
          />
          <Route
            path="users"
            element={
              <div className="p-8 text-center">
                <h1 className="text-2xl font-bold">Manage Users</h1>
                <p className="text-neutral-600 mt-2">Coming soon...</p>
              </div>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};