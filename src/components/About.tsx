import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import LiveStatus from '@/components/LiveStatus';
import SpotifyNowPlaying from '@/components/SpotifyNowPlaying';
import {
  siCisco,
  siLinux,
  siPython,
  siVmware,
} from 'simple-icons';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: 'Linux', icon: siLinux },
  { name: 'Cisco', icon: siCisco },
  { name: 'VMware', icon: siVmware },
  { name: 'Python', icon: siPython },
];

const About = () => {
  const CITY = 'Kuwait City';
  const TIMEZONE = 'Asia/Kuwait';
  const profileImage = '/assets/ali.png';
  const resumePdf = '/assets/Ali_Oudah_Resum.pdf';

  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Section fade in
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Image slide in from left — no filter blur, use transform+opacity only
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      // Content fade in — no filter blur, use opacity only
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
          },
        }
      );

      // Heading stagger reveal (words)
      if (headingRef.current) {
        const splitTitle = new SplitType(headingRef.current, { types: 'lines,words' });
        gsap.set(splitTitle.lines, { overflow: 'hidden' });

        if (prefersReducedMotion) {
          gsap.set(splitTitle.words, { yPercent: 0, opacity: 1 });
        } else {
          gsap.fromTo(
            splitTitle.words,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.04,
              force3D: true,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 60%',
              },
            }
          );
        }
      }

      // Skills stagger animation
      gsap.fromTo(
        skillsRef.current?.children || [],
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-1/4 right-0 w-[300px] h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-[radial-gradient(circle_at_center,hsl(var(--secondary)/0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div ref={imageRef} className="relative mx-auto lg:mx-0 w-full max-w-[400px] md:max-w-[420px]">
            <div className="relative w-full flex items-end justify-center">
              {/* Composite lighting: glow is CSS-generated, image stays fully transparent (no bg). */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -z-10 left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[560px] md:h-[560px] bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.25)_0%,transparent_70%)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -z-10 left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[440px] md:h-[440px] rounded-full border border-primary/20 opacity-30"
              />
              <img
                src={profileImage}
                alt="Ali Oudah - IT Specialist"
                className="relative z-10 w-full h-auto select-none pointer-events-none origin-bottom scale-[1.06]"
                style={{
                  WebkitMaskImage:
                    'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                  maskImage:
                    'linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: '100% 100%',
                  maskSize: '100% 100%',
                  filter: 'sepia(0.2) brightness(0.9)',
                }}
              />
            </div>

            <div className="mt-6 flex justify-center lg:justify-start">
              <div className="flex flex-col items-center lg:items-start gap-3">
                <LiveStatus city={CITY} timeZone={TIMEZONE} />
                <SpotifyNowPlaying />
              </div>
            </div>
          </div>

          {/* Content */}
          <div
            ref={contentRef}
            className="text-center lg:text-left flex flex-col justify-center h-full"
          >
            <span className="inline-flex w-fit mx-auto lg:mx-0 items-center rounded-full border border-primary/30 px-3 py-1 text-xs uppercase tracking-widest text-primary">
              ABOUT ME
            </span>
            <h2 ref={headingRef} className="font-display text-3xl md:text-4xl lg:text-5xl font-light mt-4 mb-6">
              Crafting Immersive <span className="highlight-text font-medium">Digital Experiences.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed md:leading-loose mb-10">
              I'm an <strong className="font-semibold text-foreground">IT Specialist</strong> focused on
              <strong className="font-semibold text-foreground"> troubleshooting</strong>,
              <strong className="font-semibold text-foreground"> system administration</strong>, and
              <strong className="font-semibold text-foreground"> user support</strong>. I enjoy keeping
              environments stable and secure, and I build simple automation and tools that make day-to-day work faster.
            </p>

            {/* CTA */}
            <div className="flex justify-center lg:justify-start mb-2">
              <Button
                variant="outline"
                className="bg-transparent border-foreground/30 text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                asChild
              >
                <a href={resumePdf} download="Ali_Oudah_Resume.pdf">
                  Download CV
                </a>
              </Button>
            </div>

            {/* Skills grid */}
            <div ref={skillsRef} className="flex flex-wrap justify-center lg:justify-start gap-6 mt-8">
              {skills.map((skill) => (
                <div
                  key={skill.name}
                  className="group flex flex-col items-center gap-2 cursor-default"
                  style={{ ['--tech-color' as unknown as keyof CSSProperties]: `#${skill.icon.hex}` } as CSSProperties}
                >
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    className="tech-icon h-7 w-7"
                  >
                    <path d={skill.icon.path} fill={`#${skill.icon.hex}`} />
                  </svg>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground/80 transition-colors duration-300 group-hover:text-[color:var(--tech-color)]">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade into the next section (Projects) */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-b from-transparent to-background z-10" />
    </section>
  );
};

export default About;
