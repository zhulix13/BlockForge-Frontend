import { authApi } from '../../api/endpoints/auth.api';
import { useAuthStore } from '../../store/authStore';
import { Navigate, Link } from 'react-router-dom';
import { Role } from '../../api/types/shared.types';
import { ArrowRight } from 'lucide-react';

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117Z" />
  </svg>
);

const LoginPage = () => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    const defaultPath = user.role === Role.USER ? '/hunter' : '/admin';
    return <Navigate to={defaultPath} replace />;
  }

  return (
    <>
      <style>{`
        /* Orb drift */
        @keyframes login-orb {
          0%,100% { transform: translate(0,0) scale(1); }
          40%      { transform: translate(30px,-40px) scale(1.07); }
          70%      { transform: translate(-20px,25px) scale(0.95); }
        }
        .login-orb { position: absolute; border-radius: 50%; filter: blur(90px); pointer-events: none; animation: login-orb 16s ease-in-out infinite; }

        /* Card entrance */
        @keyframes login-enter {
          from { opacity: 0; transform: translateY(24px) scale(0.97); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    filter: blur(0px); }
        }
        .login-card { animation: login-enter 0.55s cubic-bezier(0.22,1,0.36,1) forwards; }

        /* X button shimmer */
        @keyframes x-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .x-btn-inner {
          background: linear-gradient(110deg, #f59e0b 0%, #fbbf24 40%, #fef3c7 50%, #fbbf24 60%, #f59e0b 100%);
          background-size: 200% auto;
          transition: box-shadow 0.2s, transform 0.15s;
        }
        .x-btn-inner:hover {
          animation: x-shimmer 1.3s linear infinite;
          box-shadow: 0 0 28px rgba(245,158,11,0.35);
          transform: translateY(-1px);
        }
        .x-btn-inner:active { transform: scale(0.97); }
      `}</style>

      {/* Brick-wall login background */}
      <div className="login-bg min-h-screen flex items-center justify-center p-4 relative overflow-hidden">

        {/* Ambient orbs */}
        <div className="login-orb w-[380px] h-[380px] bg-blue-600/20  top-[-80px]  left-[-60px]"  style={{ animationDelay: '0s' }} />
        <div className="login-orb w-[320px] h-[320px] bg-amber-500/15 bottom-[-60px] right-[-40px]" style={{ animationDelay: '-6s' }} />

        {/* Card */}
        <div className="login-card relative z-10 w-full max-w-sm">
          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl shadow-2xl shadow-black/50 p-8 flex flex-col items-center gap-6">

            {/* Logo */}
            <Link to="/" className="flex flex-col items-center gap-3 group">
              <img
                src="/bf-logo.svg"
                alt="BlockForge"
                className="h-16 w-16 object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <span className="text-2xl font-black tracking-tight text-white">BlockForge</span>
            </Link>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {/* Copy */}
            <div className="text-center space-y-1.5">
              <h1 className="text-lg font-bold text-zinc-100">Sign in to start earning</h1>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-[220px] mx-auto">
                Complete Web3 social tasks and earn USDC directly to your wallet.
              </p>
            </div>

            {/* X OAuth button */}
            <button
              id="signin-with-x"
              onClick={() => authApi.initiateXLogin()}
              className="x-btn-inner w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-black text-sm text-black"
            >
              <XIcon />
              Continue with X
              <ArrowRight size={14} />
            </button>

            {/* Terms */}
            <p className="text-[10px] text-zinc-600 text-center leading-relaxed max-w-[230px]">
              By continuing, you agree to BlockForge's{' '}
              <span className="text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors">Terms of Service</span>
              {' '}and{' '}
              <span className="text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors">Privacy Policy</span>.
            </p>
          </div>

          {/* Back to landing */}
          <div className="mt-5 text-center">
            <Link to="/" className="text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors">
              ← Back to BlockForge
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
