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
          ? 'bg-[#0A0B0D]/85 backdrop-blur-md border-b border-cream/10'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div
        className="w-full py-4 flex items-center justify-between"
        style={{ paddingLeft: 'clamp(1.5rem, 6vw, 7rem)', paddingRight: 'clamp(1.5rem, 6vw, 7rem)' }}
      >
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('#hero');
          }}
          className="text-base font-medium tracking-tight text-cream hover:text-sand transition-colors"
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
              className="text-sm text-sand/70 hover:text-cream transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-cream/50 transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-5 text-sm font-medium rounded-[8px] border border-cream/20 bg-transparent text-cream hover:bg-cream/10 hover:border-cream/50 transition-colors ml-2"
            onClick={() => scrollToSection('#contact')}
          >
            Get in touch
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-cream p-2 hover:text-sand transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 top-[61px] bg-[#0A0B0D]/95 backdrop-blur-lg border-t border-cream/10 transition-all duration-300 ${
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
              className="text-3xl font-display text-cream hover:text-sand transition-colors py-4 border-b border-cream/10"
            >
              {link.name}
            </a>
          ))}
          <Button
            className="w-full h-12 bg-cream text-[#0A0B0D] hover:bg-white mt-8 rounded-[10px] text-base font-medium"
            onClick={() => scrollToSection('#contact')}
          >
            Get in touch
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
