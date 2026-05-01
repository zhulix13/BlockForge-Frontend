import React, { useState } from "react";
import { Bell, CheckCheck, Inbox, Clock, ChevronRight } from "lucide-react";
import { useGetNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "../../api/hooks/notification.hooks";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import { AnimatePresence, motion } from "framer-motion";

import { useAuthStore } from "../../store/authStore";
import { Role } from "../../api/types/shared.types";

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthStore();
  const { data: notificationsRes, isLoading } = useGetNotifications({ limit: 15 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  // ONLY SHOW UNREAD
  const allNotifications = notificationsRes?.data?.data ?? [];
  const notifications = allNotifications.filter(n => !n.isRead);
  const unreadCount = notifications.length;

  const viewAllPath = user?.role === Role.USER ? "/notifications" : "/admin/notifications";

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-xl transition-all duration-300",
          isOpen 
            ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)] z-[101]" 
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 z-10"
        )}
      >
        <Bell size={20} className={cn(isOpen && "animate-bounce-short")} />
        {unreadCount > 0 && (
          <span className={cn(
            "absolute top-1.5 right-1.5 w-4 h-4 text-[10px] font-black flex items-center justify-center rounded-full ring-2 transition-all",
            isOpen 
              ? "bg-black text-amber-500 ring-amber-500" 
              : "bg-amber-500 text-black ring-zinc-900"
          )}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px]" 
              onClick={() => setIsOpen(false)} 
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-20 sm:top-auto sm:mt-3 sm:w-[400px] z-[101] origin-top sm:origin-top-right"
            >
              <div className="bg-[#0c0a09] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col max-h-[600px]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                      <Bell size={18} />
                    </div>
                    <div>
                       <h3 className="text-sm font-bold text-zinc-100">Unread Activity</h3>
                       <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">
                         {unreadCount} New Alerts
                       </p>
                    </div>
                  </div>
                  
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAllRead.mutate()}
                      className="p-2 rounded-lg hover:bg-white/5 text-zinc-500 hover:text-amber-500 transition-all group"
                      title="Mark all as read"
                    >
                      <CheckCheck size={18} />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/5">
                  {isLoading ? (
                    <div className="p-12 text-center flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                      <p className="text-xs text-zinc-500 font-medium">Fetching updates...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-16 text-center">
                      <div className="w-16 h-16 bg-zinc-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <Inbox size={32} className="text-zinc-700" />
                      </div>
                      <p className="text-sm font-bold text-zinc-300">All caught up!</p>
                      <p className="text-xs text-zinc-500 mt-1 italic">No unread notifications.</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className="px-6 py-5 transition-all relative group cursor-pointer bg-white/[0.01] hover:bg-white/[0.03]"
                        onClick={() => markRead.mutate(notification.id)}
                      >
                        <div className="absolute left-0 top-5 bottom-5 w-1 bg-amber-500 rounded-r-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                        
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className={cn(
                                "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md",
                                notification.type === 'ADMIN_BROADCAST' ? 'bg-amber-500/10 text-amber-500' :
                                notification.type === 'PAYOUT_STATUS' ? 'bg-emerald-500/10 text-emerald-400' :
                                'bg-zinc-800 text-zinc-500'
                            )}>
                              {notification.type.replace('_', ' ')}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                              <Clock size={10} />
                              {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm font-bold text-zinc-100 group-hover:text-amber-500 transition-colors">
                              {notification.title}
                            </p>
                            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mt-1">
                              {notification.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer */}
                <Link 
                  to={viewAllPath} 
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-4 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center gap-2 transition-all border-t border-white/5 group"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-zinc-100">
                    See All Activity
                  </span>
                  <ChevronRight size={14} className="text-zinc-600 group-hover:text-amber-500 transition-all" />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
