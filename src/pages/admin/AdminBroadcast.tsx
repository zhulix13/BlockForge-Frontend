import React, { useState } from "react";
import { Megaphone, Send, AlertCircle, CheckCircle, Info, ShieldAlert } from "lucide-react";
import { useBroadcastNotification } from "../../api/hooks/notification.hooks";
import { useToast } from "../../store/toastStore";

import { PageMetadata } from "../../components/ui/PageMetadata";

export default function AdminBroadcast() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const broadcastMutation = useBroadcastNotification();
  const toast = useToast();

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    try {
      const result = await broadcastMutation.mutateAsync({ title, message });
      toast.success("Broadcast Sent!", `Message delivered to ${result.data.userCount} users.`);
      setTitle("");
      setMessage("");
    } catch (error: any) {
      toast.error("Failed to broadcast", error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <PageMetadata 
        title="System Broadcast" 
        description="Send platform-wide announcements to all BlockForge hunters via real-time notifications." 
      />
      <div>
        <h2 className="text-2xl font-bold text-zinc-100 tracking-tight flex items-center gap-3">
          <Megaphone className="text-amber-500" size={28} />
          System Broadcast
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          Send a global notification to all registered hunters on the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleBroadcast} className="glass rounded-2xl p-8 space-y-6 border border-zinc-800/50">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">
                Broadcast Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled Maintenance, New Feature Alert..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-zinc-700"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-500 ml-1">
                Announcement Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Details of the announcement..."
                rows={6}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-zinc-700 resize-none"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={broadcastMutation.isPending}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:hover:bg-amber-500 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                {broadcastMutation.isPending ? (
                  "Broadcasting..."
                ) : (
                  <>
                    <Send size={18} />
                    Deploy Broadcast
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar / Guidelines */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6 border border-zinc-800/50 bg-amber-500/[0.02]">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-4">
              <ShieldAlert size={16} className="text-amber-500" />
              Broadcasting Rules
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="mt-1"><CheckCircle size={14} className="text-emerald-500" /></div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Broadcasts are sent to <strong>all</strong> active users instantly via real-time SSE.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="mt-1"><Info size={14} className="text-blue-500" /></div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  A persistent record is saved in each user's notification history.
                </p>
              </li>
              <li className="flex gap-3">
                <div className="mt-1"><AlertCircle size={14} className="text-amber-500" /></div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Use sparingly. Frequent broadcasts can be disruptive to hunters.
                </p>
              </li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-6 border border-zinc-800/50">
            <h3 className="text-xs font-black uppercase tracking-tighter text-zinc-500 mb-4">Preview</h3>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
               <div className="flex items-center gap-2 mb-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                 <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">System Broadcast</span>
               </div>
               <p className="text-sm font-bold text-zinc-200">{title || "Your Title Here"}</p>
               <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{message || "Your message will appear here..."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
