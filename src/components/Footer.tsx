import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 40, filter: 'blur(5px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  const socials = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@alioudah.dev', label: 'Email' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative py-16 border-t border-border overflow-hidden"
    >
      {/* Floating particles */}
      <div className="absolute top-0 left-1/4 w-2 h-2 bg-primary/40 rounded-full animate-float" />
      <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-secondary/40 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-secondary/30 rounded-full animate-float" style={{ animationDelay: '3s' }} />

      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/5 rounded-full blur-3xl" />

      <div ref={contentRef} className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#hero');
            }}
            className="text-3xl font-light tracking-tight mb-6"
          >
            Ali<span className="text-primary font-medium">.</span>
          </a>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-6 mb-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Social icons */}
          <div className="flex items-center gap-4 mb-8">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all duration-300"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © 2026 Ali Oudah. Made with{' '}
            <Heart className="w-4 h-4 text-primary fill-primary" /> and code.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
