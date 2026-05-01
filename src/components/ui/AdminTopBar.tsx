import { Menu } from "lucide-react";
import { useSidebarStore } from "../../store/sidebarStore";
import { useAuthStore } from "../../store/authStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { NotificationPopover } from "./NotificationPopover";

interface TopBarProps {
  /** Current page title shown on desktop */
  title?: string;
}

export function AdminTopBar({ title }: TopBarProps) {
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);
  const user = useAuthStore((s) => s.user);
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800/60 flex items-center gap-4 px-4 sm:px-6">
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Menu size={22} />
        </button>
      )}

      {/* Title */}
      <div className="flex-1 min-w-0">
        {title && (
          <h1 className="text-base sm:text-lg font-semibold text-zinc-100 truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Functional Notifications */}
        <NotificationPopover />

        {/* User */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.username}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-800"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm font-bold">
              {user?.username?.[0]?.toUpperCase() ?? "?"}
            </div>
          )}
          {!isMobile && (
            <div className="text-right">
              <p className="text-sm font-medium text-zinc-200 leading-tight">
                {user?.displayName || user?.username}
              </p>
              <p className="text-[11px] font-mono text-amber-500/70 uppercase">
                {user?.role}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
