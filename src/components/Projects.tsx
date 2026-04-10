import { useEffect, useRef, MouseEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    tag: 'PRJ_01',
    title: '3D Interactive Web',
    description: 'Frontend development with 3D elements and Spline integration',
    image: '/assets/project-1-20260104.png',
    tech: ['React', 'Spline', 'GSAP'],
  },
  {
    id: 2,
    tag: 'PRJ_02',
    title: 'Aafaq Education Help Center',
    description: 'A comprehensive help center for Aafaq Education, featuring a knowledge base, searchable articles, and popular categories to assist users.',
    image: '/assets/aafaq-help-center-v2.png',
    tech: ['Zendesk', 'Custom UI', 'Knowledge Base'],
    projectUrl: 'https://help.aafaqeducation.com/',
  },
  {
    id: 3,
    tag: 'PRJ_03',
    title: '3D Animated Portfolio',
    description: 'My own personal portfolio',
    image: '/assets/project-3-20260104.png',
    tech: ['Vite', 'React', 'TypeScript', 'Tailwind', 'GSAP'],
    githubUrl: 'https://github.com/vstq5/Ali-Oudah-Portfolio',
  },
  {
    id: 4,
    tag: 'PRJ_04',
    title: 'Tribute To Redbull',
    description: 'A high-performance 3D tribute to Oracle Red Bull Racing, featuring immersive telemetry and a dynamic RB20 car experience.',
    image: '/assets/redbull-tribute.png',
    tech: ['Next.js', 'Spline', 'GSAP', 'Tailwind'],
    projectUrl: 'https://redbull-tribute.vercel.app/',
    githubUrl: 'https://github.com/vstq5/RedBull-Tribute',
  },
  {
    id: 5,
    tag: 'PRJ_05',
    title: 'Web Animation Tools',
    description: 'Building fast, reliable results with top animation tools',
    image: '/assets/project-5-20260104.png',
    tech: ['React', 'GSAP', 'Framer'],
  },
  {
    id: 6,
    tag: 'PRJ_06',
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
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Cards staggered entry
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 75%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden bg-background"
    >
      <div className="container mx-auto px-6">
        {/* Header - Engineering Aesthetic */}
        <div ref={headerRef} className="flex flex-col items-start mb-16 border-b border-[#28282c] pb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs font-mono text-primary tracking-[0.2em] bg-primary/10 px-2 py-1">
              MODULE // 03
            </span>
            <div className="h-px bg-[#28282c] grow min-w-[50px] w-12" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white mb-4">
            Command <span className="font-medium text-primary">Executions</span>
          </h2>
          <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest max-w-xl">
            A comprehensive log of deployed systems, front-end architectures, and interactive 3D experiences.
          </p>
        </div>

        {/* Projects Grid */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              onMouseMove={handleMouseMove}
              className="group relative bg-[#0a0b0c] border border-[#28282c] overflow-hidden transition-colors duration-500 hover:border-primary/50"
            >
              {/* Radial Mouse Spotlight Effect */}
              <div 
                className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                style={{
                  background: 'radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(83, 58, 253, 0.15), transparent 40%)'
                }}
              />
              
              {/* Top Bar - Identity */}
              <div className="flex justify-between items-center px-4 py-2 border-b border-[#28282c] bg-[#0a0b0c] z-20 relative">
                <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase group-hover:text-primary transition-colors">
                  [ {project.tag} ]
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-none bg-green-500/80 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase group-hover:text-white transition-colors">
                    STATUS: OK
                  </span>
                </div>
              </div>

              {/* Image with Grayscale Filter */}
              <div className="relative h-48 overflow-hidden z-20 bg-[#08090a]">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-all duration-700 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#0a0b0c]/10 mix-blend-color z-10" />
                
                {/* Scanline Overlay */}
                <div 
                  className="absolute inset-0 z-20 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)',
                    backgroundSize: '100% 4px'
                  }}
                />

                {/* Hover overlay links */}
                <div className="absolute inset-0 bg-[#0a0b0c]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-30 backdrop-blur-[2px]">
                  {project.projectUrl && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-[#28282c] bg-transparent hover:bg-primary hover:border-primary text-white rounded-none transition-all duration-300"
                      asChild
                    >
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} project link`}
                      >
                        <ExternalLink size={18} />
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-[#28282c] bg-transparent hover:bg-white hover:text-black hover:border-white text-white rounded-none transition-all duration-300"
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
                  )}
                </div>
              </div>

              {/* Content Panel */}
              <div className="p-6 relative z-20 bg-[#0a0b0c]">
                <h3 className="text-xl font-light tracking-tight mb-2 group-hover:text-primary transition-colors text-white">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed font-light line-clamp-2">
                  {project.description}
                </p>

                {/* Technical Stack Tags */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono tracking-widest px-2 py-1 border border-[#28282c] text-muted-foreground bg-[#0a0b0c] uppercase group-hover:border-primary/30 transition-colors"
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
