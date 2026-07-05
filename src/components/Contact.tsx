import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

const EMAIL = 'alialoudah5@gmail.com';

const socials = [
  { label: 'GitHub', href: 'https://github.com/vstq5' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ali-oudah' },
];

const sidePadding = { paddingLeft: 'clamp(1.5rem, 6vw, 7rem)', paddingRight: 'clamp(1.5rem, 6vw, 7rem)' };

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [reduce] = useState(prefersReducedMotion);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set([headingRef.current, bodyRef.current], { opacity: 1, y: 0, yPercent: 0 });
        return;
      }

      gsap.fromTo(
        headingRef.current,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.95,
          ease: 'power4.out',
          force3D: true,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 76%' },
        }
      );

      gsap.fromTo(
        bodyRef.current,
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="contact" ref={sectionRef} className="relative bg-[#0A0B0D] py-28 md:py-40">
      <div style={sidePadding}>
        <div className="overflow-hidden">
          <h2
            ref={headingRef}
            className="font-display opacity-0 font-medium tracking-tight text-cream text-[clamp(2.8rem,7vw,5.5rem)] leading-none"
          >
            Let&apos;s talk.
          </h2>
        </div>

        <div ref={bodyRef} className="opacity-0">
          <p className="mt-7 max-w-[30rem] text-sand/75 text-base md:text-[17px] leading-[1.7]">
            Open to roles and freelance work. Email is the fastest way to reach me.
          </p>

          <a
            href={`mailto:${EMAIL}`}
            className="group inline-block mt-12 font-display font-medium tracking-tight text-cream text-[clamp(1.35rem,3.8vw,3rem)] leading-tight break-all"
          >
            {EMAIL}
            <span className="block h-px mt-3 bg-cream/20 group-hover:bg-cream transition-colors duration-200" />
          </a>

          <div className="mt-14 flex flex-wrap items-center gap-8">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm text-sand/70 hover:text-cream transition-colors duration-150"
              >
                {s.label}
                <ArrowUpRight
                  size={15}
                  className="text-sand/40 group-hover:text-cream group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-150"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
