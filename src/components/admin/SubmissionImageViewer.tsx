import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Move } from "lucide-react";
import { cn } from "../../lib/cn";

interface SubmissionImageViewerProps {
  src: string;
  alt?: string;
  className?: string;
}

export function SubmissionImageViewer({ src, alt = "Proof Screenshot", className }: SubmissionImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Motion values for panning
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const resetTransform = () => {
    setScale(1);
    animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
  };

  const handleZoom = (delta: number) => {
    setScale((prev) => Math.min(Math.max(prev + delta, 1), 4));
  };

  // Reset pan if scale is 1
  useEffect(() => {
    if (scale === 1) {
      x.set(0);
      y.set(0);
    }
  }, [scale, x, y]);

  return (
    <div className={cn("relative group flex flex-col h-full bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800/50", className)}>
      {/* Header / Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={() => handleZoom(-0.5)}
          disabled={scale <= 1}
          className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-30"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>
        
        <div className="px-2 min-w-12 text-center text-[10px] font-mono font-bold text-amber-500">
          {scale.toFixed(1)}x
        </div>

        <button
          onClick={() => handleZoom(0.5)}
          disabled={scale >= 4}
          className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-30"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>

        <div className="w-px h-4 bg-white/10 mx-1" />

        <button
          onClick={resetTransform}
          className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Main Viewing Area */}
      <div 
        ref={containerRef}
        className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center min-h-[400px]"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        <motion.div
          style={{ 
            x, 
            y, 
            scale,
            touchAction: "none"
          }}
          drag={scale > 1}
          dragConstraints={containerRef}
          dragElastic={0.1}
          className="relative"
        >
          <img
            src={src}
            alt={alt}
            draggable={false}
            className="max-w-full max-h-[70vh] object-contain rounded shadow-2xl"
          />
        </motion.div>

        {/* Panning Overlay Indicator */}
        {scale > 1 && (
          <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/5 pointer-events-none">
            <Move size={12} className="text-zinc-500" />
            <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">Panning Enabled</span>
          </div>
        )}
      </div>

      {/* Status Bar / Hints */}
      <div className="px-4 py-3 bg-black/20 border-t border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
          <span className="flex items-center gap-1"><Maximize2 size={10} /> Full Resolution</span>
          <span className="flex items-center gap-1 uppercase tracking-tighter">Secure R2 Link</span>
        </div>
        <button 
          onClick={() => window.open(src, '_blank')}
          className="text-[10px] font-bold text-amber-500 hover:text-amber-400 transition-colors uppercase tracking-widest"
        >
          Open Original
        </button>
      </div>
    </div>
  );
}
