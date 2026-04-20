import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Role } from '../api/types/shared.types';
import { ShieldAlert, Users, FileText, BarChart3, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { logout, user } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-400">BlockForge Admin</h1>
        </div>
        <nav className="mt-4 space-y-1 px-4">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg">
            <BarChart3 size={20} />
            Overview
          </Link>
          <Link to="/admin/tasks" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg">
            <FileText size={20} />
            Manage Tasks
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg">
            <Users size={20} />
            User Management
          </Link>
          {(user?.role === Role.SUPERADMIN) && (
            <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg">
              <ShieldAlert size={20} />
              Superadmin
            </Link>
          )}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:bg-gray-700 rounded-lg"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-950">
        <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-8">
          <div className="text-sm font-medium text-gray-400">Administration Panel</div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-gray-100">{user?.username}</div>
              <div className="text-xs text-blue-400">{user?.role}</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-900 text-blue-100 flex items-center justify-center font-bold">
              {user?.username[0].toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
