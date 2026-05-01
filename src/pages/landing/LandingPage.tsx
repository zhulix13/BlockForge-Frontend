import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Role } from '../../api/types/shared.types';
import { ArrowRight, LayoutDashboard, Shield } from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const defaultPath = user.role === Role.USER ? '/hunter' : '/admin';
      navigate(defaultPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      <div className="absolute -bottom-10 right-0 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between relative z-10">
        <h1 className="text-2xl font-bold tracking-tighter">
          Block<span className="text-blue-500">Forge</span>
        </h1>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-bold transition-all"
        >
          Get Started
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative z-10">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
            The Marketplace for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Web3 Incentives
            </span>
          </h2>
          <p className="text-gray-400 text-xl sm:text-2xl max-w-2xl mx-auto leading-relaxed">
            Hunters earn USDC. Projects grow their ecosystem. <br /> 
            Everything powered by on-chain verification.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-bold text-lg transition-all transform active:scale-95 group"
            >
              Start Earning Now
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
          {[
            { 
              icon: <LayoutDashboard className="text-blue-400" />, 
              title: "Social Quests", 
              desc: "Like, follow, and engage to earn rewards instantly." 
            },
            { 
              icon: <Shield className="text-indigo-400" />, 
              title: "Verified Tasks", 
              desc: "On-chain and screenshot verification ensures fairness." 
            },
            { 
              icon: <ArrowRight className="text-purple-400" />, 
              title: "Fast Payouts", 
              desc: "Withdraw your USDC earnings directly to your Solana wallet." 
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-slate-900/50 backdrop-blur-lg border border-white/5 rounded-3xl hover:border-blue-500/30 transition-colors">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
