import { useState, useEffect } from "react";
import { Megaphone, X, ArrowRight } from "lucide-react";
import { useGetNotifications, useMarkNotificationRead } from "../../api/hooks/notification.hooks";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export function BroadcastBanner() {
  const { data: notificationsRes } = useGetNotifications({ limit: 5 });
  const markRead = useMarkNotificationRead();
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  // Find the latest unread admin broadcast
  const latestBroadcast = notificationsRes?.data?.data?.find(
    (n) => n.type === "ADMIN_BROADCAST" && !n.isRead && n.id !== dismissedId
  );

  const handleDismiss = () => {
    if (latestBroadcast) {
      // Mark as read in backend to permanently dismiss
      markRead.mutate(latestBroadcast.id);
      setDismissedId(latestBroadcast.id);
    }
  };

  if (!latestBroadcast) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-amber-500 border-b border-amber-600 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="hidden sm:flex w-8 h-8 rounded-full bg-black/10 items-center justify-center shrink-0">
              <Megaphone size={16} className="text-black" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-tighter text-black/60 leading-none mb-0.5">
                Official Announcement
              </p>
              <p className="text-sm font-bold text-black truncate">
                {latestBroadcast.title}: <span className="font-medium opacity-90">{latestBroadcast.message}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link 
              to="/notifications" 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/10 hover:bg-black/20 text-[11px] font-bold text-black transition-colors"
            >
              View History
              <ArrowRight size={12} />
            </Link>
            <button 
              onClick={handleDismiss}
              className="p-1.5 hover:bg-black/10 rounded-lg text-black transition-colors"
              title="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
