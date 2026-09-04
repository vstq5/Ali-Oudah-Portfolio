import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

type WorkItem = {
  index: string;
  title: string;
  meta: string;
  description: string;
  image?: string;
  imagePosition?: string;
  fact?: string;
  url?: string;
};

const work: WorkItem[] = [
  {
    index: '01',
    title: 'Gulf Cup Ticketing Operations',
    meta: 'Ticketmaster · Kuwait · 2024–25',
    description:
      'On-site IT support for ticketing platforms during the 26th Arab Gulf Cup. Live-event operations, incident response, and fraud prevention across venues.',
    image: '/assets/gulfcup-badge.jpg',
    imagePosition: 'center 24%',
  },
  {
    index: '02',
    title: 'eBook Fulfillment & University Portal',
    meta: 'Aafaq Education · Node.js · PostgreSQL · In production',
    description:
      'Middleware bridging Shopify, VitalSource, and Zoho Inventory: automated license fulfillment, refunds, catalog sync, and a multi-tenant self-service portal for universities.',
    image: '/assets/portal-catalog.jpg',
    imagePosition: 'top center',
  },
  {
    index: '03',
    title: 'Education Help Center',
    meta: 'Aafaq Education · Zendesk · Live',
    description:
      'Knowledge base and support center with searchable articles, categories, and self-service flows for students and faculty.',
    image: '/assets/aafaq-help-center.jpg',
    url: 'https://help.aafaqeducation.com/',
  },
  {
    index: '04',
    title: 'Red Bull Racing Tribute',
    meta: 'Personal · Next.js · Spline · GSAP · Live',
    description:
      'Interactive 3D tribute to Oracle Red Bull Racing with an immersive telemetry-style interface and a dynamic RB20 car experience.',
    image: '/assets/redbull-tribute.jpg',
    url: 'https://redbull-tribute.vercel.app/',
  },
  {
    index: '05',
    title: 'Playlist Downloader',
    meta: 'Open source · TypeScript · Python',
    description:
      'A service to fetch tracks and playlists from Spotify, YouTube, and SoundCloud.',
    fact: 'CLI · GitHub',
    url: 'https://github.com/vstq5/playlist_downloader',
  },
];

const RowInner = ({ item }: { item: WorkItem }) => (
  <>
    <span className="hidden md:block text-xs tracking-[0.2em] text-ink-muted pt-3">{item.index}</span>

    <div>
      <div className="flex items-baseline gap-4">
        <span className="md:hidden text-xs tracking-[0.2em] text-ink-muted">{item.index}</span>
        <h3 className="font-display text-2xl md:text-[2rem] font-medium tracking-tight text-ink group-hover:text-brand transition-colors duration-200 inline-flex items-center gap-2">
          {item.title}
          {item.url && (
            <ArrowUpRight
              size={20}
              className="text-ink-subtle group-hover:text-brand transition-colors duration-200 shrink-0"
            />
          )}
        </h3>
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.14em] text-ink-muted">{item.meta}</p>
      <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-ink-muted max-w-xl">
        {item.description}
      </p>
    </div>

    <div className="w-full md:w-[240px] aspect-[4/3] rounded-lg overflow-hidden border border-rule bg-surface-deep shrink-0">
      {item.image ? (
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
          style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xs uppercase tracking-[0.2em] text-ink-muted">{item.fact}</span>
        </div>
      )}
    </div>
  </>
);

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const [reduce] = useState(prefersReducedMotion);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = rowsRef.current ? Array.from(rowsRef.current.children) : [];

      if (reduce) {
        gsap.set([headingRef.current, ...rows], { opacity: 1, y: 0, yPercent: 0 });
        return;
      }

      gsap.fromTo(
        headingRef.current,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power4.out',
          force3D: true,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%' },
        }
      );

      rows.forEach((row) => {
        gsap.fromTo(
          row,
          { y: 26, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power2.out',
            force3D: true,
            scrollTrigger: { trigger: row, start: 'top 88%' },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduce]);

  const rowClass =
    'group grid grid-cols-1 md:grid-cols-[3.5rem_1fr_240px] gap-5 md:gap-8 items-start md:items-center py-9 md:py-10 border-t border-rule opacity-0';

  return (
    <section id="projects" ref={sectionRef} className="relative bg-canvas py-28 md:py-36">
      <div className="shell">
        <div className="overflow-hidden mb-14 md:mb-16">
          <h2
            ref={headingRef}
            className="font-display opacity-0 text-4xl md:text-5xl font-medium tracking-tight text-ink"
          >
            Selected work.
          </h2>
        </div>

        <div ref={rowsRef} className="border-b border-rule">
          {work.map((item) =>
            item.url ? (
              <a
                key={item.index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={rowClass}
              >
                <RowInner item={item} />
              </a>
            ) : (
              <div key={item.index} className={rowClass}>
                <RowInner item={item} />
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
