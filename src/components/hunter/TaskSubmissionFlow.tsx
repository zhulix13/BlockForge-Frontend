import { useState, useRef, useCallback } from "react";
import {
  ExternalLink,
  Upload,
  Heart,
  Repeat2,
  MessageCircle,
  UserPlus,
  CheckCircle2,
  Link2,
  ImagePlus,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { getFriendlyErrorMessage } from "../../lib/error.utils";
import {
  useGetUploadUrl,
  useCreateSubmission,
} from "../../api/hooks/submission.hooks";
import { ConfirmSubmissionModal } from "./ConfirmSubmissionModal";
import { useToast } from "../../store/toastStore";
import type { Task, TaskStep } from "../../api/types/task.types";

/* ─── Constants ─── */

const stepTypeIcons: Record<string, typeof Heart> = {
  FOLLOW: UserPlus,
  LIKE: Heart,
  RETWEET: Repeat2,
  COMMENT: MessageCircle,
};

const stepTypeColors: Record<string, string> = {
  FOLLOW: "bg-blue-500/10 text-blue-400",
  LIKE: "bg-pink-500/10 text-pink-400",
  RETWEET: "bg-emerald-500/10 text-emerald-400",
  COMMENT: "bg-amber-500/10 text-amber-400",
};

const stepActionLabels: Record<string, string> = {
  FOLLOW: "Follow this account",
  LIKE: "Like this tweet",
  RETWEET: "Retweet this",
  COMMENT: "Comment on this",
};

const stepActionIcons: Record<string, string> = {
  FOLLOW: "➕",
  LIKE: "👍",
  RETWEET: "🔁",
  COMMENT: "💬",
};

const proofPlaceholders: Record<string, string> = {
  COMMENT: "Paste your comment URL…",
  RETWEET: "Paste your retweet URL…",
  FOLLOW: "Paste proof link…",
  LIKE: "Paste proof link…",
};

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"] as const;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

/* ─── Helper: URL validation ─── */
function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

interface TaskSubmissionFlowProps {
  task: Task;
}

export function TaskSubmissionFlow({ task }: TaskSubmissionFlowProps) {
  const toast = useToast();

  /* Mutations */
  const uploadUrlMutation = useGetUploadUrl();
  const createSubmission = useCreateSubmission();

  /* State */
  const [proofLinks, setProofLinks] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Steps that require a proof link */
  const stepsRequiringLink = task?.steps?.filter((s) => s.requiresLink) ?? [];

  /* ─── File selection ─── */
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate type
      if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
        toast.error("Invalid file type", "Only PNG, JPEG, and WebP are allowed.");
        return;
      }
      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File too large", "Maximum file size is 2 MB.");
        return;
      }

      // Store file and preview (DO NOT UPLOAD YET)
      setSelectedFile(file);
      setScreenshotPreview(URL.createObjectURL(file));
      
      // Reset file input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [toast],
  );

  const clearScreenshot = () => {
    setSelectedFile(null);
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
      setScreenshotPreview(null);
    }
  };

  /* ─── Validation ─── */
  const allProofsFilled = stepsRequiringLink.every(
    (step) => proofLinks[step.id] && isValidUrl(proofLinks[step.id]),
  );
  const canSubmit = !!selectedFile && allProofsFilled;

  /* ─── Submission Logic (Upload then Submit) ─── */
  const handleSubmit = async () => {
    if (!task || !selectedFile) return;

    setIsSubmitting(true);

    try {
      // Phase 1: Get presigned POST data and Upload
      const uploadRes = await uploadUrlMutation.mutateAsync({
        fileName: selectedFile.name,
        contentType: selectedFile.type as (typeof ACCEPTED_TYPES)[number],
        taskId: task.id,
      });

      const { url, key } = uploadRes.data;
      
      // Phase 1.5: Direct PUT upload to R2
      const uploadResponse = await fetch(url, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error("R2 Upload Error:", errorText);
        throw new Error("Failed to upload screenshot to storage.");
      }

      // Phase 2: Create the main submission
      const proofs = stepsRequiringLink
        .filter((step) => proofLinks[step.id])
        .map((step) => ({
          taskStepId: step.id,
          proofLink: proofLinks[step.id],
        }));

      await createSubmission.mutateAsync({
        taskId: task.id,
        screenshotUrl: key, // Use the key from Phase 1
        proofs,
      });

      toast.success(
        "Submission sent!",
        "Your proof has been submitted and is now pending review.",
      );
      setShowConfirmModal(false);
      
      // Reset form
      setProofLinks({});
      clearScreenshot();
    } catch (err: any) {
      console.error("Submission error:", err);
      toast.error(
        "Submission failed",
        getFriendlyErrorMessage(err)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Steps */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-stone-300 uppercase tracking-wider">
          Steps to Complete
        </h3>
        <div className="space-y-2">
          {task.steps?.map((step: TaskStep, index: number) => {
            const StepIcon = stepTypeIcons[step.type] ?? CheckCircle2;
            const colorClass =
              stepTypeColors[step.type] ?? "bg-stone-800/50 text-stone-400";
            return (
              <div
                key={step.id}
                className="glass rounded-xl p-4 space-y-3 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                      colorClass,
                    )}
                  >
                    <StepIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-stone-600">
                        #{index + 1}
                      </span>
                      <h4 className="text-sm font-medium text-stone-200">
                        {step.title}
                      </h4>
                    </div>
                    {step.description && (
                      <p className="text-xs text-stone-500 mt-0.5">
                        {step.description}
                      </p>
                    )}
                    <a
                      href={step.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium mt-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      <span>{stepActionIcons[step.type]}</span>
                      {stepActionLabels[step.type] ?? "Open link"}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Proof link input — only for steps with requiresLink */}
                {step.requiresLink && (
                  <div className="ml-13 pl-0 sm:ml-[52px]">
                    <label className="flex items-center gap-1.5 text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1.5">
                      <Link2 size={12} />
                      Proof Link
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder={proofPlaceholders[step.type] ?? "Paste proof link…"}
                      value={proofLinks[step.id] ?? ""}
                      onChange={(e) =>
                        setProofLinks((prev) => ({
                          ...prev,
                          [step.id]: e.target.value,
                        }))
                      }
                      className={cn(
                        "w-full px-3 py-2 rounded-lg text-sm transition-colors",
                        "bg-stone-900/80 border text-stone-200 placeholder:text-stone-600",
                        "focus:outline-none focus:ring-1",
                        proofLinks[step.id] && !isValidUrl(proofLinks[step.id])
                          ? "border-red-500/50 focus:ring-red-500/30"
                          : "border-stone-700/50 focus:border-blue-500/50 focus:ring-blue-500/30",
                      )}
                    />
                    {proofLinks[step.id] && !isValidUrl(proofLinks[step.id]) && (
                      <p className="text-[11px] text-red-400 mt-1">
                        Please enter a valid URL
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit section */}
      <div className="glass rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-stone-300">Submit Proof</h3>
        <p className="text-xs text-stone-500">
          Upload a single overview screenshot showing you've completed all steps.
          {stepsRequiringLink.length > 0 &&
            " Make sure you've also provided proof links for all required steps above."}
        </p>

        {/* Screenshot preview area */}
        {screenshotPreview ? (
          <div className="relative rounded-lg overflow-hidden border border-stone-700/50">
            <img
              src={screenshotPreview}
              alt="Screenshot preview"
              className="w-full max-h-48 object-cover"
            />
            <button
              onClick={clearScreenshot}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-stone-300 hover:text-white hover:bg-black/90 transition-colors"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
              <p className="text-xs text-blue-400 flex items-center gap-1">
                <CheckCircle2 size={12} />
                Screenshot selected
              </p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              "border-stone-700/50 hover:border-blue-500/30 hover:bg-blue-500/5",
            )}
          >
            <ImagePlus size={28} className="mx-auto text-stone-600 mb-2" />
            <p className="text-sm text-stone-400">
              Click to select overview screenshot
            </p>
            <p className="text-[11px] text-stone-600 mt-1">
              PNG, JPG, WebP up to 2MB
            </p>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Submit button */}
        <button
          type="button"
          onClick={() => setShowConfirmModal(true)}
          disabled={!canSubmit || isSubmitting}
          className={cn(
            "w-full py-2.5 rounded-lg text-sm font-semibold transition-all",
            canSubmit
              ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-blue-600/30 text-blue-200/40 cursor-not-allowed",
          )}
        >
          <span className="flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Upload size={16} />
                Submit Proof
              </>
            )}
          </span>
        </button>

        {/* Helper text */}
        {!canSubmit && (
          <p className="text-[11px] text-stone-600 text-center">
            {!selectedFile && "Select a screenshot"}
            {!selectedFile && !allProofsFilled && " and "}
            {!allProofsFilled && "fill in all required proof links"}
            {" to submit."}
          </p>
        )}
      </div>

      {/* Confirmation modal */}
      <ConfirmSubmissionModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSubmit}
        isSubmitting={isSubmitting}
        taskTitle={task.title}
        rewardUsdc={task.rewardUsdc}
        stepCount={task.steps?.length ?? 0}
        proofCount={stepsRequiringLink.length}
      />
    </>
  );
}
