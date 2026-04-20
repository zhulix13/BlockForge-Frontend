import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useXCallback } from '../../api/hooks/auth.hooks';
import { useAuthStore } from '../../store/authStore';
import { Loader2, AlertCircle } from 'lucide-react';
import { Role } from '../../api/types/shared.types';

const CallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const processCallback = useXCallback();
  const { user, isAuthenticated } = useAuthStore();
  const hasProcessed = useRef(false);

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  useEffect(() => {
    if (code && state && !hasProcessed.current) {
      hasProcessed.current = true;
      processCallback.mutate({ code, state });
    }
  }, [code, state, processCallback]);

  useEffect(() => {
    if (isAuthenticated && user) {
      const defaultPath = user.role === Role.USER ? '/hunter' : '/admin';
      navigate(defaultPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  if (!code || !state) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-red-500/20 p-8 rounded-2xl max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Invalid Auth Session</h2>
          <p className="text-gray-400 mb-6">No authorization code was found in the URL. Please try logging in again.</p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-all"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (processCallback.isError) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-red-500/20 p-8 rounded-2xl max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Authentication Failed</h2>
          <p className="text-gray-400 mb-6">
            {processCallback.error instanceof Error ? processCallback.error.message : 'An error occurred while verifying your account with X.'}
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl font-bold transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="relative inline-flex mb-8">
          <div className="w-20 h-20 bg-blue-500/20 rounded-full animate-ping absolute inset-0"></div>
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center relative shadow-lg shadow-blue-500/20">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Authenticating with X</h2>
        <p className="text-gray-400 max-w-xs mx-auto">Please wait while we finalize your secure session on the block forge...</p>
      </div>
    </div>
  );
};

export default CallbackPage;
