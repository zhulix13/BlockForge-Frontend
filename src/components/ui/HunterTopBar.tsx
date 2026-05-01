import { useState } from "react";
import { Menu, Wallet, LogOut, Shield, ExternalLink } from "lucide-react";
import { useSidebarStore } from "../../store/sidebarStore";
import { useAuthStore } from "../../store/authStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { Modal } from "./Modal";
import { NotificationPopover } from "./NotificationPopover";

interface TopBarProps {
  title?: string;
}

export function HunterTopBar({ title }: TopBarProps) {
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const { user, logout } = useAuthStore();
  const isMobile = useIsMobile();
  const [showProfile, setShowProfile] = useState(false);

  const availableBalance = user?.availableBalanceUsdc ?? "0.00";
  const pendingBalance = user?.pendingBalanceUsdc ?? "0.00";

  return (
    <>
      <header className="sticky top-0 z-30 h-14 sm:h-16 bg-stone-900/80 backdrop-blur-md border-b border-stone-800/60 flex items-center gap-4 px-4 sm:px-6">
        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 -ml-2 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <Menu size={22} />
          </button>
        )}

        {/* Title */}
        <div className="flex-1 min-w-0">
          {title && (
            <h1 className="text-base sm:text-lg font-semibold text-stone-100 truncate">
              {title}
            </h1>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Balance pills */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Wallet size={12} className="text-emerald-400 hidden sm:block" />
              <span className="text-[11px] sm:text-sm font-bold tabular-nums text-emerald-400">
                ${Number(availableBalance).toFixed(2)}
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono text-emerald-500/60 uppercase hidden sm:block">avail</span>
            </div>

            {Number(pendingBalance) > 0 && (
              <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <span className="text-[11px] sm:text-sm font-bold tabular-nums text-amber-500">
                  ${Number(pendingBalance).toFixed(2)}
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-amber-500/60 uppercase hidden sm:block">pending</span>
              </div>
            )}
          </div>

          {/* Functional Notifications */}
          <NotificationPopover />

          {/* User Button */}
          <button 
            onClick={() => setShowProfile(true)}
            className="flex items-center gap-2.5 pl-2 border-l border-stone-800 transition-opacity hover:opacity-80 active:scale-95"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-stone-800"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-bold">
                {user?.username?.[0]?.toUpperCase() ?? "?"}
              </div>
            )}
            {!isMobile && (
              <div className="text-right">
                <p className="text-sm font-medium text-stone-200 leading-tight">
                  {user?.displayName || user?.username}
                </p>
                <p className="text-[11px] font-mono text-blue-400/70 uppercase">
                  hunter
                </p>
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Profile Modal */}
      <Modal 
        open={showProfile} 
        onClose={() => setShowProfile(false)} 
        title="My Profile"
        size={isMobile ? "full" : "sm"}
      >
        <div className="space-y-6">
          <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 relative overflow-hidden">
             <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-blue-600/10 to-transparent" />
             
             <div className="relative">
                {user?.profileImage ? (
                  <img src={user.profileImage} className="w-20 h-20 rounded-full ring-4 ring-zinc-800 shadow-xl" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-2xl font-bold">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 rounded-full border-4 border-zinc-900">
                  <Shield size={12} className="text-zinc-900" />
                </div>
             </div>

             <div className="mt-4">
                <h3 className="text-xl font-bold text-stone-50">{user?.displayName || user?.username}</h3>
                <p className="text-sm text-stone-500">@{user?.username}</p>
             </div>

             <div className="grid grid-cols-2 gap-4 w-full mt-6">
                <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                  <p className="text-[10px] text-stone-600 uppercase font-black tracking-widest">Earnings</p>
                  <p className="text-lg font-bold text-stone-50">${Number(user?.balanceUsdc || 0).toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50">
                  <p className="text-[10px] text-stone-600 uppercase font-black tracking-widest">Available</p>
                  <p className="text-lg font-bold text-emerald-400">${Number(user?.availableBalanceUsdc || 0).toFixed(2)}</p>
                </div>
             </div>
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                      <ExternalLink size={18} />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">X Profile</p>
                      <p className="text-sm font-medium text-zinc-300">@{user?.username}</p>
                   </div>
                </div>
                <a 
                  href={`https://x.com/${user?.username}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-1.5 text-zinc-500 hover:text-blue-400 transition-colors"
                >
                   <ExternalLink size={16} />
                </a>
             </div>

             {user?.walletAddress && (
               <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <Wallet size={18} />
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">EVM Wallet</p>
                        <p className="text-sm font-mono text-zinc-300 truncate max-w-[150px]">{user.walletAddress}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigator.clipboard.writeText(user.walletAddress!)}
                    className="p-1.5 text-zinc-500 hover:text-emerald-400 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </button>
               </div>
             )}

             <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                <div className="flex items-center gap-3">
                   <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500">
                      <Shield size={18} />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] text-zinc-600 uppercase font-black tracking-widest">Joined At</p>
                      <p className="text-sm font-medium text-zinc-300">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                      </p>
                   </div>
                </div>
             </div>
          </div>

          <button 
            onClick={() => { logout(); setShowProfile(false); }}
            className="w-full py-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 text-red-500 border border-red-500/10 transition-all font-bold flex items-center justify-center gap-3 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Sign Out
          </button>
        </div>
      </Modal>
    </>
  );
}
