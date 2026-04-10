import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { BlueprintSvg } from '@/components/ui/blueprint-svg';
import { AnimatedGridPattern } from '@/components/ui/animated-grid-pattern';
import { Meteors } from '@/components/ui/meteors';

interface HeroProps {
  introReady?: boolean;
}

const Hero = ({ introReady = true }: HeroProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<Array<HTMLElement | null>>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

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
      className="relative min-h-[100svh] flex items-center overflow-hidden bg-background"
    >
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="text-primary/20 absolute inset-0 h-full w-full opacity-50"
        />
        <div className="absolute inset-0">
          <Meteors number={15} />
        </div>
      </div>

      {/* Blueprint Engine layer: Technical drawing illustration */}
      <div className="absolute right-[-20%] md:right-0 top-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 pointer-events-none mix-blend-screen z-0">
        <BlueprintSvg />
      </div>

      {/* Content — Left aligned on desktop for split layout */}
      <div className="relative z-20 w-full container mx-auto px-6 lg:px-12 pointer-events-none pt-24 md:pt-0">
        <div className="max-w-3xl text-left">
          <div className="mb-6 flex flex-col gap-2">
            <div className="overflow-hidden pb-2">
              <h1
                ref={(el) => { lineRefs.current[0] = el; }}
                className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight opacity-0 origin-bottom text-white/90"
              >
                Hi, I'm
              </h1>
            </div>

            <div className="overflow-hidden py-2" style={{ marginTop: '-8px' }}>
              <h1
                ref={(el) => { lineRefs.current[1] = el; }}
                className="text-6xl sm:text-8xl md:text-9xl lg:text-[140px] font-extralight tracking-tighter opacity-0 origin-bottom leading-[1.0] lg:leading-[0.9]"
              >
                <span className="text-white drop-shadow-2xl">Ali Alosimi</span>
              </h1>
            </div>

            <div className="overflow-hidden mt-4 pt-2">
              <span
                ref={(el) => { lineRefs.current[2] = el; }}
                className="text-3xl sm:text-4xl md:text-5xl text-accent block opacity-0 origin-bottom font-light"
              >
                Precision Engineer.
              </span>
            </div>
          </div>

          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mb-12 opacity-0 leading-relaxed font-light"
          >
            Building high-performance software with surgical precision.
            Focused on scalable architectures, fluid interfaces, and flawless execution.
          </p>

          <div ref={ctaRef} className="flex flex-col sm:flex-row items-start gap-5 opacity-0">
            <Button
              size="lg"
              className="bg-accent text-white hover:bg-accent/90 transition-all duration-300 text-lg px-10 py-7 shadow-glow-secondary-sm hover:shadow-glow-secondary pointer-events-auto rounded-none border border-accent/50"
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
              className="border-border bg-transparent hover:bg-white/5 transition-all duration-300 text-lg px-10 py-7 pointer-events-auto rounded-none text-white/90"
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
