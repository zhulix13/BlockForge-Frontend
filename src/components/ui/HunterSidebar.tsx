import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Compass,
  ClipboardCheck,
  Wallet,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../lib/cn";
import { useSidebarStore } from "../../store/sidebarStore";
import { useAuthStore } from "../../store/authStore";
import { useIsMobile } from "../../hooks/useIsMobile";

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const hunterNav: NavItem[] = [
  { label: "Dashboard", path: "/hunter", icon: LayoutDashboard },
  { label: "Browse Tasks", path: "/hunter/tasks", icon: Compass },
  { label: "My Submissions", path: "/hunter/submissions", icon: ClipboardCheck },
  { label: "Wallet", path: "/hunter/wallet", icon: Wallet },
];

export function HunterSidebar() {
  const { isCollapsed, isMobileOpen, toggle, setMobileOpen } = useSidebarStore();
  const { logout } = useAuthStore();
  const isMobile = useIsMobile();
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 h-16 shrink-0 border-b border-stone-800/60",
          isCollapsed && !isMobile && "justify-center px-0"
        )}
      >
        {/* Logo mark */}
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
          <span className="text-sm font-black text-white">B</span>
        </div>
        {(!isCollapsed || isMobile) && (
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-stone-100 tracking-tight">
              BlockForge
            </span>
            <span className="text-[10px] font-mono font-medium text-blue-400/80 uppercase">
              hunter
            </span>
          </div>
        )}

        {/* Mobile close */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto p-1.5 text-stone-500 hover:text-stone-300"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {hunterNav.map((item) => {
          const isActive =
            item.path === "/hunter"
              ? location.pathname === "/hunter"
              : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => isMobile && setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                "text-stone-400 hover:text-stone-200 hover:bg-stone-800/50",
                isActive && "nav-active-hunter text-blue-400",
                isCollapsed && !isMobile && "justify-center px-0"
              )}
            >
              <item.icon size={20} className="shrink-0" />
              {(!isCollapsed || isMobile) && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-stone-800/60 p-2 space-y-1">
        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={toggle}
            className={cn(
              "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-stone-500 hover:text-stone-300 hover:bg-stone-800/50 transition-colors",
              isCollapsed && "justify-center px-0"
            )}
          >
            {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!isCollapsed && <span>Collapse</span>}
          </button>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 transition-colors",
            isCollapsed && !isMobile && "justify-center px-0"
          )}
        >
          <LogOut size={18} />
          {(!isCollapsed || isMobile) && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );

  // Mobile: overlay
  if (isMobile) {
    return (
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-stone-900 border-r border-stone-800"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    );
  }

  // Desktop: fixed sidebar
  return (
    <aside
      className={cn(
        "sticky top-0 h-screen shrink-0 bg-stone-900 border-r border-stone-800/60 transition-[width] duration-200 ease-out overflow-hidden",
        isCollapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {sidebarContent}
    </aside>
  );
}
