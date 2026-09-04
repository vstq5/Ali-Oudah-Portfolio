import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { name: 'Work', href: '#projects' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-canvas/80 backdrop-blur-md border-b border-rule'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="shell flex w-full items-center justify-between py-4">
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('#hero');
          }}
          className="text-[17px] font-semibold tracking-tight text-ink transition-colors hover:text-ink-muted"
        >
          Ali Oudah
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="text-sm text-ink-muted hover:text-ink transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-ink transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
          <Button
            size="sm"
            className="ml-2 h-10 rounded-[8px] border-0 bg-ink px-5 text-sm font-medium text-canvas transition-colors hover:bg-band"
            onClick={() => scrollToSection('#contact')}
          >
            Talk about your setup
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-ink p-2 hover:text-ink-muted transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 top-[61px] bg-canvas/95 backdrop-blur-lg border-t border-rule transition-all duration-300 ${
          isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col p-8 gap-2">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="text-3xl font-display text-ink hover:text-ink-muted transition-colors py-4 border-b border-rule"
            >
              {link.name}
            </a>
          ))}
          <Button
            className="mt-8 h-12 w-full rounded-[10px] bg-ink text-base font-medium text-canvas hover:bg-band"
            onClick={() => scrollToSection('#contact')}
          >
            Talk about your setup
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
