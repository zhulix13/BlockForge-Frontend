import { Bell, Inbox, Clock, CheckCheck, Trash2 } from "lucide-react";
import { useGetNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "../../api/hooks/notification.hooks";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Skeleton } from "../../components/ui/Skeleton";
import { cn } from "../../lib/cn";
import { useState } from "react";

import { PageMetadata } from "../../components/ui/PageMetadata";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data: notificationsRes, isLoading } = useGetNotifications({ page, limit: 20 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = notificationsRes?.data?.data ?? [];
  const metadata = notificationsRes?.data?.metadata;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <PageMetadata 
        title="Notifications" 
        description="Stay updated with system announcements and task status changes on BlockForge." 
      />
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-3">
            <Bell className="text-amber-500" size={28} />
            Notifications
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Stay updated with your activities and announcements.</p>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={() => markAllRead.mutate()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <CheckCheck size={16} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="glass rounded-2xl overflow-hidden border border-zinc-800/50">
        <div className="divide-y divide-zinc-800/40">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-6">
                <Skeleton className="h-12 w-full" />
              </div>
            ))
          ) : notifications.length === 0 ? (
            <div className="py-24 text-center">
              <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                <Inbox size={32} className="text-zinc-700" />
              </div>
              <p className="text-zinc-500 italic">No notifications in your history.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => !notification.isRead && markRead.mutate(notification.id)}
                className={cn(
                  "p-6 flex gap-4 transition-all hover:bg-white/[0.01] cursor-pointer group relative",
                  !notification.isRead && "bg-amber-500/[0.02]"
                )}
              >
                {!notification.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                )}
                
                <div className={cn(
                  "w-12 h-12 rounded-xl shrink-0 flex items-center justify-center border",
                  notification.type === 'ADMIN_BROADCAST' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' :
                  notification.type === 'PAYOUT_STATUS' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                  'bg-zinc-900 border-zinc-800 text-zinc-500'
                )}>
                  <Bell size={20} />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      {notification.type.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-mono">
                      <Clock size={10} />
                      {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <h3 className={cn(
                    "text-base font-bold",
                    notification.isRead ? "text-zinc-400" : "text-zinc-100"
                  )}>
                    {notification.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed max-w-3xl">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {metadata && metadata.totalPages > 1 && (
          <div className="px-6 py-4 bg-zinc-900/30 border-t border-zinc-800/50 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Page {page} of {metadata.totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-400 disabled:opacity-30 hover:bg-zinc-800 transition-colors"
              >
                Previous
              </button>
              <button 
                disabled={page === metadata.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-400 disabled:opacity-30 hover:bg-zinc-800 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
