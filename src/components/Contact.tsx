import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Github, Linkedin, Mail, Send } from 'lucide-react';
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
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.4,
          stagger: 0.1,
          ease: 'back.out(1.7)',
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
    const subject = encodeURIComponent(`Portfolio message from ${formData.name}`);
    const body = encodeURIComponent(
      [`Name: ${formData.name}`, `Email: ${formData.email}`, '', formData.message].join('\n')
    );

    window.location.href = `mailto:${TO_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    // Animate button
    gsap.to(e.currentTarget.querySelector('button[type="submit"]'), {
      scale: 0.95,
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
        toast.success('Message sent successfully!', {
          description: "I'll get back to you as soon as possible.",
        });
        setFormData({ name: '', email: '', message: '' });
        return;
      }

      // If API isn't configured (or any error), fall back to mailto.
      toast.message('Almost there — sending via email app', {
        description: 'If the form send is not configured, your email app will open as a fallback.',
      });
      openMailtoFallback();
    } catch {
      toast.message('Opening email app…', {
        description: 'Unable to send automatically. Your email app will open as a fallback.',
      });
      openMailtoFallback();
    } finally {
      setIsSubmitting(false);
    }
  };

  const socials = [
    { icon: Github, href: 'https://github.com/vstq5', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/ali-oudah', label: 'LinkedIn' },
    { icon: Mail, href: `mailto:${TO_EMAIL}`, label: 'Email' },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-[radial-gradient(circle_at_center,hsl(var(--secondary)/0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="text-center mb-12">
            <span className="text-primary text-sm uppercase tracking-widest">Get in Touch</span>
            <h2 ref={headerTextRef} className="text-3xl md:text-4xl lg:text-5xl font-light mt-4">
              Let's <span className="text-primary font-medium">Connect</span>
            </h2>
            <p className="text-muted-foreground mt-4">
              Need help with IT support, troubleshooting, setup, or automation? Send a message and I’ll get back to you.
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
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-background border border-primary/20 focus:border-primary/60 hover:border-primary/40 focus:ring-primary/20 h-12 px-4 transition-all duration-300 rounded-lg"
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-background border border-primary/20 focus:border-primary/60 hover:border-primary/40 focus:ring-primary/20 h-12 px-4 transition-all duration-300 rounded-lg"
              />
            </div>
            <Textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
              className="bg-background border border-primary/20 focus:border-primary/60 hover:border-primary/40 focus:ring-primary/20 resize-none px-4 py-3 transition-all duration-300 rounded-xl"
            />
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-glow-primary h-12"
            >
              <Send className="mr-2" size={18} />
              {isSubmitting ? 'Sending…' : 'Send Message'}
            </Button>
          </form>

          {/* Social links */}
          <div
            ref={socialsRef}
            className="flex items-center justify-center gap-4 mt-12"
          >
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border border-primary/20 bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/60 hover:shadow-[0_0_20px_hsl(15,100%,55%,0.3)] transition-all duration-300"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
