import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { Role } from "../api/types/shared.types";
import AdminLayout from "../layouts/AdminLayout";
import HunterLayout from "../layouts/HunterLayout";

import LoginPage from "../pages/auth/LoginPage";
import CallbackPage from "../pages/auth/CallbackPage";
import LandingPage from "../pages/landing/LandingPage";

// Admin pages
import AdminOverview from "../pages/admin/AdminOverview";
import AdminTasks from "../pages/admin/AdminTasks";
import AdminTaskDetail from "../pages/admin/AdminTaskDetail";
import AdminSubmissions from "../pages/admin/AdminSubmissions";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminWithdrawals from "../pages/admin/AdminWithdrawals";
import AdminSubmissionDetail from "../pages/admin/AdminSubmissionDetail";
import AdminTaskSubmissions from "../pages/admin/AdminTaskSubmissions";
import AdminBroadcast from "../pages/admin/AdminBroadcast";

// Hunter pages
import HunterDashboard from "../pages/hunter/HunterDashboard";
import TaskDiscovery from "../pages/hunter/TaskDiscovery";
import TaskDetail from "../pages/hunter/TaskDetail";
import MySubmissions from "../pages/hunter/MySubmissions";
import WalletPage from "../pages/hunter/WalletPage";
import NotificationsPage from "../pages/hunter/NotificationsPage";

const NotFoundPage = () => (
  <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
    <div className="text-center">
      <p className="text-6xl font-mono font-bold text-zinc-800">404</p>
      <p className="text-sm text-zinc-500 mt-2">This page was not forged.</p>
    </div>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<CallbackPage />} />

      {/* Hunter */}
      <Route element={<ProtectedRoute allowedRoles={[Role.USER]} />}>
        <Route element={<HunterLayout />}>
          <Route path="/hunter" element={<HunterDashboard />} />
          <Route path="/hunter/tasks" element={<TaskDiscovery />} />
          <Route path="/hunter/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/hunter/submissions" element={<MySubmissions />} />
          <Route path="/hunter/wallet" element={<WalletPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Admin */}
      <Route element={<ProtectedRoute allowedRoles={[Role.ADMIN, Role.SUPERADMIN]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/tasks" element={<AdminTasks />} />
          <Route path="/admin/tasks/:taskId" element={<AdminTaskDetail />} />
          <Route path="/admin/tasks/:taskId/submissions" element={<AdminTaskSubmissions />} />
          <Route path="/admin/submissions" element={<AdminSubmissions />} />
          <Route path="/admin/submissions/:submissionId" element={<AdminSubmissionDetail />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
          <Route path="/admin/broadcast" element={<AdminBroadcast />} />
          <Route path="/admin/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
