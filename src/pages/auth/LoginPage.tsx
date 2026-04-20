import { authApi } from '../../api/endpoints/auth.api';
import { useMockLogin } from '../../api/hooks/auth.hooks';
import { useAuthStore } from '../../store/authStore';
import { Navigate } from 'react-router-dom';
import { LogIn, ShieldCheck, User } from 'lucide-react';
import { Role } from '../../api/types/shared.types';

const LoginPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const mockLogin = useMockLogin();

  if (isAuthenticated && user) {
    const defaultPath = user.role === Role.USER ? '/hunter' : '/admin';
    return <Navigate to={defaultPath} replace />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl mb-2">
          Block<span className="text-blue-500">Forge</span>
        </h1>
        <p className="text-gray-400 text-lg">Earn rewards by completing simple social tasks.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl py-8 px-4 border border-white/10 shadow-2xl shadow-blue-500/10 sm:rounded-2xl sm:px-10">
          <div className="space-y-6">
            <div>
              <button
                onClick={() => authApi.initiateXLogin()}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform active:scale-95"
              >
                <LogIn className="h-5 w-5" />
                Authorize with X
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-900 text-gray-500 uppercase tracking-widest text-[10px] font-bold">Development Mode</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => mockLogin.mutate(Role.USER)}
                disabled={mockLogin.isPending}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl border border-white/5 text-sm font-medium transition-all hover:text-white"
              >
                <User size={16} />
                Mock Hunter
              </button>
              <button
                onClick={() => mockLogin.mutate(Role.ADMIN)}
                disabled={mockLogin.isPending}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-xl border border-white/5 text-sm font-medium transition-all hover:text-white"
              >
                <ShieldCheck size={16} />
                Mock Admin
              </button>
            </div>
            
            {mockLogin.isError && (
              <p className="text-center text-red-400 text-xs mt-2">
                {mockLogin.error instanceof Error ? mockLogin.error.message : 'Login failed'}
              </p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-center text-xs text-gray-500 italic">
              By authorizing, you agree to our Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
