import { useEffect, useState } from 'react';

const MARQUEE_REPEATS = 8;

const links = [
  { label: 'GitHub', href: 'https://github.com/vstq5' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ali-oudah' },
  { label: 'Email', href: 'mailto:alialoudah5@gmail.com' },
];

const kuwaitTime = () =>
  new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kuwait',
  }).format(new Date());

const Footer = () => {
  const [time, setTime] = useState(kuwaitTime);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(kuwaitTime()), 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const names = Array.from({ length: MARQUEE_REPEATS }, (_, i) => (
    <span key={i} className="pr-14">
      Ali Oudah <span className="text-band-rule">·</span>
    </span>
  ));

  return (
    <footer className="relative bg-band-deep border-t border-band-rule overflow-hidden">
      {/* name marquee */}
      <div aria-hidden className="overflow-hidden py-8 md:py-12">
        <div className="footer-marquee [animation:footerMarquee_48s_linear_infinite] flex whitespace-nowrap will-change-transform w-max">
          <div className="flex font-display font-medium tracking-tight leading-none text-band-rule text-[clamp(3.5rem,10vw,8rem)]">
            {names}
          </div>
          <div className="flex font-display font-medium tracking-tight leading-none text-band-rule text-[clamp(3.5rem,10vw,8rem)]">
            {names}
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div
        className="shell flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-band-rule py-6 text-xs text-band-muted"
      >
        <span>&copy; {new Date().getFullYear()} Ali Oudah</span>
        <span>
          Kuwait City &middot; {time} <span className="text-ink-subtle">UTC+3</span>
        </span>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              {...(l.href.startsWith('http')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              className="hover:text-band-ink transition-colors duration-150"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
