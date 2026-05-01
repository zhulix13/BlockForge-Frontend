import { X, ExternalLink, Calendar, ShieldCheck, HelpCircle } from "lucide-react";
import { useGetMySubmissionDetails } from "../../api/hooks/submission.hooks";
import { Skeleton } from "../ui/Skeleton";
import { StatusBadge } from "../ui/StatusBadge";
import { cn } from "../../lib/cn";

interface SubmissionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissionId: string;
}

export function SubmissionDetailModal({ isOpen, onClose, submissionId }: SubmissionDetailModalProps) {
  const { data: response, isLoading } = useGetMySubmissionDetails(submissionId);
  const submission = response?.data;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden glass rounded-2xl shadow-2xl flex flex-col border border-stone-800 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-900/50">
          <div>
            <h3 className="font-bold text-stone-100 flex items-center gap-2">
              <ShieldCheck size={18} className="text-blue-500" />
              Submission Details
            </h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-lg text-stone-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-6 space-y-6">
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            </div>
          ) : submission ? (
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Proof Info */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Task Info</h4>
                  <div className="p-4 rounded-xl bg-stone-900/50 border border-stone-800">
                    <p className="text-sm font-bold text-stone-200">{submission.task.title}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="text-xs font-mono text-blue-400">${submission.task.rewardUsdc} USDC</div>
                      <StatusBadge status={submission.status} />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Submission Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-xs">
                      <Calendar size={14} className="text-stone-700" />
                      <span className="text-stone-500">Submitted:</span>
                      <span className="text-stone-300">{new Date(submission.createdAt).toLocaleString()}</span>
                    </div>
                    {submission.reviewedAt && (
                      <div className="flex items-center gap-3 text-xs">
                        <Calendar size={14} className="text-stone-700" />
                        <span className="text-stone-500">Reviewed:</span>
                        <span className="text-stone-300">{new Date(submission.reviewedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {submission.status === "REJECTED" && (
                  <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <HelpCircle size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Rejection Reason</span>
                    </div>
                    <p className="text-xs text-red-200 leading-relaxed italic">
                      No specific reason provided. Contact support if you believe this is an error.
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-3">Verified Steps</h4>
                  <div className="space-y-2">
                    {submission.task.steps?.map((step: any) => {
                      const proof = submission.proofs?.find((p: any) => p.taskStepId === step.id);
                      return (
                        <div key={step.id} className="p-3 rounded-lg bg-stone-900/30 border border-stone-800/50 flex items-center justify-between group">
                          <div>
                            <p className="text-[11px] font-bold text-stone-300">{step.title}</p>
                            <p className="text-[9px] text-stone-600 uppercase tracking-tighter">{step.type}</p>
                          </div>
                          {proof?.proofLink && (
                            <a 
                              href={proof.proofLink} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="p-1.5 rounded-md bg-stone-800 text-stone-400 hover:text-blue-400 hover:bg-stone-700 transition-all"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Screenshot */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-stone-500">Proof Screenshot</h4>
                <div className="relative group rounded-xl overflow-hidden border border-stone-800 bg-black aspect-video flex items-center justify-center">
                  {submission.screenshotUrl ? (
                    <img 
                      src={submission.screenshotUrl} 
                      alt="Proof" 
                      className="max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-stone-700 text-xs italic">No screenshot provided</div>
                  )}
                </div>
                <p className="text-[10px] text-stone-600 text-center italic">
                  This image was uploaded as your primary proof of completion.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-stone-600 italic">Submission not found</div>
          )}
        </div>
      </div>
    </div>
  );
}
