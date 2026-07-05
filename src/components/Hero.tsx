import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

const PORTRAIT = '/assets/portrait-ali.jpg';

/**
 * Editorial hero — near-black canvas, low-key portrait dissolving into the
 * background, quiet factual meta row. Type carries the message; motion is a
 * single masked line reveal, then stillness.
 */
const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const lineRefs = useRef<Array<HTMLElement | null>>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [reduce] = useState(prefersReducedMotion);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = lineRefs.current.filter(Boolean);
      const rest = [subtitleRef.current, ctaRef.current].filter(Boolean);

      // reduced motion still needs the opacity-0 elements revealed
      if (reduce) {
        gsap.set([portraitRef.current, ...lines, ...rest], { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(
        portraitRef.current,
        { opacity: 0, scale: 1.03 },
        { opacity: 1, scale: 1, duration: 1.6, ease: 'power2.out', force3D: true },
        0
      )
        .fromTo(
          lines,
          { yPercent: 115, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.11, duration: 1.0, ease: 'power4.out', force3D: true },
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
    { text: 'Ali Oudah.', className: 'text-cream' },
    { text: 'Reliable systems,', className: 'text-sand/60' },
    { text: 'kept running.', className: 'text-sand/60' },
  ];

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden bg-[#0A0B0D] pt-28 pb-28"
    >
      {/* low-key portrait, anchored right, dissolving into the canvas */}
      {/* bg on the wrapper is load-bearing: animation transforms isolate the
          blend, so the img's `lighten` must resolve against this layer */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-[88%] sm:w-[64%] lg:w-[48%] pointer-events-none max-lg:opacity-40 bg-[#0A0B0D]"
      >
        <img
          ref={portraitRef}
          src={PORTRAIT}
          alt=""
          className="absolute bottom-0 right-0 h-[96%] w-full object-contain select-none opacity-0"
          style={{
            objectPosition: 'right bottom',
            // photo blacks are darker than the page background, so `lighten`
            // dissolves the frame edges into the canvas with no visible seam
            mixBlendMode: 'lighten',
          }}
        />
        {/* soften the photo's own bottom crop line */}
        <div className="absolute inset-x-0 bottom-0 h-[16%] bg-gradient-to-t from-[#0A0B0D] to-transparent" />
      </div>

      {/* type block */}
      <div
        className="relative z-10 w-full"
        style={{ paddingLeft: 'clamp(1.5rem, 6vw, 7rem)', paddingRight: '1.5rem' }}
      >
        <div className="max-w-[640px]">
          <div className="overflow-hidden pb-1">
            <span
              ref={(el) => {
                lineRefs.current[0] = el;
              }}
              className="block opacity-0 uppercase tracking-[0.32em] text-[11px] md:text-xs text-sand/55"
            >
              IT &amp; Systems Engineer
            </span>
          </div>

          <h1 className="mt-5 font-display font-medium tracking-tight leading-[1.04] text-[clamp(2.6rem,5.8vw,4.9rem)]">
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
            className="mt-7 max-w-[30rem] opacity-0 text-sand/80 text-[clamp(1rem,1.4vw,1.15rem)] leading-[1.65]"
          >
            I manage CRM, ERP, and e-commerce platforms, and build the automation
            that connects them. Based in Kuwait City.
          </p>

          <div
            ref={ctaRef}
            className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-5 opacity-0"
          >
            <Button
              data-magnetic
              size="lg"
              className="h-[52px] px-8 text-base font-medium rounded-[10px] border-0 bg-cream text-[#0A0B0D] hover:bg-white transition-colors duration-150"
              onClick={() => scrollTo('#projects')}
            >
              View work
            </Button>
            <button
              type="button"
              className="group inline-flex items-center gap-2 text-base text-sand/75 hover:text-cream transition-colors duration-150 px-2 py-3"
              onClick={() => scrollTo('#contact')}
            >
              Contact
              <span className="block h-px w-6 bg-sand/40 group-hover:w-9 group-hover:bg-cream transition-all duration-200" />
            </button>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
