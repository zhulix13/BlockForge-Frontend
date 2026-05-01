import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ChevronLeft, 
  User, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Calendar,
  AlertCircle,
  Link2,
  Check,
  X
} from "lucide-react";
import { useGetSubmissionDetails, useReviewSubmission } from "../../api/hooks/submission.hooks";
import { SubmissionImageViewer } from "../../components/admin/SubmissionImageViewer";
import { getFriendlyErrorMessage } from "../../lib/error.utils";
import { Skeleton } from "../../components/ui/Skeleton";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../store/toastStore";
import { cn } from "../../lib/cn";

export default function AdminSubmissionDetail() {
  const { submissionId } = useParams<{ submissionId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [feedback, setFeedback] = useState("");

  const { data: submissionData, isLoading, error } = useGetSubmissionDetails(submissionId!);
  const reviewMutation = useReviewSubmission();

  const submission = submissionData?.data;

  const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
    if (!submissionId) return;

    try {
      await reviewMutation.mutateAsync({
        submissionId,
        input: { status, feedback }
      });
      toast.success(
        `Submission ${status.toLowerCase()}`,
        `The submission has been ${status.toLowerCase()} successfully.`
      );
      navigate("/admin/submissions");
    } catch (err: any) {
      toast.error("Review failed", getFriendlyErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-zinc-700 mb-4" />
        <h3 className="text-lg font-bold text-zinc-200">Submission not found</h3>
        <p className="text-sm text-zinc-500 mt-1 mb-6">The submission you are looking for does not exist or has been removed.</p>
        <Link to="/admin/submissions" className="px-4 py-2 bg-zinc-800 text-zinc-200 rounded-lg hover:bg-zinc-700 transition-colors">
          Back to Submissions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/submissions"
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Review Submission</h2>
              <StatusBadge status={submission.status} />
            </div>
            <p className="text-xs font-mono text-zinc-600 mt-1 uppercase tracking-widest">{submission.id}</p>
          </div>
        </div>

        {submission.status === 'PENDING' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleReview('REJECTED')}
              disabled={reviewMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg font-semibold text-sm transition-all active:scale-95 disabled:opacity-50"
            >
              <X size={16} />
              Reject
            </button>
            <button
              onClick={() => handleReview('APPROVED')}
              disabled={reviewMutation.isPending}
              className="flex items-center gap-2 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg font-bold text-sm transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
            >
              {reviewMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Approve
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Screenshot & Proofs */}
        <div className="lg:col-span-2 space-y-6">
          <section className="space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Proof Screenshot</h3>
            <SubmissionImageViewer src={submission.screenshotUrl} className="h-[600px]" />
          </section>

          {/* Task Steps & Proofs */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Task Requirements & Proofs</h3>
            <div className="space-y-3">
              {submission.task?.steps?.map((step: any) => {
                const proof = submission.proofs?.find((p: any) => p.taskStepId === step.id);
                
                return (
                  <div key={step.id} className="glass p-4 sm:p-5 rounded-xl border border-zinc-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-zinc-700/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono font-bold text-zinc-500 border border-zinc-700">
                          STEP {step.order + 1}
                        </span>
                        <h4 className="text-sm font-bold text-zinc-200">{step.title}</h4>
                      </div>
                      <p className="text-xs text-zinc-500 leading-relaxed max-w-md">{step.description}</p>
                    </div>

                    <div className="shrink-0">
                      {step.requiresLink ? (
                        proof ? (
                          <a 
                            href={proof.proofLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 transition-all text-xs font-semibold group/link"
                          >
                            <Link2 size={14} className="text-amber-600 group-hover/link:text-amber-500" />
                            View Proof Link
                            <ExternalLink size={12} className="opacity-50" />
                          </a>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-semibold">
                            <AlertCircle size={14} />
                            Missing Proof
                          </div>
                        )
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/50 text-zinc-500 border border-zinc-700/30 text-xs font-semibold italic">
                          <Check size={14} className="text-zinc-600" />
                          Verified in Screenshot
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Right: Context & Feedback */}
        <div className="space-y-6">
          {/* Hunter Info */}
          <section className="glass rounded-xl p-5 border border-zinc-800/50 space-y-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hunter Profile</h3>
            <a 
              href={`https://x.com/${submission.user?.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 group/hunter hover:bg-white/[0.02] p-2 -m-2 rounded-xl transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                {submission.user?.profileImage ? (
                  <img src={submission.user.profileImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-zinc-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-zinc-100 truncate group-hover/hunter:text-blue-400 transition-colors">
                    {submission.user?.displayName || submission.user?.username}
                  </h4>
                  <ExternalLink size={12} className="text-zinc-600 opacity-0 group-hover/hunter:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-zinc-500">@{submission.user?.username}</p>
              </div>
            </a>
            <div className="pt-4 border-t border-zinc-800/50 flex items-center justify-between">
              <span className="text-xs text-zinc-600">Joined</span>
              <span className="text-xs font-mono text-zinc-400">{submission.user?.createdAt ? new Date(submission.user.createdAt).toLocaleDateString() : 'N/A'}</span>
            </div>
          </section>

          {/* Task Context */}
          <section className="glass rounded-xl p-5 border border-zinc-800/50 space-y-4">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Task Details</h3>
            <div>
              <h4 className="text-sm font-bold text-zinc-200">{submission.task?.title}</h4>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{submission.task?.description}</p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/30">
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Reward</span>
              <span className="text-sm font-mono font-bold text-emerald-400">${submission.task?.rewardUsdc} USDC</span>
            </div>
          </section>

          {/* Admin Feedback */}
          {submission.status === 'PENDING' && (
            <section className="glass rounded-xl p-5 border border-zinc-800/50 space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Review Notes</h3>
              <textarea
                placeholder="Optional feedback for the hunter (e.g. why it was rejected)..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full h-32 px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-amber-500/30 focus:border-amber-500/50 transition-all resize-none"
              />
            </section>
          )}

          {/* Review Stats */}
          <section className="glass rounded-xl p-5 border border-zinc-800/50 space-y-4">
             <div className="flex items-center gap-2 text-zinc-500">
                <Calendar size={14} />
                <span className="text-xs font-medium uppercase tracking-tighter">Submitted on {new Date(submission.createdAt).toLocaleString()}</span>
             </div>
             {submission.reviewedAt && (
                <div className="flex items-center gap-2 text-zinc-500">
                  <CheckCircle2 size={14} className={cn(submission.status === 'APPROVED' ? 'text-emerald-500' : 'text-red-500')} />
                  <span className="text-xs font-medium uppercase tracking-tighter">Reviewed on {new Date(submission.reviewedAt).toLocaleString()}</span>
                </div>
             )}
          </section>
        </div>
      </div>
    </div>
  );
}
