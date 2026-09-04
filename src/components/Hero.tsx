import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HeroDiagram from '@/components/HeroDiagram';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

/**
 * Freelance hero — warm cream ground, navy type on the left, and the
 * Shopify → implementation → Zoho diagram on the right. Motion is one masked
 * line reveal plus a soft fade for the diagram, then stillness.
 */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<Array<HTMLElement | null>>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const [reduce] = useState(prefersReducedMotion);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = lineRefs.current.filter(Boolean);
      const rest = [subtitleRef.current, ctaRef.current, diagramRef.current].filter(Boolean);

      // reduced motion still needs the opacity-0 elements revealed
      if (reduce) {
        gsap.set([...lines, ...rest], { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        lines,
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.1, duration: 0.95, ease: 'power4.out', force3D: true },
        0.2
      )
        .fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: 'power2.out' },
          '-=0.55'
        )
        .fromTo(
          ctaRef.current,
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out' },
          '-=0.45'
        )
        .fromTo(
          diagramRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out' },
          '-=0.75'
        );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduce]);

  // gentle magnetic pull on the primary CTA, pointer-fine only
  useEffect(() => {
    if (reduce) return;
    const el = ctaRef.current?.querySelector<HTMLElement>('[data-magnetic]');
    if (!el || !window.matchMedia?.('(pointer: fine)')?.matches) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.16);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.16);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [reduce]);

  const scrollTo = (sel: string) => {
    document.querySelector(sel)?.scrollIntoView({ behavior: 'smooth' });
  };

  const headlineLines: Array<{ text: string; className: string }> = [
    { text: 'Shopify stores.', className: 'text-ink' },
    { text: 'Zoho systems.', className: 'text-ink' },
    { text: 'Less manual work.', className: 'text-ink-subtle' },
  ];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative overflow-hidden bg-canvas pb-20 pt-32 lg:pb-28 lg:pt-36"
    >
      {/* 0.81 : 1 is the mockup's type-to-diagram split. It also has to leave the
          longest headline line ("Less manual work.", 603px at 72px) on one line —
          drop the ratio and it wraps. */}
      <div className="shell grid w-full items-center gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,0.81fr)_minmax(0,1fr)] xl:gap-x-16">
        {/* ── type ──────────────────────────────────────────────────────── */}
        <div className="max-w-[42rem]">
          <div className="overflow-hidden pb-1">
            <span
              ref={(el) => {
                lineRefs.current[0] = el;
              }}
              className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-ink opacity-0 md:text-xs"
            >
              Shopify + Zoho Implementation
            </span>
          </div>

          <h1 className="mt-5 font-display text-[clamp(2.3rem,4.6vw,4.5rem)] font-medium leading-[1.06] tracking-tight">
            {headlineLines.map((line, i) => (
              <span key={line.text} className="block overflow-hidden">
                <span
                  ref={(el) => {
                    lineRefs.current[i + 1] = el;
                  }}
                  className={`block opacity-0 ${line.className}`}
                >
                  {line.text}
                </span>
              </span>
            ))}
          </h1>

          <p
            ref={subtitleRef}
            className="mt-7 max-w-[30rem] text-[clamp(1rem,1.3vw,1.1rem)] leading-[1.65] text-ink-muted opacity-0"
          >
            I build and connect the systems behind growing businesses — from Shopify
            storefronts to Zoho CRM, inventory, support, and automation workflows.
          </p>

          <div
            ref={ctaRef}
            className="mt-10 flex flex-col items-stretch gap-4 opacity-0 sm:flex-row sm:items-center sm:gap-6"
          >
            <Button
              data-magnetic
              size="lg"
              className="h-[52px] rounded-[10px] border-0 bg-ink px-7 text-base font-medium text-canvas transition-colors duration-150 hover:bg-band"
              onClick={() => scrollTo('#contact')}
            >
              Talk about your setup
            </Button>
            <button
              type="button"
              className="group inline-flex items-center justify-center gap-2 px-2 py-3 text-base font-medium text-ink transition-colors duration-150 hover:text-brand-ink sm:justify-start"
              onClick={() => scrollTo('#projects')}
            >
              View selected work
              <ArrowRight
                size={17}
                className="shrink-0 text-brand transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden
              />
            </button>
          </div>
        </div>

        {/* ── diagram ───────────────────────────────────────────────────── */}
        <div ref={diagramRef} className="opacity-0">
          <HeroDiagram />
        </div>
      </div>
    </section>
  );
};

export default Hero;
