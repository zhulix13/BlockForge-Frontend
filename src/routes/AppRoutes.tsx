import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Role } from '../api/types/shared.types';
import HunterLayout from '../layouts/HunterLayout';
import AdminLayout from '../layouts/AdminLayout';

import LoginPage from '../pages/auth/LoginPage';
import CallbackPage from '../pages/auth/CallbackPage';

// Placeholder components (will be replaced by actual pages)
const HunterDashboard = () => (
  <div className="space-y-4">
    <h2 className="text-2xl font-bold">Hunter Dashboard</h2>
    <div className="p-6 bg-white rounded-xl border shadow-sm">
      <p className="text-gray-600">Welcome to your dashboard. High-reward tasks are waiting for you!</p>
    </div>
  </div>
);

const AdminDashboard = () => (
  <div className="space-y-4 text-white">
    <h2 className="text-2xl font-bold text-blue-400">Admin Panel</h2>
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-sm">
      <p className="text-gray-400">Platform metrics and user management overview.</p>
    </div>
  </div>
);

const LandingPage = () => <div className="p-8">Landing Page</div>;
const NotFoundPage = () => <div className="p-8">Page Not Found</div>;

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Hunter Routes */}
      <Route element={<ProtectedRoute allowedRoles={[Role.USER]} />}>
        <Route element={<HunterLayout />}>
          <Route path="/hunter" element={<HunterDashboard />} />
          {/* Add more hunter routes here */}
        </Route>
      </Route>

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.SUPERADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          {/* Add more admin routes here */}
        </Route>
      </Route>

      {/* Auth Callback Route */}
      <Route path="/auth/callback" element={<CallbackPage />} />

      {/* Fallback */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
