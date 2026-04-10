import { useEffect, useRef, type CSSProperties } from 'react';
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
  const narrativeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
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

      // Identity Card slide/fade in
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, x: 40 },
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

      // Narrative slide/fade in
      gsap.fromTo(
        narrativeRef.current,
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
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
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
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,theme(colors.primary.DEFAULT/0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-20 max-w-6xl">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-20 items-stretch">
          
          {/* Narrative Block (Left) */}
          <div
            ref={narrativeRef}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex w-fit items-center border border-[#28282c] bg-[#0a0b0c] px-3 py-1 text-xs font-mono tracking-widest text-primary mb-6">
              ID-01 // NARRATIVE
            </div>
            
            <h2 ref={headingRef} className="font-display text-4xl md:text-5xl lg:text-5xl font-extralight tracking-tight mt-2 mb-8 text-foreground/90 leading-tight">
              Crafting Immersive <br className="hidden md:block"/>
              <span className="text-foreground font-normal">Digital Experiences.</span>
            </h2>
            
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed md:leading-loose mb-10 max-w-2xl">
              I'm an <strong className="font-medium text-foreground">IT Specialist</strong> focused on
              <strong className="font-medium text-foreground"> troubleshooting</strong>,
              <strong className="font-medium text-foreground"> system administration</strong>, and
              <strong className="font-medium text-foreground"> user support</strong>. I enjoy keeping
              environments stable and secure, and I build simple automation and tools that make day-to-day work faster.
            </p>

            {/* CTA */}
            <div className="flex justify-start mb-14">
              <Button
                variant="outline"
                className="bg-[#0a0b0c] border-[#28282c] text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-colors rounded-none px-8 font-mono tracking-wide text-xs"
                asChild
              >
                <a href={resumePdf} download="Ali_Oudah_Resume.pdf">
                  [ DOWNLOAD_CV ]
                </a>
              </Button>
            </div>

            {/* Capability Matrix */}
            <div>
              <h3 className="text-xs font-mono tracking-widest text-muted-foreground mb-4 uppercase">Capability Matrix</h3>
              <div ref={skillsRef} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="group flex flex-col items-center justify-center gap-3 p-6 bg-[#0a0b0c]/50 border border-[#28282c] hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 relative overflow-hidden"
                    style={{ ['--tech-color' as unknown as keyof CSSProperties]: `#${skill.icon.hex}` } as CSSProperties}
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tech-color)_0%,transparent_70%)] opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
                    
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      viewBox="0 0 24 24"
                      className="tech-icon h-8 w-8 text-muted-foreground/30 group-hover:text-[color:var(--tech-color)] transition-colors duration-300"
                    >
                      <path d={skill.icon.path} fill="currentColor" />
                    </svg>
                    <span className="text-xs font-mono tracking-widest text-muted-foreground/50 transition-colors duration-300 group-hover:text-foreground/90">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Identity Card (Right) */}
          <div ref={cardRef} className="relative w-full h-full min-h-[500px]">
            <div className="absolute inset-0 bg-[#0a0b0c] border border-[#28282c] rounded-xl flex flex-col overflow-hidden shadow-2xl">
              
              {/* Card Header */}
              <div className="flex justify-between items-center px-4 py-3 border-b border-[#28282c] bg-white/[0.02]">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">v2.4.0-DEPLOYED</span>
              </div>

              {/* Profile Image with Scan-lines */}
              <div className="relative flex-1 bg-black/50 overflow-hidden flex items-end justify-center min-h-[300px]">
                {/* Background ambient glow inside card */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,theme(colors.primary.DEFAULT/0.15)_0%,transparent_60%)]" />
                
                {/* CSS Scan-lines overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 z-20" 
                  style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} 
                />

                <img
                  src={profileImage}
                  alt="Ali Oudah - IT Specialist"
                  className="relative z-10 w-[85%] h-auto object-contain select-none pointer-events-none origin-bottom scale-105 filter grayscale-[20%] contrast-125"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0) 100%)',
                  }}
                />
                
                {/* Crosshair accents */}
                <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-primary/50 opacity-50" />
                <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-primary/50 opacity-50" />
                <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-primary/50 opacity-50" />
                <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-primary/50 opacity-50" />
              </div>

              {/* System Logs (Footer) */}
              <div className="p-4 border-t border-[#28282c] bg-white/[0.01] flex flex-col gap-2">
                 <h4 className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-mono mb-2">System Telemetry</h4>
                 <LiveStatus city={CITY} timeZone={TIMEZONE} />
                 <SpotifyNowPlaying />
              </div>

            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default About;
