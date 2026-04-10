import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Mail } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
            trigger: footerRef.current,
            start: 'top 95%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative border-t border-border/40 bg-background/80 backdrop-blur-md overflow-hidden"
    >
      <div ref={contentRef} className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-sm font-mono text-muted-foreground">
          
          {/* Column 1: Core ID */}
          <div className="flex flex-col gap-4">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('#hero');
              }}
              className="text-2xl font-light tracking-tight text-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              SYS.ALI <span className="text-primary text-sm bg-primary/10 px-2 py-0.5 ml-2">V2.4</span>
            </a>
            <p className="opacity-70 mt-4 leading-relaxed max-w-xs">
              Designing robust digital architecture and high-performance interfaces.
            </p>
          </div>

          {/* Column 2: Telemetry */}
          <div className="flex flex-col gap-3">
            <span className="text-primary tracking-widest text-xs mb-2">TELEMETRY</span>
            <div className="flex items-center gap-2">
              <span className="opacity-50 w-24">LOCATION</span>
              <span>29.3759° N, 47.9774° E</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="opacity-50 w-24">VERSION</span>
              <span>2.4.0-STABLE</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="opacity-50 w-24">PROTOCOL</span>
              <span>HTTPS_SECURE</span>
            </div>
          </div>

          {/* Column 3: Navigation */}
          <div className="flex flex-col gap-3">
            <span className="text-primary tracking-widest text-xs mb-2">DIRECTORY</span>
            {['#hero', '#about', '#projects', '#contact'].map((href) => (
              <a
                key={href}
                href={href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(href);
                }}
                className="hover:text-primary transition-colors inline-block w-fit"
              >
                &gt; {href.replace('#', '').toUpperCase()}
              </a>
            ))}
          </div>

          {/* Column 4: Links */}
          <div className="flex flex-col gap-3">
            <span className="text-primary tracking-widest text-xs mb-2">EXTERNAL_LINKS</span>
            <a href="https://github.com/vstq5" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
              <Github size={14} /> GITHUB
            </a>
            <a href="https://www.linkedin.com/in/ali-oudah" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors flex items-center gap-2">
              <Linkedin size={14} /> LINKEDIN
            </a>
            <a href="mailto:alialoudah5@gmail.com" className="hover:text-primary transition-colors flex items-center gap-2">
              <Mail size={14} /> EMAIL
            </a>
          </div>

        </div>

        {/* Bottom Banner */}
        <div className="border-t border-border/40 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground/60">
          <p>© {new Date().getFullYear()} ALI ALOSIMI. ALL SYSTEMS OPERATIONAL.</p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
            SECURE CONNECTION ESTABLISHED
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
