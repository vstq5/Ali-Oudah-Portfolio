import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

const RESUME_PDF = '/assets/Ali_Oudah_Resum.pdf';

const experience = [
  {
    role: 'Lead Technical Coordinator',
    org: 'Aafaq Publishing & Distribution',
    period: '2025–Present',
  },
  {
    role: 'Student Mentor, Cybersecurity',
    org: 'CODED · Kuwait University',
    period: '2025',
  },
  {
    role: 'IT Support Specialist',
    org: 'Ticketmaster · 26th Gulf Cup',
    period: '2024–25',
  },
  {
    role: 'BSc Information Technology',
    org: 'Arab Open University',
    period: 'In progress',
  },
];

const capabilities = [
  {
    label: 'Systems',
    items: 'Zoho CRM & ERP, workflow automation, e-commerce operations',
  },
  {
    label: 'Code',
    items: 'Python, JavaScript, Java, Node.js',
  },
  {
    label: 'Foundation',
    items: 'Networking, cybersecurity, IT project management',
  },
];

const sidePadding = { paddingLeft: 'clamp(1.5rem, 6vw, 7rem)', paddingRight: 'clamp(1.5rem, 6vw, 7rem)' };

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<Array<HTMLElement | null>>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const [reduce] = useState(prefersReducedMotion);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = lineRefs.current.filter(Boolean);
      const rows = experienceRef.current ? Array.from(experienceRef.current.children) : [];

      if (reduce) {
        gsap.set([...lines, bodyRef.current, ...rows], { opacity: 1, y: 0, yPercent: 0 });
        return;
      }

      gsap.fromTo(
        lines,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.95,
          ease: 'power4.out',
          force3D: true,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 74%' },
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
          scrollTrigger: { trigger: bodyRef.current, start: 'top 84%' },
        }
      );

      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: { trigger: row, start: 'top 90%' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  const statementLines: Array<{ text: string; className: string }> = [
    { text: 'I like systems that are boring:', className: 'text-cream' },
    { text: 'stable, secure, and fast.', className: 'text-sand/60' },
  ];

  return (
    <section id="about" ref={sectionRef} className="relative bg-[#0A0B0D] py-28 md:py-36">
      <div style={sidePadding}>
        {/* statement bridge */}
        <h2 className="font-display font-medium tracking-tight leading-[1.08] text-[clamp(1.9rem,4.2vw,3.4rem)] max-w-4xl">
          {statementLines.map((line, i) => (
            <span key={line.text} className="block overflow-hidden">
              <span
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className={`block opacity-0 ${line.className}`}
              >
                {line.text}
              </span>
            </span>
          ))}
        </h2>

        {/* narrative + capabilities */}
        <div ref={bodyRef} className="opacity-0 mt-14 md:mt-16 grid md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <p className="text-sand/75 text-base md:text-[17px] leading-[1.7] max-w-[34rem]">
              I&apos;m an IT student at Arab Open University and Lead Technical Coordinator
              at Aafaq Publishing &amp; Distribution in Kuwait. I keep CRM, ERP, and
              e-commerce systems running and build the automation that connects them.
              On the side, I mentor students in Python and JavaScript through the CODED
              youth program.
            </p>
            <div className="mt-8">
              <Button
                variant="outline"
                className="h-11 px-6 text-sm font-medium rounded-[8px] border border-cream/20 bg-transparent text-cream hover:bg-cream/10 hover:border-cream/50 transition-colors"
                asChild
              >
                <a href={RESUME_PDF} download="Ali_Oudah_Resume.pdf">
                  Download resume
                </a>
              </Button>
            </div>
          </div>

          <div>
            {capabilities.map((cap) => (
              <div key={cap.label} className="py-4 border-t border-cream/10 grid grid-cols-[7rem_1fr] gap-4">
                <span className="text-sm font-medium text-cream/85">{cap.label}</span>
                <span className="text-sm text-sand/65 leading-relaxed">{cap.items}</span>
              </div>
            ))}
          </div>
        </div>

        {/* experience strip */}
        <div className="mt-20 md:mt-24">
          <p className="text-xs uppercase tracking-[0.2em] text-sand/45 mb-6">Experience</p>
          <div ref={experienceRef} className="border-b border-cream/10">
            {experience.map((item) => (
              <div
                key={item.role}
                className="opacity-0 grid grid-cols-1 sm:grid-cols-[1.2fr_1fr_auto] gap-1 sm:gap-6 items-baseline py-5 border-t border-cream/10"
              >
                <span className="text-base md:text-lg font-medium text-cream/90">{item.role}</span>
                <span className="text-sm text-sand/60">{item.org}</span>
                <span className="text-sm text-sand/45 sm:text-right tabular-nums">{item.period}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
