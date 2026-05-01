import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Role } from "../../api/types/shared.types";
import {
  ArrowRight,
  Zap,
  ShieldCheck,
  Wallet,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";

/* ─── Scroll-triggered fade-up hook ─── */
function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("lp-visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─── Step component ─── */
function Step({ n, label, desc }: { n: string; label: string; desc: string }) {
  const ref = useFadeUp();
  return (
    <div
      ref={ref}
      className="lp-fade-up flex flex-col items-center text-center px-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-400/5 border border-amber-500/30 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10">
        <span className="text-amber-400 font-black text-lg leading-none">
          {n}
        </span>
      </div>
      <h3 className="text-sm font-bold text-zinc-100 mb-1 tracking-wide uppercase">
        {label}
      </h3>
      <p className="text-xs text-zinc-500 leading-relaxed max-w-[180px]">
        {desc}
      </p>
    </div>
  );
}

/* ─── Feature card ─── */
function FeatureCard({
  icon: Icon,
  title,
  desc,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  accent: string;
}) {
  const ref = useFadeUp();
  return (
    <div
      ref={ref}
      className="lp-fade-up group relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/[0.13] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/40 overflow-hidden"
    >
      <div
        className={`absolute top-0 left-0 w-full h-[1px] ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />
      <div
        className={`w-10 h-10 rounded-xl ${accent.replace("bg-gradient-to-r", "bg-gradient-to-br").replace("/50", "/10")} flex items-center justify-center mb-4 border border-white/10`}
      >
        <Icon size={18} className="text-zinc-300" />
      </div>
      <h3 className="text-sm font-bold text-zinc-100 mb-2">{title}</h3>
      <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
    </div>
  );
}

const PLATFORM_CHIPS = [
  { label: "X (Twitter) Verified Tasks" },
  { label: "USDC Payouts" },
  { label: "Screenshot Proof" },
  { label: "No Lock-ups" },
  { label: "Instant Withdrawals" },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Social Quests",
    desc: "Like, follow, retweet, and comment on X to earn verified rewards — no crypto knowledge needed.",
    accent: "bg-gradient-to-r from-amber-500/50 to-amber-400/20",
  },
  {
    icon: ShieldCheck,
    title: "Screenshot Verification",
    desc: "Submit proof screenshots. Our team reviews every submission to maintain platform integrity.",
    accent: "bg-gradient-to-r from-blue-500/50 to-blue-400/20",
  },
  {
    icon: Wallet,
    title: "Instant USDC Payouts",
    desc: "Withdraw your earned balance directly to your crypto wallet — no lock-ups, no minimum.",
    accent: "bg-gradient-to-r from-emerald-500/50 to-emerald-400/20",
  },
];

const LandingPage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dashPath = user?.role === Role.USER ? "/hunter" : "/admin";

  // Header border on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const heroRef = useFadeUp();
  const statsRef = useFadeUp();
  const ctaRef = useFadeUp();

  return (
    <>
      {/* ═══════════ GLOBAL PAGE STYLES ═══════════ */}
      <style>{`
        html, body { overflow-x: hidden; max-width: 100%; }
        .lp-page { background: #09090b; min-height: 100vh; color: #fafafa; font-family: var(--font-sans, system-ui); position: relative; overflow: hidden; }

        /* Fade-up entrance */
        .lp-fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1); }
        .lp-visible  { opacity: 1; transform: translateY(0); }

        /* Ambient orb behind hero */
        @keyframes lp-orb-drift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(40px,-30px) scale(1.08); }
          66%      { transform: translate(-30px,20px) scale(0.95); }
        }
        .lp-orb {
          position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none;
          animation: lp-orb-drift 18s ease-in-out infinite;
        }

        /* X button shimmer */
        @keyframes lp-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .lp-x-btn {
          background: linear-gradient(110deg, #f59e0b 0%, #fbbf24 40%, #fef3c7 50%, #fbbf24 60%, #f59e0b 100%);
          background-size: 200% auto;
        }
        .lp-x-btn:hover { animation: lp-shimmer 1.4s linear infinite; }

        /* Divider gradient */
        .lp-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent); }
      `}</style>

      <div className="lp-page">
        {/* ─── Ambient orbs ─── */}
        <div
          className="lp-orb w-[500px] h-[500px] top-[-80px] left-[-100px] bg-blue-600/[0.12]"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="lp-orb w-[420px] h-[420px] top-[60px] right-[-100px] bg-amber-500/[0.10]"
          style={{ animationDelay: "-7s" }}
        />

        {/* ─────────── HEADER ─────────── */}
        <header
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
          style={{
            background: scrolled ? "rgba(9,9,11,0.85)" : "transparent",
            backdropFilter: scrolled ? "blur(16px)" : "none",
            borderBottom: scrolled
              ? "1px solid rgba(255,255,255,0.06)"
              : "none",
          }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src="/bf-logo.svg"
                alt="BlockForge"
                className="h-8 w-8 object-contain"
              />
              <span className="font-black text-base tracking-tight text-white hidden sm:block">
                BlockForge
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#how-it-works"
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                How it works
              </a>
              <a
                href="#features"
                className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
              >
                Features
              </a>
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated && user ? (
                <Link
                  to={dashPath}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-400 border border-amber-500/30 rounded-xl hover:bg-amber-500/10 transition-all"
                >
                  Dashboard <ArrowRight size={14} />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 text-xs font-bold text-black bg-white rounded-xl hover:bg-zinc-100 transition-all"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile: CTA + hamburger */}
            <div className="flex md:hidden items-center gap-2 mr-6">
              {isAuthenticated && user ? (
                <Link
                  to={dashPath}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-amber-400 border border-amber-500/30 rounded-xl hover:bg-amber-500/10 transition-all"
                >
                  Dashboard <ArrowRight size={12} />
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-[11px] font-bold text-black bg-white rounded-xl hover:bg-zinc-100 transition-all"
                >
                  Sign In
                </Link>
              )}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="p-2 text-zinc-400 hover:text-white"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-4 flex flex-col gap-3">
              <a
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
                className="text-xs font-semibold text-zinc-400 uppercase tracking-widest py-2"
              >
                How it works
              </a>
              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="text-xs font-semibold text-zinc-400 uppercase tracking-widest py-2"
              >
                Features
              </a>
              <div className="lp-divider my-1" />
              {isAuthenticated && user ? (
                <Link
                  to={dashPath}
                  className="flex items-center gap-2 text-sm font-bold text-amber-400 py-2"
                >
                  Dashboard <ArrowRight size={14} />
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/login");
                  }}
                  className="w-full py-3 text-sm font-bold text-black bg-white rounded-xl"
                >
                  Get Started
                </button>
              )}
            </div>
          )}
        </header>

        {/* ─────────── HERO ─────────── */}
        <section className="relative pt-36 pb-28 px-4 text-center">
          <div ref={heroRef} className="lp-fade-up max-w-4xl mx-auto space-y-7">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/20 text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Web3 Task Platform · Earn Real USDC
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.02] text-white">
              Complete tasks.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                Earn real USDC.
              </span>
            </h1>

            {/* Sub-copy */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              BlockForge connects crypto projects with social hunters. Complete
              on-chain verified tasks and withdraw USDC straight to your wallet.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => navigate("/login")}
                className="lp-x-btn flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-black text-sm text-black shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
              >
                Start Earning
                <ArrowRight size={16} />
              </button>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-zinc-300 border border-white/10 hover:bg-white/[0.04] transition-all"
              >
                How it works
              </a>
            </div>

            {/* Platform chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {PLATFORM_CHIPS.map(({ label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-zinc-400"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-400/70" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="lp-divider mx-auto max-w-4xl" />

        {/* ─────────── HOW IT WORKS ─────────── */}
        <section id="how-it-works" className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-3">
                Simple Process
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Three steps to your first payout
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
              {/* connector lines */}
              <div className="hidden sm:block absolute top-5 left-[calc(16.67%)] right-[calc(16.67%)] h-px bg-gradient-to-r from-amber-500/20 via-blue-500/20 to-amber-500/20" />
              <Step
                n="1"
                label="Connect with X"
                desc="Sign in securely using your X (Twitter) account. No password needed."
              />
              <Step
                n="2"
                label="Pick a Task"
                desc="Browse live bounties from Web3 projects — follow, like, retweet, or comment."
              />
              <Step
                n="3"
                label="Get Paid"
                desc="Submit your proof. Approved tasks credit USDC directly to your balance."
              />
            </div>
          </div>
        </section>

        <div className="lp-divider mx-auto max-w-4xl" />

        {/* ─────────── FEATURES ─────────── */}
        <section id="features" className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-3">
                Platform
              </p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Built for real earning
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FEATURES.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>

        <div className="lp-divider mx-auto max-w-4xl" />

        {/* ─────────── PLATFORM CHIPS (full row) ─────────── */}
        <section className="py-16 px-4">
          <div
            ref={statsRef}
            className="lp-fade-up max-w-3xl mx-auto flex flex-wrap justify-center gap-3"
          >
            {PLATFORM_CHIPS.map(({ label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.07] text-xs font-semibold text-zinc-400 tracking-wide"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 shrink-0" />
                {label}
              </span>
            ))}
          </div>
        </section>

        <div className="lp-divider mx-auto max-w-4xl" />

        {/* ─────────── CTA BANNER ─────────── */}
        <section className="py-24 px-4">
          <div
            ref={ctaRef}
            className="lp-fade-up max-w-3xl mx-auto text-center"
          >
            <div className="relative p-10 sm:p-14 rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.06] via-transparent to-blue-500/[0.04]">
              {/* bg glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
              <CheckCircle size={32} className="text-amber-400 mx-auto mb-5" />
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
                Ready to start forging?
              </h2>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto mb-8 leading-relaxed">
                Join thousands of hunters earning USDC every day. Free to join,
                instant payouts.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="lp-x-btn inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm text-black shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
              >
                Sign in with X
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* ─────────── FOOTER ─────────── */}
        <footer className="py-10 px-4 border-t border-white/[0.05]">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/bf-logo.svg"
                alt="BlockForge"
                className="h-6 w-6 object-contain"
              />
              <span className="text-xs font-black text-zinc-500 tracking-tight">
                BlockForge
              </span>
            </div>
            <p className="text-[11px] text-zinc-600">
              © {new Date().getFullYear()} BlockForge. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">
                Terms
              </span>
              <span className="text-[11px] text-zinc-600 hover:text-zinc-400 cursor-pointer transition-colors">
                Privacy
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;
