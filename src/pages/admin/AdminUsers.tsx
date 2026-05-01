import { useState } from "react";
import { 
  Users, 
  Search, 
  Shield, 
  User as UserIcon, 
  Ban, 
  CheckCircle, 
  Copy,
  Wallet,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { 
  useGetAdminUsers, 
  useGetAdminUserDetail, 
  useUpdateUserRole, 
  useUpdateUserStatus 
} from "../../api/hooks/admin.hooks";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { Skeleton } from "../../components/ui/Skeleton";
import { Modal } from "../../components/ui/Modal";
import { useAuthStore } from "../../store/authStore";
import { useToast } from "../../store/toastStore";
import { PageMetadata } from "../../components/ui/PageMetadata";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const toast = useToast();
  const currentUser = useAuthStore((s) => s.user);
  const isSuperAdmin = currentUser?.role === "SUPERADMIN";

  const { data: usersRes, isLoading } = useGetAdminUsers({ page, limit: 10, search: searchTerm });
  const { data: userDetailRes, isLoading: detailsLoading } = useGetAdminUserDetail(selectedUserId);
  
  const roleMutation = useUpdateUserRole();
  const statusMutation = useUpdateUserStatus();

  const users = usersRes?.data?.data ?? [];
  const metadata = usersRes?.data?.metadata;
  const userDetail = userDetailRes?.data;

  const handleCopyWallet = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Wallet address copied!");
  };

  const handleRoleUpdate = async (userId: string, newRole: "USER" | "ADMIN") => {
    try {
      await roleMutation.mutateAsync({ userId, input: { role: newRole } });
      toast.success(`User promoted to ${newRole}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleStatusUpdate = async (userId: string, isActive: boolean) => {
    try {
      await statusMutation.mutateAsync({ userId, input: { isActive } });
      toast.success(isActive ? "User unbanned" : "User banned");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <PageMetadata 
        title="User Management" 
        description="Monitor platform users, manage roles, and oversee account status." 
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight">User Management</h2>
          <p className="text-sm text-zinc-500 mt-1">Oversee hunters and platform moderators.</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input 
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
          />
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden border border-zinc-800/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">User</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Wallet</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Stats</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Role</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/40">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4"><Skeleton className="h-5 w-full" /></td>
                    ))}
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 italic">No users found.</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.profileImage ? (
                          <img src={user.profileImage} alt={user.username} className="w-8 h-8 rounded-full ring-1 ring-zinc-800" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                            {user.username[0].toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-200 truncate">{user.displayName || user.username}</p>
                          <p className="text-[10px] text-zinc-500 font-mono truncate">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.walletAddress ? (
                        <div className="flex items-center gap-2 max-w-[120px]">
                          <code className="text-[10px] font-mono text-amber-500/80 truncate">{user.walletAddress}</code>
                          <button onClick={() => handleCopyWallet(user.walletAddress!)} className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors">
                            <Copy size={12} />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-zinc-600 italic">No wallet</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 text-[10px] text-zinc-400 font-mono">
                        <span title="Submissions">📋 {user._count.submissions}</span>
                        <span title="Withdrawals">💰 {user._count.withdrawals}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
                        user.role === 'SUPERADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                        user.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-medium text-zinc-400">{user.isActive ? 'Active' : 'Banned'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => setSelectedUserId(user.id)}
                        className="p-1.5 rounded-md text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {metadata && metadata.totalPages > 1 && (
          <div className="px-6 py-4 bg-zinc-900/30 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-500">Page {page} of {metadata.totalPages}</span>
            <div className="flex gap-2">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 rounded border border-zinc-800 text-xs text-zinc-400 disabled:opacity-30"
              >
                Previous
              </button>
              <button 
                disabled={page === metadata.totalPages}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 rounded border border-zinc-800 text-xs text-zinc-400 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      <Modal 
        open={!!selectedUserId} 
        onClose={() => setSelectedUserId(null)} 
        title="User Details"
        size="lg"
      >
        {detailsLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : userDetail && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-zinc-800">
                {userDetail.profileImage ? (
                  <img src={userDetail.profileImage} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-xl font-bold">
                    {userDetail.username[0].toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-zinc-100 truncate">{userDetail.displayName || userDetail.username}</h3>
                <p className="text-xs text-zinc-500 font-mono">@{userDetail.username}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="text-[10px]">
                    <span className="text-zinc-600 uppercase font-bold tracking-tighter">Total Earnings</span>
                    <p className="text-amber-500 font-black text-sm">${Number(userDetail.balanceUsdc).toFixed(2)}</p>
                  </div>
                  <div className="text-[10px]">
                    <span className="text-zinc-600 uppercase font-bold tracking-tighter">Joined</span>
                    <p className="text-zinc-300 font-mono text-sm">{new Date(userDetail.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <StatusBadge status={userDetail.isActive ? 'ACTIVE' : 'REJECTED'} />
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase text-zinc-400 bg-zinc-800 text-center">
                  {userDetail.role}
                </span>
              </div>
            </div>

            {/* Management Actions */}
            {isSuperAdmin && userDetail.role !== 'SUPERADMIN' && (
              <div className="p-4 rounded-xl border border-zinc-800 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-2">
                  <Shield size={14} className="text-amber-500" />
                  Administrative Controls
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userDetail.role === 'USER' ? (
                    <button 
                      onClick={() => handleRoleUpdate(userDetail.id, 'ADMIN')}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-all text-xs font-bold"
                    >
                      <Shield size={14} /> Promote to Admin
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleRoleUpdate(userDetail.id, 'USER')}
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 transition-all text-xs font-bold"
                    >
                      <UserIcon size={14} /> Downgrade to User
                    </button>
                  )}

                  <button 
                    onClick={() => handleStatusUpdate(userDetail.id, !userDetail.isActive)}
                    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all text-xs font-bold ${
                      userDetail.isActive 
                        ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20' 
                        : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                    }`}
                  >
                    {userDetail.isActive ? <><Ban size={14} /> Ban User</> : <><CheckCircle size={14} /> Unban User</>}
                  </button>
                </div>
              </div>
            )}

            {/* Transaction Ledger */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Recent Transactions</h4>
              <div className="divide-y divide-zinc-800/40 border border-zinc-800 rounded-lg overflow-hidden">
                {userDetail.transactions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-zinc-600 italic">No transaction history.</div>
                ) : (
                  userDetail.transactions.map((tx) => (
                    <div key={tx.id} className="p-3 flex items-center justify-between hover:bg-white/[0.01]">
                      <div>
                        <p className="text-xs text-zinc-300 font-medium">{tx.type.replace('_', ' ')}</p>
                        <p className="text-[9px] text-zinc-600 font-mono mt-0.5">{new Date(tx.createdAt).toLocaleString()}</p>
                      </div>
                      <span className={`text-xs font-bold tabular-nums ${Number(tx.amountUsdc) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {Number(tx.amountUsdc) >= 0 ? '+' : ''}${Math.abs(Number(tx.amountUsdc)).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedUserId(null)}
                className="px-6 py-2 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all text-xs font-bold"
              >
                Close Detail
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
