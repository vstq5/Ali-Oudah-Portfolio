import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Github, Linkedin, Mail, Send, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const TO_EMAIL = 'alialoudah5@gmail.com';

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerTextRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Headline Text Split Reveal
      if (headerTextRef.current) {
        const splitTitle = new SplitType(headerTextRef.current, { types: 'lines,words' });
        gsap.set(splitTitle.lines, { overflow: 'hidden' });

        if (!prefersReducedMotion) {
          gsap.fromTo(
            splitTitle.words,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.07,
              force3D: true,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
              },
            }
          );
        }
      }

      // Form inputs animation
      const formElements = formRef.current?.querySelectorAll('input, textarea, button');
      if (formElements) {
        gsap.fromTo(
          formElements,
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // Social icons animation
      gsap.fromTo(
        socialsRef.current?.children || [],
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: socialsRef.current,
            start: 'top 90%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openMailtoFallback = () => {
    const subject = encodeURIComponent(`Payload from ${formData.name}`);
    const body = encodeURIComponent(
      [`[SENDER]: ${formData.name}`, `[CONTACT]: ${formData.email}`, '---', formData.message].join('\n')
    );

    window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    // Animate button
    gsap.to(e.currentTarget.querySelector('button[type="submit"]'), {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success('TRANSMISSION SUCCESSFUL', {
          description: "STATUS: OK - Response pending.",
        });
        setFormData({ name: '', email: '', message: '' });
        return;
      }

      // Fallback
      toast.message('LOCAL CLIENT FALLBACK INITIATED', {
        description: 'Routing through local mail client...',
      });
      openMailtoFallback();
    } catch {
      toast.message('LOCAL CLIENT FALLBACK INITIATED', {
        description: 'Routing through local mail client...',
      });
      openMailtoFallback();
    } finally {
      setIsSubmitting(false);
    }
  };

  const socials = [
    { icon: Github, href: 'https://github.com/vstq5', label: 'GITHUB' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/ali-oudah', label: 'LINKEDIN' },
    { icon: Mail, href: `mailto:${TO_EMAIL}`, label: 'EMAIL_PROTO' },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-32 relative overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="text-left mb-16 border-b border-border/40 pb-6">
            <div className="flex items-center gap-3 text-primary text-xs font-mono uppercase tracking-[0.2em] mb-4">
              <Terminal size={14} /> SECURE_COMMS
            </div>
            <h2 ref={headerTextRef} className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight">
              Initiate <span className="text-primary font-medium">Uplink</span>
            </h2>
            <p className="text-muted-foreground mt-4 font-mono text-sm max-w-xl">
              &gt; STANDBY FOR TRANSMISSION. 
              REQUIRE IT SUPPORT, SYSTEM TROUBLESHOOTING, OR STRUCTURAL ARCHITECTURE? 
              ENTER PAYLOAD BELOW.
            </p>
          </div>

          {/* Form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-6">
              <Input
                type="text"
                placeholder="[ IDENTIFIER ]"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-[#08090a] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] border border-primary/20 focus:border-primary/60 hover:border-primary/40 focus:ring-primary/20 h-14 px-4 transition-all duration-300 rounded-none font-mono text-sm uppercase placeholder:text-muted-foreground/50"
              />
              <Input
                type="email"
                placeholder="[ RETURN_ADDRESS ]"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-[#08090a] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] border border-primary/20 focus:border-primary/60 hover:border-primary/40 focus:ring-primary/20 h-14 px-4 transition-all duration-300 rounded-none font-mono text-sm uppercase placeholder:text-muted-foreground/50"
              />
            </div>
            <Textarea
              placeholder="> ENTER_PAYLOAD..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="bg-[#08090a] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] border border-primary/20 focus:border-primary/60 hover:border-primary/40 focus:ring-primary/20 resize-none px-4 py-4 min-h-[160px] transition-all duration-300 rounded-none font-mono text-sm uppercase placeholder:text-muted-foreground/50"
            />
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-glow-primary h-14 rounded-none font-mono tracking-[0.2em] uppercase"
            >
              <Send className="mr-3" size={16} />
              {isSubmitting ? 'EXECUTING...' : 'EXECUTE_SEND'}
            </Button>
          </form>

          {/* Social links */}
          <div
            ref={socialsRef}
            className="flex flex-wrap items-center justify-start gap-4 mt-16"
          >
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-6 py-3 border border-border/40 bg-[#08090a] text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 rounded-none"
              >
                <social.icon size={16} className="group-hover:scale-110 transition-transform" />
                <span className="font-mono text-xs tracking-widest">{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
