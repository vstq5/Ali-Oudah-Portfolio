import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
  canComplete?: boolean;
  onProgressDone?: () => void;
  maxWaitMs?: number;
}

const BOOT_LOGS = [
  "INITIALIZING KERNEL...",
  "LOADING CORE MODULES...",
  "ESTABLISHING SECURE CONNECTION...",
  "MOUNTING DOM NODES...",
  "RETICULATING SPLINES...",
  "SYNCING TELEMETRY...",
  "COMPILING GEOMETRIES...",
  "SYSTEM_READY"
];

const Preloader = ({ onComplete, canComplete = true, onProgressDone, maxWaitMs = 15000 }: PreloaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const topHalfRef = useRef<HTMLDivElement>(null);
  const bottomHalfRef = useRef<HTMLDivElement>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  const [logText, setLogText] = useState(BOOT_LOGS[0]);

  const lastPercentRef = useRef<number>(-1);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const progressDoneRef = useRef(false);
  const canCompleteRef = useRef(canComplete);
  const forcedCompleteRef = useRef(false);

  useEffect(() => {
    canCompleteRef.current = canComplete;
    if (!timelineRef.current) return;
    if (progressDoneRef.current && (canComplete || forcedCompleteRef.current)) {
      timelineRef.current.play();
    }
  }, [canComplete]);

  useEffect(() => {
    const tl = gsap.timeline({ paused: false });
    timelineRef.current = tl;

    if (progressRef.current) {
      gsap.set(progressRef.current, { transformOrigin: 'left center', scaleX: 0, force3D: true });
    }

    // Animate content fade in
    tl.fromTo(
      contentRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' }
    );

    // Animate progress bar with counter and logs
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 2.2,
      ease: 'power1.inOut',
      force3D: true,
      onUpdate: function () {
        if (percentRef.current) {
          const nextPercent = Math.round(this.progress() * 100);
          if (lastPercentRef.current !== nextPercent) {
            lastPercentRef.current = nextPercent;
            // Pad start to maintain monospace width
            percentRef.current.textContent = String(nextPercent).padStart(3, '0');

            // Update terminal log based on percentage
            const logIndex = Math.min(
              Math.floor((nextPercent / 100) * BOOT_LOGS.length),
              BOOT_LOGS.length - 1
            );
            setLogText(BOOT_LOGS[logIndex]);
          }
        }
      },
    });

    // Hold at 100% until the app is ready to reveal (e.g., Spline loaded).
    tl.add(() => {
      progressDoneRef.current = true;
      if (onProgressDone) {
        // Fire asynchronously to avoid React state update warnings inside GSAP timeline
        window.setTimeout(onProgressDone, 0);
      }
      if (!canCompleteRef.current && !forcedCompleteRef.current) {
        tl.pause();
      }
    });

    // Fade out textual content quickly before geometric split
    tl.to(contentRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    });

    // Geometric Split Reveal
    tl.to(topHalfRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power4.inOut',
      force3D: true,
    }, "split");

    tl.to(bottomHalfRef.current, {
      yPercent: 100,
      duration: 0.9,
      ease: 'power4.inOut',
      force3D: true,
      onComplete: () => {
        if (preloaderRef.current) {
          preloaderRef.current.style.display = 'none';
        }
        onComplete();
      },
    }, "split");

    const safetyTimeout = window.setTimeout(() => {
      forcedCompleteRef.current = true;
      if (timelineRef.current && progressDoneRef.current) {
        timelineRef.current.play();
      }
    }, maxWaitMs);

    return () => {
      tl.kill();
      timelineRef.current = null;
      window.clearTimeout(safetyTimeout);
    };
  }, [maxWaitMs, onComplete]);

  return (
    <div ref={preloaderRef} className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden pointer-events-none">

      {/* Background Split Halves */}
      <div
        ref={topHalfRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#08090a] border-b border-[#28282c] origin-bottom will-change-transform"
      />
      <div
        ref={bottomHalfRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#08090a] border-t border-[#28282c] origin-top will-change-transform"
      />

      {/* Content */}
      <div ref={contentRef} className="z-10 w-full max-w-sm px-6 flex flex-col items-center">

        {/* Title Block */}
        <div className="flex flex-col items-center mb-8 border border-[#28282c] bg-white/[0.01] p-6 w-full">
          <span className="text-[10px] text-primary font-mono tracking-[0.2em] mb-4">
            [ SYS.VER // 2.4.0 ]
          </span>
          <h1 className="text-4xl font-extralight tracking-tight text-foreground text-center">
            Ali Alosimi
          </h1>
          <div className="h-px w-12 bg-[#28282c] my-4" />
          <p className="text-xs text-muted-foreground font-mono tracking-widest uppercase text-center">
            Software Engineer
          </p>
        </div>

        {/* Progress System */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex justify-between items-end">
            <span className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase">
              {logText}
            </span>
            <span className="text-xs text-primary font-mono tracking-widest flex items-center gap-1">
              <span ref={percentRef}>000</span>%
            </span>
          </div>

          {/* Precise 1px Loading Line */}
          <div className="w-full h-[1px] bg-[#28282c] overflow-hidden relative">
            <div
              ref={progressRef}
              className="absolute top-0 left-0 h-full w-full bg-secondary origin-left will-change-transform"
            />
          </div>
        </div>

      </div>
    </div >
  );
};

export default Preloader;
