import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Spline from '@splinetool/react-spline';
import type { Application } from '@splinetool/runtime';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface HeroProps {
  introReady?: boolean;
  allowSplineMount?: boolean;
  onSplineReady?: () => void;
}

// Using the .splinecode export payload rather than the hosted iframe URL
const SPLINE_URL =
  'https://prod.spline.design/s5a1oz59GTYhm-FM/scene.splinecode';

const Hero = ({ introReady = true, allowSplineMount = false, onSplineReady }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<Array<HTMLElement | null>>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const shape1Ref = useRef<HTMLDivElement>(null);
  const shape2Ref = useRef<HTMLDivElement>(null);
  const shape3Ref = useRef<HTMLDivElement>(null);

  const [splineReady, setSplineReady] = useState(false);
  // Defer iframe mount so the initial paint / preloader is never blocked
  const [mountIframe, setMountIframe] = useState(false);
  const splineNotifiedRef = useRef(false);

  // Ref to hold the Spline application instance for scroll pausing
  const splineAppRef = useRef<Application | null>(null);

  // Mount the Spline canvas ONLY after the Preloader hits 100% to protect 60fps GSAP
  useEffect(() => {
    if (allowSplineMount) {
      const id = requestAnimationFrame(() => setMountIframe(true));
      return () => cancelAnimationFrame(id);
    }
  }, [allowSplineMount]);

  // IntersectionObserver to pause the 3D WebGL loop when scrolled out of view
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            splineAppRef.current?.play();
          } else {
            splineAppRef.current?.stop();
          }
        });
      },
      { rootMargin: '100px 0px 0px 0px' }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!introReady) return;
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (!subtitleRef.current) return;

      const tl = gsap.timeline();

      // Ensure elements are un-hidden before animating
      gsap.set([...lineRefs.current.filter(Boolean), subtitleRef.current, ctaRef.current], { opacity: 1 });

      tl.fromTo(
        lineRefs.current.filter(Boolean),
        { yPercent: 120, rotateX: -20, opacity: 0 },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1.2,
          ease: 'power4.out',
          force3D: true,
        }
      )
        .fromTo(
          subtitleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', force3D: true },
          '-=0.7'
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', force3D: true },
          '-=0.5'
        );
    }, sectionRef);

    return () => {
      // Revert GSAP animations
      ctx.revert();
    };
  }, [introReady]);

  const scrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100svh] flex items-center overflow-hidden"
    >
      {/* Infinite Cyberpunk Grid Background */}
      <div className="cyberpunk-grid opacity-30"></div>

      {/* Spline 3D Model — Pushed to the right on desktop to avoid UI overlap */}
      <div
        className={`spline-container absolute inset-0 md:left-auto md:right-0 md:w-[60%] lg:w-[65%] z-[5] transition-opacity duration-700 ${splineReady ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        style={{
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 75%)',
        }}
      >
        {mountIframe && (
          <Spline
            className="spline-downscale"
            scene={SPLINE_URL}
            onLoad={(splineApp) => {
              splineAppRef.current = splineApp;
              // Add a solid delay to ensure WebGL shaders are fully compiled & painted
              // preventing the model from popping in as a black void
              window.setTimeout(() => {
                setSplineReady(true);
                if (!splineNotifiedRef.current) {
                  splineNotifiedRef.current = true;
                  onSplineReady?.();
                }
              }, 1500);
            }}
          />
        )}
      </div>

      {/* Removed full-screen overlay gradient to prevent WebGL GPU blending overdraw */}

      {/* Floating geometric shapes using native CSS animations instead of JS GSAP */}
      <div
        ref={shape1Ref}
        className="absolute z-10 top-1/4 left-[10%] w-16 h-16 border border-primary/30 rotate-45 opacity-60 pointer-events-none float"
      />
      <div
        ref={shape2Ref}
        className="absolute z-10 top-1/3 right-[15%] w-24 h-24 border border-secondary/20 rounded-full opacity-40 pointer-events-none float"
        style={{ animationDelay: '1s', animationDuration: '7s' }}
      />
      <div
        ref={shape3Ref}
        className="absolute z-10 bottom-1/3 left-[20%] w-12 h-12 bg-primary/10 rotate-12 opacity-50 pointer-events-none float"
        style={{ animationDelay: '2s', animationDuration: '5s' }}
      />

      {/* 
        DOM background glows removed to ensure the Spline WebGL canvas 
        bakes its 3D shadows cleanly into the True Black background. 
      */}

      {/* Content — Left aligned on desktop for split layout */}
      <div className="relative z-20 w-full container mx-auto px-6 lg:px-12 pointer-events-none pt-24 md:pt-0">
        <div className="max-w-2xl text-left">
          <div className="mb-6 flex flex-col gap-2">
            <div className="overflow-hidden pb-2">
              <h1
                ref={(el) => { lineRefs.current[0] = el; }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight opacity-0 origin-bottom"
              >
                Hi, I'm
              </h1>
            </div>

            <div className="overflow-hidden py-2" style={{ marginTop: '-8px' }}>
              <h1
                ref={(el) => { lineRefs.current[1] = el; }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight opacity-0 origin-bottom"
              >
                <span className="text-gradient drop-shadow-2xl">Ali Alosimi</span>
              </h1>
            </div>

            <div className="overflow-hidden mt-2 pt-2">
              <span
                ref={(el) => { lineRefs.current[2] = el; }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl text-muted-foreground block opacity-0 origin-bottom"
              >
                Software Engineer
              </span>
            </div>
          </div>

          <p
            ref={subtitleRef}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground/90 max-w-xl mb-12 opacity-0 leading-relaxed"
          >
            Keeping systems reliable, secure, and efficient — with a passion for clean
            automation and modern digital experiences.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row items-start gap-5 opacity-0">
            <Button
              size="lg"
              className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-lg px-10 py-7 shadow-glow-primary-sm hover:shadow-glow-primary pointer-events-auto rounded-xl"
              onClick={() => {
                const element = document.querySelector('#contact');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Contact Me
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-foreground/20 bg-background/50 backdrop-blur-sm hover:bg-foreground/10 hover:border-foreground/40 transition-all duration-300 text-lg px-10 py-7 pointer-events-auto rounded-xl"
              onClick={scrollToProjects}
            >
              View Projects
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute z-20 bottom-10 left-1/2 -translate-x-1/2 animate-bounce pointer-events-none">
        <ArrowDown className="text-muted-foreground" size={24} />
      </div>
    </section>
  );
};

export default Hero;
