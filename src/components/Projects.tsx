import { useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    title: '3D Interactive Web',
    description: 'Frontend development with 3D elements and Spline integration',
    image: '/assets/project-1-20260104.png',
    tech: ['React', 'Spline', 'GSAP'],
  },
  {
    id: 2,
    title: 'Aafaq Education Help Center',
    description: 'A comprehensive help center for Aafaq Education, featuring a knowledge base, searchable articles, and popular categories to assist users.',
    image: '/assets/aafaq-help-center-v2.png',
    tech: ['Zendesk', 'Custom UI', 'Knowledge Base'],
    projectUrl: 'https://help.aafaqeducation.com/',
  },
  {
    id: 3,
    title: '3D Animated Portfolio',
    description: 'My own personal portfolio',
    image: '/assets/project-3-20260104.png',
    tech: ['Vite', 'React', 'TypeScript', 'Tailwind', 'GSAP'],
    githubUrl: 'https://github.com/vstq5/Ali-Oudah-Portfolio',
  },
  {
    id: 4,
    title: 'Tribute To Redbull',
    description: 'A high-performance 3D tribute to Oracle Red Bull Racing, featuring immersive telemetry and a dynamic RB20 car experience.',
    image: '/assets/redbull-tribute.png',
    tech: ['Next.js', 'Spline', 'GSAP', 'Tailwind'],
    projectUrl: 'https://redbull-tribute.vercel.app/',
    githubUrl: 'https://github.com/vstq5/RedBull-Tribute',
  },
  {
    id: 5,
    title: 'Web Animation Tools',
    description: 'Building fast, reliable results with top animation tools',
    image: '/assets/project-5-20260104.png',
    tech: ['React', 'GSAP', 'Framer'],
  },
  {
    id: 6,
    title: 'Playlist Downloader',
    description: 'A service to download tracks and playlists from Spotify, YouTube, and SoundCloud',
    image: '/assets/project-6-20260104.png',
    tech: ['TypeScript', 'Python', 'CSS'],
    githubUrl: 'https://github.com/vstq5/playlist_downloader',
  },
];

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerTextRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Header animation - simplified
      gsap.fromTo(
        headerRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Heading stagger reveal (words)
      if (headerTextRef.current) {
        const splitTitle = new SplitType(headerTextRef.current, { types: 'lines,words' });
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

      // Cards stagger animation - optimized with simpler transforms
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-[radial-gradient(circle_at_center,hsl(var(--secondary)/0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.15)_0%,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 flex flex-col items-center">
          <span className="text-primary text-sm uppercase tracking-widest">Portfolio</span>
          <div className="relative mt-4">
            {/* Ambient spotlight */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[640px] h-[220px] rounded-full bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15)_0%,transparent_70%)] opacity-50" />
            <h2 ref={headerTextRef} className="relative text-3xl md:text-4xl lg:text-5xl font-light">
              Featured <span className="inline-block text-primary font-medium">Projects</span>
            </h2>
          </div>
        </div>

        {/* Projects grid */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project: any) => (
            <div
              key={project.id}
              className="group overflow-hidden bg-background border border-primary/20 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_hsl(15,100%,55%,0.3)] hover:border-primary/70"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <Button
                    size="icon"
                    variant="outline"
                    className="border-foreground/20 hover:bg-primary hover:border-primary"
                    asChild
                  >
                    <a
                      href={project.projectUrl || '#'}
                      target={project.projectUrl ? "_blank" : undefined}
                      rel={project.projectUrl ? "noopener noreferrer" : undefined}
                      aria-label={`${project.title} project link`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  </Button>
                  {project.githubUrl ? (
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-foreground/20 hover:bg-secondary hover:border-secondary hover:text-secondary-foreground"
                      asChild
                    >
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} on GitHub`}
                      >
                        <Github size={18} />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-foreground/20 hover:bg-secondary hover:border-secondary hover:text-secondary-foreground"
                    >
                      <Github size={18} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {project.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech: string) => (
                    <span
                      key={tech}
                      className="text-xs px-3 py-1 rounded-full border border-primary/30 text-primary bg-primary/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
