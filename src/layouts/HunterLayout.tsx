import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LayoutDashboard, CheckSquare, Wallet, LogOut } from 'lucide-react';

const HunterLayout: React.FC = () => {
  const { logout, user } = useAuthStore();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Placeholder */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">BlockForge</h1>
        </div>
        <nav className="mt-4 space-y-1 px-4">
          <Link to="/hunter" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/hunter/tasks" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <CheckSquare size={20} />
            My Submissions
          </Link>
          <Link to="/hunter/wallet" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
            <Wallet size={20} />
            Wallet
          </Link>
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <button 
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="text-sm font-medium text-gray-500">Hunter Panel</div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-gray-900">{user?.username}</div>
              <div className="text-xs text-green-600">{(user?.balance.available || 0) / 1000000} USDC</div>
            </div>
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
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

export default HunterLayout;
