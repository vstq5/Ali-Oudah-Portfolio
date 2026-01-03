import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const lastPercentRef = useRef<number>(-1);

  useEffect(() => {
    const tl = gsap.timeline();

    if (progressRef.current) {
      gsap.set(progressRef.current, { transformOrigin: 'left center', scaleX: 0, force3D: true });
    }

    // Animate text fade in
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );

    // Animate progress bar with counter
    tl.to(progressRef.current, {
      scaleX: 1,
      duration: 2,
      ease: 'none',
      force3D: true,
      onUpdate: function () {
        if (percentRef.current) {
          const nextPercent = Math.round(this.progress() * 100);
          if (lastPercentRef.current !== nextPercent) {
            lastPercentRef.current = nextPercent;
            percentRef.current.textContent = `${nextPercent}%`;
          }
        }
      },
    });

    // Fade out preloader
    tl.to(preloaderRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: 'power2.inOut',
      force3D: true,
      onComplete: () => {
        if (preloaderRef.current) {
          preloaderRef.current.style.display = 'none';
        }
        onComplete();
      },
    });

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={preloaderRef} className="preloader">
      {/* Background glow elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-2xl md:blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 md:w-64 md:h-64 bg-secondary/10 rounded-full blur-2xl md:blur-3xl" />

      {/* Logo / Name */}
      <div ref={textRef} className="text-center z-10">
        <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground mb-2">
          Ali <span className="text-primary font-medium">Oudah</span>
        </h1>
        <p className="text-muted-foreground text-lg tracking-widest uppercase">
          IT Specialist
        </p>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-container mt-12 z-10">
        <div ref={progressRef} className="progress-bar" />
      </div>

      {/* Percentage */}
      <span
        ref={percentRef}
        className="mt-4 text-sm text-muted-foreground font-mono z-10"
      >
        0%
      </span>
    </div>
  );
};

export default Preloader;
