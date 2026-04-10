import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState<string>('00:00:00');

  useEffect(() => {
    // Clock interval
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 50;
        setScrolled((prev) => (prev === nextScrolled ? prev : nextScrolled));
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'HOME', href: '#hero' },
    { name: 'ABOUT', href: '#about' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'CONTACT', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-background/90 backdrop-blur-md border-border/60 shadow-sm'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="w-full px-6 py-4 flex items-center justify-between">
        
        {/* Left: Branding & Clock */}
        <div className="flex items-center gap-6">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#hero');
            }}
            className="text-lg font-mono font-medium tracking-tight hover:text-primary transition-colors"
          >
            SYS.ALI // <span className="text-primary">2.4.0</span>
          </a>
          
          <div className="hidden md:flex items-center gap-4 text-xs font-mono text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              STATUS: V_UPTIME_OK
            </span>
            <span className="opacity-50">|</span>
            <span>T-MINUS: {time}</span>
          </div>
        </div>

        {/* Right: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors relative group"
            >
              [ {link.name} ]
              <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="font-mono text-xs border-primary/20 bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary transition-all rounded-none ml-4"
            onClick={() => scrollToSection('#contact')}
          >
            EXECUTE_HIRE
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground p-2 hover:text-primary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu (Full Screen Data Terminal) */}
      <div
        className={`md:hidden fixed inset-0 top-[65px] bg-background/95 backdrop-blur-lg border-t border-border transition-all duration-300 ${
          isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-start p-8 h-full gap-8">
          <div className="text-xs font-mono text-muted-foreground mb-4">
            <span className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              SYSTEM.STATUS: ONLINE
            </span>
            <span>LOCAL.TIME: {time}</span>
          </div>
          
          <div className="w-full flex justify-end">
             {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-2xl font-mono text-foreground hover:text-primary transition-colors w-full text-right block py-2 border-b border-border/20"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                [ {link.name} ]
              </a>
            ))}
          </div>

          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-8 rounded-none font-mono tracking-widest"
            onClick={() => scrollToSection('#contact')}
          >
            EXECUTE_HIRE
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
